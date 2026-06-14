import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// GET /api/children/[id] — get single child
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { data: child, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !child) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    const mappedChild = {
      id: child.id,
      userId: child.user_id,
      name: child.name,
      dateOfBirth: child.date_of_birth,
      gender: child.gender,
      isPremature: child.is_premature,
      gestationalAge: child.gestational_age,
      familyHistory: child.family_history,
      createdAt: child.created_at
    };

    return NextResponse.json({ success: true, data: mappedChild });
  } catch (error) {
    console.error('Error fetching child:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch child' }, { status: 500 });
  }
}

// PUT /api/children/[id] — update child
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, dateOfBirth, gender, isPremature, gestationalAge, familyHistory } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (dateOfBirth) updates.date_of_birth = dateOfBirth;
    if (gender) updates.gender = gender;
    if (isPremature !== undefined) updates.is_premature = isPremature;
    if (gestationalAge !== undefined) updates.gestational_age = gestationalAge;
    if (familyHistory) updates.family_history = familyHistory;

    const { data: updated, error } = await supabase
      .from('children')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    const mappedChild = {
      id: updated.id,
      userId: updated.user_id,
      name: updated.name,
      dateOfBirth: updated.date_of_birth,
      gender: updated.gender,
      isPremature: updated.is_premature,
      gestationalAge: updated.gestational_age,
      familyHistory: updated.family_history,
      createdAt: updated.created_at
    };

    return NextResponse.json({ success: true, data: mappedChild });
  } catch (error) {
    console.error('Error updating child:', error);
    return NextResponse.json({ success: false, error: 'Failed to update child' }, { status: 500 });
  }
}

// DELETE /api/children/[id] — delete child and cascade
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    // Get all screenings for this child to cascade delete
    const { data: childScreenings, error: fetchError } = await supabase
      .from('screenings')
      .select('id')
      .eq('child_id', id);

    if (fetchError) throw fetchError;

    for (const screening of childScreenings || []) {
      await supabase.from('screening_answers').delete().eq('screening_id', screening.id);
      await supabase.from('screening_results').delete().eq('screening_id', screening.id);
    }

    await supabase.from('screenings').delete().eq('child_id', id);
    const { data: deleted, error: deleteError } = await supabase
      .from('children')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (deleteError || !deleted) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { message: 'Child and related data deleted' } });
  } catch (error) {
    console.error('Error deleting child:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete child' }, { status: 500 });
  }
}
