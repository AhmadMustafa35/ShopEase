const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  getStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanBase}-${Date.now()}${ext}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

// Protect all admin routes
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getStats);

// Product management
router.get('/products', getAllProducts);
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetail);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
