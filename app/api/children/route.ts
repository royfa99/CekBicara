import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: allChildren, error } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const mappedChildren = allChildren.map((child: any) => ({
      id: child.id,
      userId: child.user_id,
      name: child.name,
      dateOfBirth: child.date_of_birth,
      gender: child.gender,
      isPremature: child.is_premature,
      gestationalAge: child.gestational_age,
      familyHistory: child.family_history,
      createdAt: child.created_at
    }));

    return NextResponse.json({ success: true, data: mappedChildren });
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch children' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, dateOfBirth, gender, isPremature, gestationalAge, familyHistory } = body;

    if (!name || !dateOfBirth || !gender) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, dateOfBirth, gender' }, { status: 400 });
    }

    const { data: newChild, error } = await supabase
      .from('children')
      .insert({
        user_id: user.id,
        name,
        date_of_birth: dateOfBirth,
        gender,
        is_premature: isPremature || false,
        gestational_age: gestationalAge || null,
        family_history: familyHistory || 'tidak',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    const mappedChild = {
      id: newChild.id,
      userId: newChild.user_id,
      name: newChild.name,
      dateOfBirth: newChild.date_of_birth,
      gender: newChild.gender,
      isPremature: newChild.is_premature,
      gestationalAge: newChild.gestational_age,
      familyHistory: newChild.family_history,
      createdAt: newChild.created_at
    };

    return NextResponse.json({ success: true, data: mappedChild }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating child:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create child', details: error }, { status: 500 });
  }
}
