import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { MenuItem } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid menu item ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const menuItem = await db.collection<MenuItem>('menu').findOne({
      _id: new ObjectId(id),
    } as any);

    if (!menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    // Convert ObjectId to string for JSON response
    return NextResponse.json({
      ...menuItem,
      _id: menuItem._id?.toString(),
    });
  } catch (error: any) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch menu item',
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
      return NextResponse.json({ error: 'Invalid menu item ID' }, { status: 400 });
    }
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const updateData: Partial<MenuItem> = {
      ...body,
      updatedAt: new Date(),
    };

    // Remove _id from update data if present (can't update _id)
    delete (updateData as any)._id;

    if (body.price) {
      updateData.price = parseFloat(body.price);
    }

    const result = await db.collection<MenuItem>('menu').updateOne(
      { _id: new ObjectId(id) } as any,
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const updatedItem = await db.collection<MenuItem>('menu').findOne({
      _id: new ObjectId(id),
    } as any);

    if (!updatedItem) {
      return NextResponse.json({ error: 'Menu item not found after update' }, { status: 404 });
    }

    return NextResponse.json({
      ...updatedItem,
      _id: updatedItem._id?.toString(),
    });
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ 
      error: 'Failed to update menu item',
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid menu item ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection<MenuItem>('menu').deleteOne({
      _id: new ObjectId(id),
    } as any);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ 
      error: 'Failed to delete menu item',
      details: error.message 
    }, { status: 500 });
  }
}
