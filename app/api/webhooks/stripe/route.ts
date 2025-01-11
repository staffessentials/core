import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  if (!sig || !endpointSecret) {
    console.error('Missing signature or endpoint secret')
    return NextResponse.json({ error: 'Missing signature or endpoint secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handleSuccessfulPayment(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handleFailedPayment(failedPayment)
        break

      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge
        await handleSuccessfulCharge(charge)
        break

      case 'charge.failed':
        const failedCharge = event.data.object as Stripe.Charge
        await handleFailedCharge(failedCharge)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 })
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  // TODO: Update order status, send confirmation email, etc.
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  // TODO: Update order status, notify user, etc.
}

async function handleSuccessfulCharge(charge: Stripe.Charge) {
  console.log('Charge succeeded:', charge.id)
  // TODO: Update order status, send confirmation email, etc.
}

async function handleFailedCharge(charge: Stripe.Charge) {
  console.log('Charge failed:', charge.id)
  // TODO: Update order status, notify user, etc.
}

