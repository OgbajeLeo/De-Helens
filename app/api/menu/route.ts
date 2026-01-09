import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { MenuItem } from '@/lib/models';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menu = await db.collection<MenuItem>('menu').find({ available: true }).toArray();
    
    // Convert ObjectIds to strings for JSON response
    const menuWithStringIds = menu.map(item => ({
      ...item,
      _id: item._id?.toString(),
    }));
    
    return NextResponse.json(menuWithStringIds);
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    const errorMessage = error.message || 'Failed to fetch menu';
    
    // Provide helpful error messages
    if (errorMessage.includes('MongoServerError') || errorMessage.includes('MongoNetworkError')) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Please check your MONGODB_URI in .env.local file',
        hint: 'Make sure the file is named .env.local (with a dot) and contains a valid connection string'
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, image, available } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const menuItem: MenuItem = {
      name,
      description,
      price: parseFloat(price),
      category: category as 'shawama' | 'drinks' | 'food' | 'protein',
      image: image || '',
      available: available !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<MenuItem>('menu').insertOne(menuItem);
    return NextResponse.json({ ...menuItem, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    const errorMessage = error.message || 'Failed to create menu item';
    
    if (errorMessage.includes('MongoServerError') || errorMessage.includes('MongoNetworkError')) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Please check your MONGODB_URI in .env.local file'
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
