import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// Xendit Webhook Endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Xendit sends the order id in external_id
    const orderId = body.external_id;
    const status = body.status; // e.g. 'PAID', 'EXPIRED'

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Update the transaction in database
    const { error } = await supabase
      .from('transactions')
      .update({ status: status })
      .eq('order_id', orderId);

    if (error) {
      console.error('Webhook DB Error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ success: false, error: 'Failed to process webhook' }, { status: 500 });
  }
}
