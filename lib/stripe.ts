import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing environment variable: "STRIPE_SECRET_KEY"')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
})

export const STRIPE_CONFIG = {
  currency: "usd",
  payment_method_types: ["card"],
  mode: "payment" as const,
}

// Helper function to create a payment intent
export async function createPaymentIntent(amount: number, currency = "usd", metadata?: Record<string, string>) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  })
}

// Helper function to create a customer
export async function createStripeCustomer(email: string, name: string) {
  return await stripe.customers.create({
    email,
    name,
  })
}

// Helper function to retrieve payment intent
export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

// Helper function to create a setup intent for saving payment methods
export async function createSetupIntent(customerId: string) {
  return await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
    usage: "off_session",
  })
}

// Helper function to list customer payment methods
export async function listCustomerPaymentMethods(customerId: string) {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  })
}

// Helper function to detach payment method
export async function detachPaymentMethod(paymentMethodId: string) {
  return await stripe.paymentMethods.detach(paymentMethodId)
}
