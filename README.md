Here is the updated `README.md` file:

```markdown
# E-Commerce Platform

A comprehensive e-commerce platform built with Node.js, Express, MongoDB, and Supabase for the backend, and a frontend built with React.

## Backend Setup

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root of the backend directory with the following content:

   ```
   PORT=5000
   MONGODB_URI=<your_mongodb_uri>
   SUPABASE_URL=<your_supabase_url>
   SUPABASE_KEY=<your_supabase_key>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   FE_URL=http://localhost:5173
   ```

5. Replace the placeholders with your actual credentials
6. Start the MongoDB service on your local machine
7. Run the server: `npm start`

## Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root of the frontend directory with the following content:

   ```
   VITE_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
   VITE_API_URL=http://localhost:5000/api
   ```

4. Replace the placeholder with your actual Stripe publishable key
5. Start the development server: `npm run dev`

The frontend should now be running on `http://localhost:5173`

## API Routes

### Authentication

- **POST /api/auth/register**
  - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123", "role": "user" }`

- **POST /api/auth/login**
  - Log in a user
  - Body: `{ "email": "user@example.com", "password": "password123" }`

- **POST /api/auth/logout**
  - Log out a user (requires authentication)

### Products

- **POST /api/products**
  - Create a new product (admin only)
  - Body: `{ "name": "Product Name", "description": "Product description", "price": 19.99, "stockQuantity": 100 }`

- **GET /api/products**
  - Retrieve all products

- **PUT /api/products/:id**
  - Update a product (admin only)
  - Body: `{ "name": "Updated Product Name", "price": 24.99 }`

- **DELETE /api/products/:id**
  - Delete a product (admin only)

### Cart

- **POST /api/cart**
  - Add a product to the cart
  - Body: `{ "productId": "product_id_here", "quantity": 2 }`

- **GET /api/cart**
  - Retrieve the user's cart

- **PUT /api/cart/:productId**
  - Update cart item quantity
  - Body: `{ "quantity": 3 }`

- **DELETE /api/cart/:productId**
  - Remove an item from the cart

### Orders

- **POST /api/orders**
  - Create a new order
  - Body: `{ "paymentIntentId": "pi_1234567890" }`

- **GET /api/orders**
  - Retrieve all orders for the logged-in user

### Sessions

- **GET /api/sessions**
  - Retrieve all sessions (admin only)

- **GET /api/sessions/user**
  - Retrieve sessions for the logged-in user

### Payments

- **POST /api/payments/create-payment-intent**
  - Create a payment intent
  - Body: `{ "amount": 2999, "cartItems": [...], "paySessionId": "session_id_here" }`

## Testing Payments

For testing the payment functionality, you can use Stripe's test cards. These allow you to simulate various payment scenarios without making real transactions. 

You can find a comprehensive list of test cards and other payment method test credentials in the [Stripe Testing Documentation](https://docs.stripe.com/testing).

Some commonly used test card numbers include:

- 4242 4242 4242 4242
- 4000 0566 5566 5556
- 3782 822463 10005

When using these test cards, you can use any future expiration date, any three-digit CVC, and any postal code.

## Deployment

- Backend: Deployed on Render
- Frontend: Deployed on Netlify

## Sample Login Credentials

- **Admin**
  - Email: ecommerce-app-admin@guerrillamail.org
  - Password: qwertyui

- **User**
  - Email: ecommerce-app-user@guerrillamail.org
  - Password: qwertyui

These are sample login credentials that can be used to login.
```