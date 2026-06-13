import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { screenings, screeningAnswers, screeningResults } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

// GET /api/screenings/[id] — get single screening with answers and result
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    const [screening] = await db.select().from(screenings).where(eq(screenings.id, id));
    if (!screening) {
      return NextResponse.json({ success: false, error: 'Screening not found' }, { status: 404 });
    }

    const answers = await db.select().from(screeningAnswers)
      .where(eq(screeningAnswers.screeningId, id));

    const [result] = await db.select().from(screeningResults)
      .where(eq(screeningResults.screeningId, id));

    return NextResponse.json({
      success: true,
      data: {
        ...screening,
        answers,
        result: result ? {
          redFlags: JSON.parse(result.redFlags),
          strengths: JSON.parse(result.strengths),
          recommendations: JSON.parse(result.recommendations),
          stimulationPlan: JSON.parse(result.stimulationPlan)
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching screening:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch screening' }, { status: 500 });
  }
}

// DELETE /api/screenings/[id] — delete screening and related data
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await db.delete(screeningAnswers).where(eq(screeningAnswers.screeningId, id));
    await db.delete(screeningResults).where(eq(screeningResults.screeningId, id));
    const [deleted] = await db.delete(screenings).where(eq(screenings.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Screening not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { message: 'Screening deleted' } });
  } catch (error) {
    console.error('Error deleting screening:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete screening' }, { status: 500 });
  }
}
