import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { screenings, children } from '../../../../db/schema';
import { eq, desc, count } from 'drizzle-orm';

export async function GET() {
  try {
    // TODO: Filter by authenticated user once auth is implemented
    const userChildren = await db.select().from(children);
    const childIds = userChildren.map(c => c.id);

    let totalSkrining = 0;
    let latestRiskLevel = '-';
    let latestDate = '-';

    if (childIds.length > 0) {
      // Get all screenings for all children of this user
      const allScreenings = await db.select().from(screenings)
        .orderBy(desc(screenings.date));

      const userScreenings = allScreenings.filter(s => childIds.includes(s.childId));
      totalSkrining = userScreenings.length;

      if (userScreenings.length > 0) {
        latestRiskLevel = userScreenings[0].riskLevel;
        latestDate = userScreenings[0].date;
      }
    }

    // Compute next evaluation date (1 month from latest screening)
    let evaluasiBerikutnya = '-';
    if (latestDate !== '-') {
      const lastDate = new Date(latestDate);
      lastDate.setMonth(lastDate.getMonth() + 1);
      evaluasiBerikutnya = lastDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSkrining,
        latestRiskLevel,
        evaluasiBerikutnya
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
