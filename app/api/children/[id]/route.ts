import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { children, screenings, screeningAnswers, screeningResults } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

// GET /api/children/[id] — get single child
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const [child] = await db.select().from(children).where(eq(children.id, id));

    if (!child) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: child });
  } catch (error) {
    console.error('Error fetching child:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch child' }, { status: 500 });
  }
}

// PUT /api/children/[id] — update child
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, dateOfBirth, gender, isPremature, gestationalAge, familyHistory } = body;

    const [updated] = await db.update(children)
      .set({
        ...(name && { name }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender }),
        ...(isPremature !== undefined && { isPremature }),
        ...(gestationalAge !== undefined && { gestationalAge }),
        ...(familyHistory && { familyHistory }),
      })
      .where(eq(children.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating child:', error);
    return NextResponse.json({ success: false, error: 'Failed to update child' }, { status: 500 });
  }
}

// DELETE /api/children/[id] — delete child and cascade
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    // Get all screenings for this child to cascade delete
    const childScreenings = await db.select().from(screenings).where(eq(screenings.childId, id));

    for (const screening of childScreenings) {
      await db.delete(screeningAnswers).where(eq(screeningAnswers.screeningId, screening.id));
      await db.delete(screeningResults).where(eq(screeningResults.screeningId, screening.id));
    }

    await db.delete(screenings).where(eq(screenings.childId, id));
    const [deleted] = await db.delete(children).where(eq(children.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { message: 'Child and related data deleted' } });
  } catch (error) {
    console.error('Error deleting child:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete child' }, { status: 500 });
  }
}
