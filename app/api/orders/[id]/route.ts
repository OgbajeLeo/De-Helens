import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { Order } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const order = await db.collection<Order>('orders').findOne({
      _id: new ObjectId(id),
    } as any);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Convert ObjectId to string for JSON response
    return NextResponse.json({
      ...order,
      _id: order._id?.toString(),
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch order',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection<Order>('orders').updateOne(
      { _id: new ObjectId(id) } as any,
      { 
        $set: { 
          status: status as Order['status'],
          updatedAt: new Date(),
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch the updated order
    const updatedOrder = await db.collection<Order>('orders').findOne({
      _id: new ObjectId(id),
    } as any);

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found after update' }, { status: 404 });
    }

    // Convert ObjectId to string for JSON response
    return NextResponse.json({
      ...updatedOrder,
      _id: updatedOrder._id?.toString(),
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ 
      error: 'Failed to update order',
      details: error.message 
    }, { status: 500 });
  }
}
