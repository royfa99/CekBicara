import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/screenings/[id] — get single screening with answers and result
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    const { data: screening, error: screeningError } = await supabase
      .from('screenings')
      .select('*')
      .eq('id', id)
      .single();

    if (screeningError || !screening) {
      return NextResponse.json({ success: false, error: 'Screening not found' }, { status: 404 });
    }

    const { data: answers, error: answersError } = await supabase
      .from('screening_answers')
      .select('*')
      .eq('screening_id', id);

    if (answersError) throw answersError;

    const { data: result, error: resultError } = await supabase
      .from('screening_results')
      .select('*')
      .eq('screening_id', id)
      .single();

    if (resultError && resultError.code !== 'PGRST116') { // PGRST116 is "not found" which is fine if missing
      throw resultError;
    }

    let isPaid = false;

    // Check transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('screening_id', id);

    if (transactions) {
      // Is there already a PAID transaction?
      isPaid = transactions.some(t => t.status === 'PAID' || t.status === 'SETTLED');

      // If not paid, check pending transactions directly with Xendit (Fallback for localhost without webhooks)
      if (!isPaid && process.env.XENDIT_SECRET_KEY) {
        const pendingTxs = transactions.filter(t => t.status === 'PENDING');
        for (const tx of pendingTxs) {
          try {
            const xenditRes = await fetch(`https://api.xendit.co/v2/invoices?external_id=${tx.order_id}`, {
              headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64')
              }
            });
            const xenditJson = await xenditRes.json();
            
            if (xenditJson && xenditJson.length > 0) {
              const latestInvoice = xenditJson[0];
              if (latestInvoice.status === 'PAID' || latestInvoice.status === 'SETTLED') {
                isPaid = true;
                // Update DB so we don't have to check Xendit next time
                await supabase.from('transactions').update({ status: 'PAID' }).eq('id', tx.id);
                break;
              }
            }
          } catch (e) {
            console.error('Failed to sync with Xendit:', e);
          }
        }
      }
    }

    const mappedScreening = {
      id: screening.id,
      childId: screening.child_id,
      date: screening.date,
      riskLevel: screening.risk_level,
      summary: screening.summary,
      score: screening.score,
      createdAt: screening.created_at
    };

    const mappedAnswers = (answers || []).map((ans: any) => ({
      id: ans.id,
      screeningId: ans.screening_id,
      questionIndex: ans.question_index,
      questionText: ans.question_text,
      answer: ans.answer
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...mappedScreening,
        answers: mappedAnswers,
        isPaid,
        result: result ? {
          redFlags: typeof result.red_flags === 'string' ? JSON.parse(result.red_flags) : result.red_flags,
          strengths: typeof result.strengths === 'string' ? JSON.parse(result.strengths) : result.strengths,
          recommendations: isPaid ? (typeof result.recommendations === 'string' ? JSON.parse(result.recommendations) : result.recommendations) : [],
          stimulationPlan: isPaid ? (typeof result.stimulation_plan === 'string' ? JSON.parse(result.stimulation_plan) : result.stimulation_plan) : []
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

    await supabase.from('screening_answers').delete().eq('screening_id', id);
    await supabase.from('screening_results').delete().eq('screening_id', id);
    
    const { data: deleted, error: deleteError } = await supabase
      .from('screenings')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (deleteError || !deleted) {
      return NextResponse.json({ success: false, error: 'Screening not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { message: 'Screening deleted' } });
  } catch (error) {
    console.error('Error deleting screening:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete screening' }, { status: 500 });
  }
}
