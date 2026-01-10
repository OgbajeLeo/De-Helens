import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Order } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerPhone, 
      items, 
      deliveryType = 'pickup',
      deliveryAddress,
      landmark,
      deliveryFee,
      subtotal,
      total 
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (deliveryType === 'delivery' && !deliveryAddress) {
      return NextResponse.json({ error: 'Delivery address is required for delivery orders' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const order: Order = {
      customerName,
      customerPhone,
      items,
      deliveryType: deliveryType === 'delivery' ? 'delivery' : 'pickup',
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
      landmark: deliveryType === 'delivery' && landmark ? landmark : undefined,
      deliveryFee: deliveryType === 'delivery' && deliveryFee ? parseFloat(deliveryFee) : undefined,
      subtotal: parseFloat(subtotal || total || 0),
      total: parseFloat(total),
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await db.collection<Order>('orders').insertOne(order);
    return NextResponse.json({ ...order, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const orders = await db.collection<Order>('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // Convert ObjectId to string for JSON response
    const ordersWithStringIds = orders.map(order => ({
      ...order,
      _id: order._id?.toString(),
    }));
    
    return NextResponse.json(ordersWithStringIds);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
