import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { createClient } from '../../../../utils/supabase/server';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aburoyyan07@gmail.com';

export async function GET() {
  try {
    // SECURITY CHECK: Ensure user is logged in and is the admin
    const supabaseServer = createClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', isDenied: true }, { status: 401 });
    }

    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Access Denied: Admins Only', isDenied: true }, { status: 403 });
    }

    // 1. Get total users (distinct user_id in children table)
    // Supabase JS doesn't have a direct distinct count, so we fetch the user_ids and count unique
    const { data: childrenData, error: childrenError } = await supabase
      .from('children')
      .select('user_id');

    if (childrenError) throw childrenError;

    const uniqueUsers = new Set(childrenData?.map(c => c.user_id));
    const totalUsers = uniqueUsers.size;

    // 2. Get total screenings
    const { count: totalScreenings, error: screeningsError } = await supabase
      .from('screenings')
      .select('*', { count: 'exact', head: true });

    if (screeningsError) throw screeningsError;

    // 3. Get total premium transactions and their details
    const { data: premiumTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        id,
        order_id,
        amount,
        status,
        created_at,
        screening_id,
        screenings (
          child_id,
          children (
            name,
            user_id
          )
        )
      `)
      .eq('status', 'PAID')
      .order('created_at', { ascending: false });

    if (transactionsError) throw transactionsError;

    const totalPremium = premiumTransactions?.length || 0;

    // Format the transactions for the frontend
    const formattedTransactions = premiumTransactions?.map((t: any) => ({
      id: t.id,
      invoiceId: t.order_id,
      amount: t.amount,
      date: new Date(t.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      status: t.status,
      screeningId: t.screening_id,
      childName: t.screenings?.children?.name || 'Tidak diketahui'
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalScreenings: totalScreenings || 0,
        totalPremium,
        premiumList: formattedTransactions || []
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
