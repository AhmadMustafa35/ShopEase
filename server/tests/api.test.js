process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

let customerToken;
let customerId;
let adminToken;
let testProduct;
let outOfStockProduct;

beforeAll(async () => {
  // Wait until mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => mongoose.connection.once('open', resolve));
  }

  // Setup initial test data
  await User.deleteMany({ email: { $in: ['testcust@shopease.com', 'testadm@shopease.com'] } });

  // 1. Create Admin User
  const admin = await User.create({
    name: 'Test Administrator',
    email: 'testadm@shopease.com',
    password: 'password123',
    role: 'admin',
  });

  // 2. Fetch admin token
  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'testadm@shopease.com',
    password: 'password123',
  });
  adminToken = adminRes.body.token;

  // 3. Find or create a test product
  testProduct = await Product.findOne({ isActive: true, stock: { $gt: 5 } });
  if (!testProduct) {
    testProduct = await Product.create({
      name: 'Automated Test Product',
      category: 'Electronics',
      price: 49.99,
      stock: 20,
      description: 'Used exclusively for automated tests',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      isActive: true,
    });
  }

  // 4. Find or create an out-of-stock product
  outOfStockProduct = await Product.findOne({ isActive: true, stock: 0 });
  if (!outOfStockProduct) {
    outOfStockProduct = await Product.create({
      name: 'Out of Stock Test Product',
      category: 'Books',
      price: 19.99,
      stock: 0,
      description: 'Zero stock test item',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
      isActive: true,
    });
  }
});

afterAll(async () => {
  // Clean up test data
  if (customerId) {
    await User.findByIdAndDelete(customerId);
    await Cart.deleteOne({ user: customerId });
    await Order.deleteMany({ user: customerId });
  }
  await User.deleteOne({ email: 'testadm@shopease.com' });
  await mongoose.connection.close();
});

describe('1. Authentication & Security (Req #4, #10)', () => {
  const customerCredentials = {
    name: 'Automated Test Customer',
    email: 'testcust@shopease.com',
    password: 'securePassword123',
  };

  it('should successfully register a new customer and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(customerCredentials);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(customerCredentials.email);
    expect(res.body.user.role).toBe('customer');
    expect(res.body.user.password).toBeUndefined();

    customerId = res.body.user.id || res.body.user._id;
  });

  it('should reject registration if email is already registered', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(customerCredentials);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject registration when password is less than 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Short Password',
        email: 'shortpass@shopease.com',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should authenticate user and return token on valid login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: customerCredentials.email,
      password: customerCredentials.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    customerToken = res.body.token;
  });

  it('should reject login with incorrect credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: customerCredentials.email,
      password: 'wrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return current user profile for authenticated requests', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(customerCredentials.email);
  });

  it('should deny access to protected endpoints without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('2. Product Catalogue (Req #3)', () => {
  it('should return paginated list of active products', async () => {
    const res = await request(app).get('/api/products?page=1&limit=8');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=Electronics');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.products.forEach((p) => {
      expect(p.category).toBe('Electronics');
    });
  });

  it('should sort products by price ascending', async () => {
    const res = await request(app).get('/api/products?sort=price_asc&limit=10');

    expect(res.status).toBe(200);
    const prices = res.body.products.map((p) => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it('should get single product by ID', async () => {
    const res = await request(app).get(`/api/products/${testProduct._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe(testProduct.name);
  });
});

describe('3. Shopping Cart (Req #5)', () => {
  let cartItemId;

  it('should allow customer to add available product to cart', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: testProduct._id,
        quantity: 2,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cart.items.length).toBeGreaterThan(0);

    const addedItem = res.body.cart.items.find(
      (i) => i.product._id.toString() === testProduct._id.toString() || i.product.toString() === testProduct._id.toString()
    );
    expect(addedItem).toBeDefined();
    cartItemId = addedItem._id;
  });

  it('should prevent adding more items than available in stock', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: outOfStockProduct._id,
        quantity: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should update cart item quantity', async () => {
    const res = await request(app)
      .put(`/api/cart/${cartItemId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('4. Checkout, Atomic Stock Deduction & Orders (Req #6, #7)', () => {
  let initialStock;
  let createdOrderId;

  it('should record order, deduct stock atomically, and clear cart', async () => {
    const prodBefore = await Product.findById(testProduct._id);
    initialStock = prodBefore.stock;

    const deliveryPayload = {
      fullName: 'Test Customer',
      phone: '+1-555-0199',
      address: '123 Market Street, Suite 400',
      city: 'San Francisco',
    };

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(deliveryPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.orderRef).toMatch(/^SE-\d{8}-[A-Z0-9]+$/);
    expect(res.body.order.paymentMethod).toBe('COD');
    expect(res.body.order.status).toBe('Pending');

    createdOrderId = res.body.order._id;

    // Verify stock was atomically decremented in database
    const prodAfter = await Product.findById(testProduct._id);
    expect(prodAfter.stock).toBeLessThan(initialStock);

    // Verify user cart was cleared
    const cartRes = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(cartRes.status).toBe(200);
    expect(cartRes.body.cart.items.length).toBe(0);
  });

  it('should allow customer to view their own order history', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.orders.length).toBeGreaterThan(0);
    expect(res.body.orders[0]._id.toString()).toBe(createdOrderId.toString());
  });
});

describe('5. Security Boundaries & Admin Operations (Req #2, #8, #9, #10)', () => {
  it('should block non-admin customer from accessing admin dashboard stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should block non-admin customer from listing admin orders', async () => {
    const res = await request(app)
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow authorized admin to fetch dashboard stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.totalProducts).toBeGreaterThanOrEqual(1);
    expect(res.body.stats.totalOrders).toBeGreaterThanOrEqual(1);
  });

  it('should allow admin to update order status along valid state transition', async () => {
    const latestOrder = await Order.findOne().sort({ createdAt: -1 });

    const res = await request(app)
      .put(`/api/admin/orders/${latestOrder._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.status).toBe('Confirmed');
  });

  it('should reject invalid order status transitions (e.g. Confirmed to Delivered directly)', async () => {
    const latestOrder = await Order.findOne({ status: 'Confirmed' });

    const res = await request(app)
      .put(`/api/admin/orders/${latestOrder._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Delivered' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
