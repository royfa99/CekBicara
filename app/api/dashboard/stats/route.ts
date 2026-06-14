import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // TODO: Filter by authenticated user once auth is implemented
    const { data: userChildren, error: childrenError } = await supabase.from('children').select('id, name');
    if (childrenError) throw childrenError;

    const childIds = userChildren.map(c => c.id);

    let totalSkrining = 0;
    let latestRiskLevel = '-';
    let latestDate = '-';
    let allScreeningsData: any[] = [];

    if (childIds.length > 0) {
      const { data: allScreenings, error: screeningsError } = await supabase
        .from('screenings')
        .select('*')
        .in('child_id', childIds)
        .order('date', { ascending: false });

      if (screeningsError) throw screeningsError;

      console.log('STATS API - childIds:', childIds);
      console.log('STATS API - allScreenings:', allScreenings);

      allScreeningsData = allScreenings;
      totalSkrining = allScreenings.length;

      if (allScreenings.length > 0) {
        latestRiskLevel = allScreenings[0].risk_level;
        latestDate = allScreenings[0].date;
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
