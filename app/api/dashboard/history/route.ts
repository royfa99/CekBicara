import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

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
    const { data: userChildren, error: childrenError } = await supabase.from('children').select('*');
    if (childrenError) throw childrenError;

    const childIds = userChildren.map((c: any) => c.id);
    const childMap = Object.fromEntries(userChildren.map((c: any) => [c.id, c]));

    if (childIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data: userScreenings, error: screeningsError } = await supabase
      .from('screenings')
      .select('*')
      .in('child_id', childIds)
      .order('date', { ascending: false });

    if (screeningsError) throw screeningsError;

    const history = userScreenings.map((s: any) => {
      const child = childMap[s.child_id];
      return {
        id: s.id.toString(),
        date: new Date(s.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        childName: child?.name || 'Unknown',
        age: child ? calculateAge(child.date_of_birth, s.date) : '-',
        riskLevel: s.risk_level,
        statusClass: getBadgeClass(s.risk_level)
      };
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
  }
}
