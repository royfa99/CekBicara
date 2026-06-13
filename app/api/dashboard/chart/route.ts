import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { screenings, children } from '../../../../db/schema';
import { eq, asc } from 'drizzle-orm';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export async function GET() {
  try {
    const userChildren = await db.select().from(children);
    const childIds = userChildren.map(c => c.id);

    if (childIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const allScreenings = await db.select().from(screenings).orderBy(asc(screenings.date));
    const userScreenings = allScreenings.filter(s => childIds.includes(s.childId));

    const chartData = userScreenings.map(s => {
      const date = new Date(s.date);
      return {
        month: MONTH_NAMES[date.getMonth()],
        score: s.score ?? 50 // fallback to 50 if no score
      };
    });

    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch chart data' }, { status: 500 });
  }
}
