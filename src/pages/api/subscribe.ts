import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { stripe } from '../../services/stipe'

export default async (req: NextApiRequest, res: NextApiResponse) =>{
  if(req.method === 'POST'){
    const session = await getSession({ req })
    
    const stripeCustumer = await stripe.customers.create({
      email:session.user.email,
    })

    const stripeCheckoutSessions = await stripe.checkout.sessions.create({
      customer: stripeCustumer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {price: 'price_1L3rcVJckrmTFuRguiwEzgTI', quantity: 1}
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return res.status(200).json({sessionId: stripeCheckoutSessions.id})
  }else{
    res.setHeader('Allow', 'POST')
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}