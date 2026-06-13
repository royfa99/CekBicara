import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { children } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

// GET /api/children — list all children for user (hardcoded userId=1 for now)
export async function GET() {
  try {
    const allChildren = await db.select().from(children);
    return NextResponse.json({ success: true, data: allChildren });
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch children' }, { status: 500 });
  }
}

// POST /api/children — create a new child
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dateOfBirth, gender, isPremature, gestationalAge, familyHistory } = body;

    if (!name || !dateOfBirth || !gender) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, dateOfBirth, gender' }, { status: 400 });
    }

    const [newChild] = await db.insert(children).values({
      userId: 1, // hardcoded for now
      name,
      dateOfBirth,
      gender,
      isPremature: isPremature || false,
      gestationalAge: gestationalAge || null,
      familyHistory: familyHistory || 'tidak',
      createdAt: new Date().toISOString()
    }).returning();

    return NextResponse.json({ success: true, data: newChild }, { status: 201 });
  } catch (error) {
    console.error('Error creating child:', error);
    return NextResponse.json({ success: false, error: 'Failed to create child' }, { status: 500 });
  }
}
