import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { screenings, children } from '../../../../db/schema';
import { eq, desc } from 'drizzle-orm';

// Helper to calculate age string from DOB
function calculateAge(dob: string, screeningDate: string): string {
  const birth = new Date(dob);
  const screening = new Date(screeningDate);
  const diffMonths = (screening.getFullYear() - birth.getFullYear()) * 12 + (screening.getMonth() - birth.getMonth());

  if (diffMonths < 12) return `${diffMonths} Bulan`;
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  return months > 0 ? `${years} Tahun ${months} Bulan` : `${years} Tahun`;
}

// Helper to map risk level to badge class
function getBadgeClass(riskLevel: string): string {
  if (riskLevel.includes('Rendah')) return 'badge-success';
  if (riskLevel.includes('Sedang')) return 'badge-warning';
  return 'badge-danger';
}

export async function GET() {
  try {
    const userChildren = await db.select().from(children);
    const childIds = userChildren.map(c => c.id);
    const childMap = Object.fromEntries(userChildren.map(c => [c.id, c]));

    if (childIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const allScreenings = await db.select().from(screenings).orderBy(desc(screenings.date));
    const userScreenings = allScreenings.filter(s => childIds.includes(s.childId));

    const history = userScreenings.map(s => {
      const child = childMap[s.childId];
      return {
        id: s.id.toString(),
        date: new Date(s.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        childName: child?.name || 'Unknown',
        age: child ? calculateAge(child.dateOfBirth, s.date) : '-',
        riskLevel: s.riskLevel,
        statusClass: getBadgeClass(s.riskLevel)
      };
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
  }
}
