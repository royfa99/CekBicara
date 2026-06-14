import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export async function GET() {
  try {
    const { data: userChildren, error: childrenError } = await supabase.from('children').select('id');
    if (childrenError) throw childrenError;

    const childIds = userChildren.map((c: any) => c.id);

    if (childIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data: userScreenings, error: screeningsError } = await supabase
      .from('screenings')
      .select('*')
      .in('child_id', childIds)
      .order('date', { ascending: true });

    if (screeningsError) throw screeningsError;

    const chartData = userScreenings.map((s: any) => {
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
