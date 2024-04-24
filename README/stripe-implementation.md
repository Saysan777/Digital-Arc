#                                         -------------Stripe----------------

# Stripe Implemenation:
- Use stripe package for interaction with stripe apis
```javaScript
        yarn add stripe
```

- Make a lib file in @lib
    import stripe with capital letter. This help in export naming.
```javaScript
        import Stripe from 'stripe'
        export stripe = new Stripe();
```

- We're using session based payment using stripe. Create a session using stripe and send the session url to client. Session url is provided by stripe.

# Stripe api keys:
    - Go to stripe dashboard -> Use the searchbar at top -> Search for developer keys.

# Stripe Products
    - We create products in stripe for every product bought from 'digital bazaar'
    - Doing this will help keep track of product as stripe provides priceId for each product.
    - We can create priceId if new product is added in stripe
    - If existing product is found and the product pricing is changed, we can just update the product.

    NOTES: Go to stripe dashboard -> Go to search bar at top -> search for create a product.

# StripeId and priceId:
    - Whenever a new product is created in our app, we trigger the beforeChange hook in product collection.
    - This hook creates a product in stripe and we get the id(productId) and (default_price)priceId in return from stripe.
    - This productId is kept as stripeId and default_price is kept as priceId in our doc and inserted in mongodb.

# Stripe Webhook:
    - From our end we redirect user to the stripe session url creation using stripe package.
    - Now, the payment by user is being done completely on stripe end(using stripe url)
    - We did send a success url or cancel url to stripe after the payment have been done by user.
    - However, our app cannot know whether the payment was made or not.
    - So, when a payment is made, stripe sends our user to either success url or cancel url(both url are our app routes).
    - And also stripe sends us a webhook telling the payment was successfull or payment failed.
    - Based on this parameters, we update _isPaid field to true or false.

# Stripe Webhook middelware in server.ts file
   -  Stripe webhooks send events to your server in the form of HTTP POST requests.
   -  These requests contain a payload with details about the event. 
   - To verify that these events are indeed from Stripe, you can use the signature in the Stripe-Signature header. - This signature is generated using the endpoint's signing secret and the raw body of the request. 
   - By storing the raw body, you can later use it to compute the signature and verify that the event is authentic.
    - In summary, this code snippet sets up a middleware to parse JSON request bodies and store the raw body for later use, which is particularly useful for verifying Stripe webhook events.