const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const app = express();
const stripe = Stripe(process.env.REACT_APP_STRIPE_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { planId } = req.body;
  const plans = {
    basic: { price: 1000, name: 'Basic' },    // 10 zł (w groszach)
    premium: { price: 2500, name: 'Premium' } // 25 zł (w groszach)
  };
  const plan = plans[planId];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'pln',
        product_data: { name: plan.name },
        unit_amount: plan.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:3000/thank-you?plan=' + planId,
    cancel_url: 'http://localhost:3000/payment-failed',
  });

  res.json({ url: session.url });
});

app.listen(4242, () => console.log('Server running on port 4242'));