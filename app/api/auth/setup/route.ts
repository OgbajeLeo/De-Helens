import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { Admin } from '@/lib/models';

// This route is for initial admin setup
// Call this once to create the admin user
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if admin already exists
    const existingAdmin = await db.collection<Admin>('admins').findOne({ username });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin: Admin = {
      username,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await db.collection<Admin>('admins').insertOne(admin);

    return NextResponse.json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json({ error: 'Failed to setup admin' }, { status: 500 });
  }
}
