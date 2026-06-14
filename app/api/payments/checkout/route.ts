import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { Xendit } from 'xendit-node';

// Define dynamic to prevent caching of this endpoint
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { screeningId } = body;

    if (!screeningId) {
      return NextResponse.json({ success: false, error: 'Missing screeningId' }, { status: 400 });
    }

    if (!process.env.XENDIT_SECRET_KEY) {
      return NextResponse.json({ success: false, error: 'Xendit secret key not configured' }, { status: 500 });
    }

    const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
    const { Invoice } = xenditClient;

    const orderId = `premium-${screeningId}-${Date.now()}`;
    const amount = 49000;

    // Get origin URL for dynamic redirect
    const origin = new URL(request.url).origin;

    // Create Invoice in Xendit
    const invoice = await Invoice.createInvoice({
      data: {
        externalId: orderId,
        amount: amount,
        description: 'Akses Premium Laporan Cek Bicara',
        successRedirectUrl: `${origin}/skrining/result?screeningId=${screeningId}`,
        failureRedirectUrl: `${origin}/skrining/result?screeningId=${screeningId}`,
      }
    });

    if (!invoice || !invoice.invoiceUrl) {
      throw new Error('Failed to create Xendit invoice');
    }

    // Save transaction to Supabase
    const { error: dbError } = await supabase.from('transactions').insert({
      screening_id: screeningId,
      order_id: orderId,
      amount: amount,
      status: 'PENDING',
      payment_url: invoice.invoiceUrl
    });

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl: invoice.invoiceUrl
      }
    });
  } catch (error: any) {
    console.error('Error creating checkout:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create checkout' }, { status: 500 });
  }
}
