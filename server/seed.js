const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const sampleProducts = [
  // ===============================
  // 1. ELECTRONICS
  // ===============================
  {
    name: 'Wireless Bluetooth Headphones Pro',
    category: 'Electronics',
    price: 79.99,
    stock: 25,
    description:
      'Premium wireless headphones with hybrid active noise cancellation, 30-hour battery life, and comfortable memory foam over-ear cushions.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Smart Fitness Watch Series 7',
    category: 'Electronics',
    price: 149.99,
    stock: 35,
    description:
      'Next-generation smartwatch featuring brilliant AMOLED touch display, continuous heart rate & SpO2 tracking, built-in GPS, and 7-day battery life.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'RGB Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 89.99,
    stock: 40,
    description:
      'Custom tactile mechanical switches with per-key dynamic RGB backlighting, aircraft-grade aluminum top plate, and detachable braided USB-C cable.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Ergonomic Wireless Silent Mouse',
    category: 'Electronics',
    price: 29.99,
    stock: 65,
    description:
      'Contoured silent-click wireless mouse with rechargeable Li-ion battery, dual Bluetooth & 2.4GHz USB dongle, and adjustable 4000 DPI sensor.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'True Wireless Noise-Cancelling Earbuds',
    category: 'Electronics',
    price: 59.99,
    stock: 45,
    description:
      'Compact wireless earbuds with active noise cancellation, environmental sound pass-through, IPX5 sweat resistance, and Qi wireless charging case.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: '65W GaN Dual-Port Fast Charger',
    category: 'Electronics',
    price: 34.99,
    stock: 50,
    description:
      'Compact gallium nitride (GaN) high-speed wall charger with dual USB-C Power Delivery ports. Fast charges laptops, tablets, and phones simultaneously.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Modern LED Touch Desk Lamp',
    category: 'Electronics',
    price: 35.99,
    stock: 40,
    description:
      'Architect desk lamp with 5 brightness levels and 3 color temperatures. Features integrated fast USB charging port, timer, and glare-free lighting.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: '4K Ultra HD Foldable GPS Drone',
    category: 'Electronics',
    price: 189.99,
    stock: 15,
    description:
      'Foldable quadcopter drone equipped with 4K HDR camera, 2-axis anti-shake gimbal, 30-minute flight time, and smart automatic return-to-home.',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },

  // ===============================
  // 2. CLOTHING & APPAREL
  // ===============================
  {
    name: "Men's Classic Organic Cotton T-Shirt",
    category: 'Clothing',
    price: 24.99,
    stock: 75,
    description:
      '100% certified organic ring-spun cotton crew neck t-shirt. Pre-shrunk, breathable, ultra-soft feel available in essential colors.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: "Men's Urban Streetwear Fleece Hoodie",
    category: 'Clothing',
    price: 49.99,
    stock: 55,
    description:
      'Heavyweight cotton-blend fleece hoodie featuring cozy kangaroo pocket, metal-tipped drawstrings, and a modern relaxed silhouette.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: "Women's Weatherproof Running Jacket",
    category: 'Clothing',
    price: 59.99,
    stock: 30,
    description:
      'Lightweight, windproof and water-resistant athletic jacket with 360° reflective safety details and secure zippered side pockets.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: "Women's Knit Wool-Blend Cardigan",
    category: 'Clothing',
    price: 64.99,
    stock: 35,
    description:
      'Soft knitted open-front cardigan with tortoiseshell buttons and rib-knit trim. Easy layer for all seasons with unmatched coziness.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Vintage Wash Denim Trucker Jacket',
    category: 'Clothing',
    price: 79.99,
    stock: 25,
    description:
      'Timeless western trucker denim jacket crafted from durable 14oz non-stretch cotton with embossed metal buttons and dual chest pockets.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Denim Slim Fit Stretch Jeans',
    category: 'Clothing',
    price: 49.99,
    stock: 40,
    description:
      'Modern slim fit jeans made from premium flex-stretch denim. Five-pocket styling engineered for all-day comfort and mobility.',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },

  // ===============================
  // 3. FOOTWEAR
  // ===============================
  {
    name: 'Pro Nitro Performance Running Shoes',
    category: 'Footwear',
    price: 119.99,
    stock: 30,
    description:
      'Lightweight engineered mesh running shoes with nitrogen-infused responsive foam cushioning, reinforced TPU heel clip, and durable rubber outsole.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Classic Minimalist Leather Sneakers',
    category: 'Footwear',
    price: 84.99,
    stock: 40,
    description:
      'Handcrafted full-grain leather everyday court sneakers with cushioned memory foam insole and sturdy vulcanized rubber cupsole.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Waterproof All-Terrain Hiking Boots',
    category: 'Footwear',
    price: 129.99,
    stock: 20,
    description:
      'Rugged outdoor hiking boots featuring breathable waterproof membrane, protective rubber toe cap, and multi-directional lugged traction soles.',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },

  // ===============================
  // 4. HOME & KITCHEN
  // ===============================
  {
    name: 'Italian Barista Pump Espresso Machine',
    category: 'Home & Kitchen',
    price: 149.99,
    stock: 18,
    description:
      '15-bar high pressure espresso maker with commercial-style stainless steam wand for creamy cappuccinos, silky lattes, and intense espresso shots.',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Digital Touchscreen Air Fryer 6-Quart',
    category: 'Home & Kitchen',
    price: 89.99,
    stock: 25,
    description:
      'Rapid 360° cyclonic heat circulation air fryer with 8 pre-programmed culinary presets. Crisps foods to golden perfection with 85% less oil.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: '10-Piece Ceramic Non-Stick Cookware Set',
    category: 'Home & Kitchen',
    price: 99.99,
    stock: 15,
    description:
      'Healthy ceramic non-stick cookware set including fry pans, saucepans, and Dutch oven with glass lids. Free of PTFE, PFOA, lead, and cadmium.',
    image: 'https://images.unsplash.com/photo-1584990347449-399a9b19dfb4?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Vacuum Insulated Stainless Steel Tumbler',
    category: 'Home & Kitchen',
    price: 18.99,
    stock: 60,
    description:
      'Double-walled 18/8 food-grade stainless steel bottle. Keeps drinks freezing cold for 24 hours or piping hot for 12 hours. Sweat-proof finish.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Organic Bamboo Kitchen Cutting Boards (Set of 3)',
    category: 'Home & Kitchen',
    price: 24.99,
    stock: 45,
    description:
      'Eco-friendly solid bamboo cutting boards with deep juice grooves and side handles. Knife-friendly, non-porous antimicrobial surface.',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Ultrasonic Aromatherapy Essential Oil Diffuser',
    category: 'Home & Kitchen',
    price: 29.99,
    stock: 65,
    description:
      '500ml quiet ultrasonic cool mist humidifier with natural wood grain finish, 7 ambient mood light colors, and auto-off safety sensor.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Artisan Organic Herbal Green Tea Collection',
    category: 'Home & Kitchen',
    price: 19.99,
    stock: 80,
    description:
      'Hand-selected master collection of 6 antioxidant-rich organic green and botanical teas. 48 individually foil-sealed pyramid sachets.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },

  // ===============================
  // 5. BEAUTY & PERSONAL CARE
  // ===============================
  {
    name: 'Pure Botanical Radiance Vitamin C Serum',
    category: 'Beauty & Personal Care',
    price: 26.99,
    stock: 80,
    description:
      'Potent facial brightening serum packed with 20% stabilized Vitamin C, botanical hyaluronic acid, and vitamin E to visibly fade dark spots and firm skin.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Organic Restorative Facial Skincare Kit',
    category: 'Beauty & Personal Care',
    price: 49.99,
    stock: 35,
    description:
      'Comprehensive 4-step daily clean skincare ritual including foaming cleanser, balancing toner, peptide daily moisturizer, and nourishing night oil.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Maison Velvet Luxury Eau de Parfum 100ml',
    category: 'Beauty & Personal Care',
    price: 74.99,
    stock: 25,
    description:
      'Alluring artisan fragrance with notes of Italian bergamot, smoky amberwood, and fresh French lavender. Long-lasting 12-hour projection.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },

  // ===============================
  // 6. ACCESSORIES & WATCHES
  // ===============================
  {
    name: 'Polarized Aviator Sunglasses UV400',
    category: 'Accessories',
    price: 38.99,
    stock: 50,
    description:
      'Classic military-inspired aviator sunglasses with ultra-lightweight stainless steel frame, spring hinges, and polarized anti-glare scratch-proof lenses.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Minimalist Chronograph Quartz Watch',
    category: 'Accessories',
    price: 119.99,
    stock: 22,
    description:
      'Precision Japanese movement timepiece featuring anti-reflective sapphire crystal glass, 3 functional chronograph dials, and supple genuine Italian leather strap.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'RFID-Blocking Slim Bifold Leather Wallet',
    category: 'Accessories',
    price: 29.99,
    stock: 60,
    description:
      'Crafted from top-grain vintage leather with certified RFID-blocking lining to protect digital credentials. Holds 10 cards plus quick-access cash sleeve.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },

  // ===============================
  // 7. SPORTS & OUTDOORS
  // ===============================
  {
    name: 'Eco-Friendly High-Density Yoga Mat',
    category: 'Sports & Outdoors',
    price: 34.99,
    stock: 50,
    description:
      'Extra-thick 6mm non-slip exercise yoga mat with laser-etched posture alignment guides. Made from recyclable, non-toxic TPE with shoulder strap.',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Quick-Lock Adjustable Dumbbells Pair (50 lbs)',
    category: 'Sports & Outdoors',
    price: 139.99,
    stock: 20,
    description:
      'Space-saving pair of adjustable dumbbells rapidly modifying from 5 to 25 lbs each in 5-lb increments with smooth mechanical dial lock mechanism.',
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Expedition 45L Waterproof Hiking Backpack',
    category: 'Sports & Outdoors',
    price: 69.99,
    stock: 25,
    description:
      'Tear-resistant nylon 45-liter trekking rucksack featuring integrated rain fly, breathable mesh lumbar suspension, and trekking pole attachment points.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Heavy-Duty 150 lbs Resistance Bands Set',
    category: 'Sports & Outdoors',
    price: 24.99,
    stock: 65,
    description:
      'Complete home gym kit with 5 color-coded latex resistance tubes (10 to 50 lbs), heavy-duty carabiners, padded ankle straps, and door anchor.',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },

  // ===============================
  // 8. BOOKS & LITERATURE
  // ===============================
  {
    name: 'Atomic Habits by James Clear',
    category: 'Books',
    price: 19.99,
    stock: 45,
    description:
      'The #1 New York Times bestseller offering a proven, practical framework for improving every day through tiny behavioral changes that deliver remarkable results.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Clean Code: Handbook of Agile Software Craftsmanship',
    category: 'Books',
    price: 42.99,
    stock: 30,
    description:
      'Legendary software engineering handbook by Robert C. Martin (Uncle Bob). Packed with real case studies on code refactoring, heuristics, and smells.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'JavaScript: The Definitive Guide (7th Edition)',
    category: 'Books',
    price: 39.99,
    stock: 35,
    description:
      'Master the world’s most used programming language. Complete reference covering modern ES2020+, Node.js web APIs, async iterators, and design patterns.',
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e37271?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Award-Winning Contemporary Fiction Boxed Set',
    category: 'Books',
    price: 29.99,
    stock: 0,
    description:
      'Curated trio of acclaimed bestselling contemporary fiction novels from renowned international prize winners. Deluxe paperback collector edition.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopease';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');

    // 1. Clear existing collections
    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('Collections cleared.');

    // 2. Create users
    console.log('Creating initial users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopease.com',
      password: 'admin123',
      role: 'admin',
    });

    const testCustomer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
    });

    console.log('Users created:');
    console.log(`  - Admin:    ${adminUser.email}`);
    console.log(`  - Customer: ${testCustomer.email}`);

    // 3. Seed products
    console.log('Seeding sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products across 8 categories.`);

    console.log('\n=========================================');
    console.log(' ShopEase Database Seeding Complete!');
    console.log(` Total Products Seeded: ${insertedProducts.length}`);
    console.log('=========================================');
    console.log('Admin Credentials:');
    console.log('  Email:    admin@shopease.com');
    console.log('  Password: admin123');
    console.log('  Role:     admin');
    console.log('-----------------------------------------');
    console.log('Test Customer Credentials:');
    console.log('  Email:    john@example.com');
    console.log('  Password: password123');
    console.log('  Role:     customer');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
