// app/api/create-razorpay-order/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  try {
    const { amount, currency = 'INR', receipt, notes } = await req.json();

    if (!amount || typeof amount !== 'number' || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount, // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    });

    return NextResponse.json({ order });
  } catch (error: unknown) {
    console.error('Razorpay order error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to create order';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}