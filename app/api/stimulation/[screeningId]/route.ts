import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { calculateAgeInMonths } from '../../../../utils/questions';
import { generateDynamicTasks } from '../../../../utils/stimulation';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { screeningId: string } }) {
  try {
    const id = parseInt(params.screeningId);

    // 1. Check if paid
    const { data: transactions } = await supabase
      .from('transactions')
      .select('status')
      .eq('screening_id', id)
      .eq('status', 'PAID');

    const isPaid = transactions && transactions.length > 0;
    
    if (!isPaid) {
      return NextResponse.json({ success: false, error: 'Premium access required' }, { status: 403 });
    }

    // 2. Check if progress already exists
    const { data: existingProgress, error: fetchError } = await supabase
      .from('user_stimulation_progress')
      .select('*')
      .eq('screening_id', id)
      .order('day_number', { ascending: true });

    if (fetchError) throw fetchError;

    if (existingProgress && existingProgress.length > 0) {
      return NextResponse.json({ success: true, data: existingProgress });
    }

    // 3. GENERATE DYNAMIC TASKS
    // Get screening info
    const { data: screening, error: screeningError } = await supabase
      .from('screenings')
      .select('child_id')
      .eq('id', id)
      .single();

    if (screeningError || !screening) {
      return NextResponse.json({ success: false, error: 'Screening not found' }, { status: 404 });
    }

    // Get child info for age
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('date_of_birth, is_premature, gestational_age')
      .eq('id', screening.child_id)
      .single();

    if (childError || !child) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    const ageInMonths = calculateAgeInMonths(child.date_of_birth, child.is_premature, child.gestational_age);

    // Get failed answers
    const { data: answers, error: answersError } = await supabase
      .from('screening_answers')
      .select('question_index')
      .eq('screening_id', id)
      .eq('answer', false);

    if (answersError) throw answersError;

    const failedIndices = answers ? answers.map(a => a.question_index) : [];

    // Magic! Generate personalized 30 day tasks
    const dynamicTasksList = generateDynamicTasks(ageInMonths, failedIndices);

    // 4. Save to database
    const rowsToInsert = dynamicTasksList.map((taskText, index) => ({
      screening_id: id,
      day_number: index + 1,
      task_text: taskText,
      is_completed: false
    }));

    const { data: insertedProgress, error: insertError } = await supabase
      .from('user_stimulation_progress')
      .insert(rowsToInsert)
      .select()
      .order('day_number', { ascending: true });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, data: insertedProgress });
  } catch (error) {
    console.error('Error fetching/generating stimulation progress:', error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
