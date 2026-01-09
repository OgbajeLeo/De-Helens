import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export interface Settings {
  _id?: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  enableNotifications: boolean;
  enableEmailAlerts: boolean;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get the first settings document (there should only be one)
    const settings = await db.collection<Settings>('settings').findOne({});
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        restaurantName: "De Helen's Taste",
        email: "example@email.com",
        phone: "+64 958 248 966",
        address: "",
        currency: "NGN",
        taxRate: 0,
        enableNotifications: true,
        enableEmailAlerts: false,
      });
    }
    
    return NextResponse.json({
      ...settings,
      _id: settings._id?.toString(),
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch settings',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      restaurantName,
      email,
      phone,
      address,
      currency,
      taxRate,
      enableNotifications,
      enableEmailAlerts,
    } = body;

    const client = await clientPromise;
    const db = client.db();

    const settingsData: Settings = {
      restaurantName: restaurantName || "De Helen's Taste",
      email: email || "",
      phone: phone || "",
      address: address || "",
      currency: currency || "NGN",
      taxRate: taxRate || 0,
      enableNotifications: enableNotifications !== false,
      enableEmailAlerts: enableEmailAlerts || false,
      updatedAt: new Date(),
    };

    // Upsert settings (update if exists, insert if not)
    const result = await db.collection<Settings>('settings').updateOne(
      {},
      { $set: settingsData },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Settings saved successfully',
      ...settingsData
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ 
      error: 'Failed to save settings',
      details: error.message 
    }, { status: 500 });
  }
}
