const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const router = express.Router();

// create checkout session
router.post('/create-checkout-session', async (req,res) => {
  /*
    Expected body:
    { items: [{ id, name, price, qty }], success_url, cancel_url, metadata: { userId, orderId? } }
  */
  try{
    const { items, success_url, cancel_url, metadata } = req.body;

    const line_items = items.map(i => ({
      price_data: {
        currency: 'inr',
        product_data: { name: i.name },
        unit_amount: Math.round(i.price) // Stripe expects amount in smallest currency unit (for INR, paise). If you use decimals convert accordingly.
      },
      quantity: i.qty
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      metadata
    });

    res.json({ url: session.url, id: session.id });
  }catch(e){ console.error(e); res.status(500).json({ error: e.message }); }
});

module.exports = router;
