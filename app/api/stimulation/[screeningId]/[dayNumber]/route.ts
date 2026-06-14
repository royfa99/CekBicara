import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { screeningId: string, dayNumber: string } }) {
  try {
    const screeningId = parseInt(params.screeningId);
    const dayNumber = parseInt(params.dayNumber);

    const body = await request.json();
    const { isCompleted } = body;

    if (typeof isCompleted !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_stimulation_progress')
      .update({
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      })
      .eq('screening_id', screeningId)
      .eq('day_number', dayNumber)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating stimulation progress:', error);
    return NextResponse.json({ success: false, error: 'Failed to update progress' }, { status: 500 });
  }
}
