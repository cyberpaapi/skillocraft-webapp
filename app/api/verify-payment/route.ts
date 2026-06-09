// app/api/verify-payment/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const { orderId, paymentId, signature, amount, currency = 'INR' } = await req.json();

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    if (
      payment.status !== 'captured' ||
      payment.amount !== amount ||
      payment.currency !== currency
    ) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // At this point, payment is verified
    // You can now create orders in your database and give users access to the courses

    return NextResponse.json({
      status: 'success',
      message: 'Payment verified successfully',
      paymentId,
      orderId
    });

  } catch (error: unknown) {
    console.error('Error verifying payment:', error);
    let errorMessage = 'Failed to verify payment';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}