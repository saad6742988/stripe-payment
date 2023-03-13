const express=require('express')
const app = express()
const stripe = require('stripe')('sk_test_51MjR2qFzX6REGCMcXCAcEx57EMCLnj0yAbiayyWU5RVeyiwhBhakEXypXz4pGk6WCzo03hrIZkcElSsVfuotrgMG00O3CRrdzO');

// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

app.post('/payment', async (req, res) => {
  const amount = req.query.amount
  const email = req.query.email
  const description = req.query.des
  console.log(amount)

  
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'pkr',
    customer: customer.id,
    receipt_email: email,
  description: description,
    payment_method_types:["card"],
  });
  console.log(Date(paymentIntent.created))

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    pid:paymentIntent.id,
    timeStamp:paymentIntent.created,
    publishableKey: 'pk_test_51MjR2qFzX6REGCMcJyt9IjVHCk5r7XBx0BaSXDkNT93PN7EkCDW2JcldQGETSA4J3lTnEMVIbm8JlT2KA3vU45wJ00REMqnZlj'
  });
});

app.get('/', async (req, res) => {
  res.send("<h1>Hello</h1>")
});




app.listen(process.env.PORT||8000,()=>{console.log('listening express server from heroku')})
