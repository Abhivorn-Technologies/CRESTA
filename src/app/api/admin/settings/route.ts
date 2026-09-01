import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Setting } from '@/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Setting.findOne();
    
    // If no settings document exists, create a default one
    if (!settings) {
      settings = await Setting.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    
    // There should only be one settings document
    let settings = await Setting.findOne();
    
    if (settings) {
      settings = await Setting.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      settings = await Setting.create(data);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
