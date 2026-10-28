const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { isValidTransition } = require('../utils/orderHelpers');

// ==========================================
// Product Management
// ==========================================

// @desc    Get all products including inactive (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query.category = category.trim();
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      products,
      page: pageNum,
      pages,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (admin)
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields: name, description, price, category, and stock',
      });
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number',
      });
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a valid non-negative integer',
      });
    }

    let image = 'no-image.jpg';
    if (req.file) {
      image = req.file.filename;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: category.trim(),
      stock: parsedStock,
      image,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const { name, description, price, category, stock, isActive } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid non-negative number',
        });
      }
      product.price = parsedPrice;
    }
    if (category !== undefined) product.category = category.trim();
    if (stock !== undefined) {
      const parsedStock = parseInt(stock, 10);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock must be a valid non-negative integer',
        });
      }
      product.stock = parsedStock;
    }
    if (isActive !== undefined) {
      product.isActive = Boolean(isActive === true || isActive === 'true');
    }

    if (req.file) {
      product.image = req.file.filename;
    } else if (req.body.image) {
      product.image = req.body.image;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft-delete a product (set isActive: false)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isActive = false;
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Order Management
// ==========================================

// @desc    Get all orders with filter and pagination (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status && status.trim() !== '' && status.toLowerCase() !== 'all') {
      query.status = status.trim();
    }

    if (search && search.trim() !== '') {
      query.orderRef = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      orders,
      page: pageNum,
      pages,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order detail (admin)
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getOrderDetail = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status with state machine verification (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify valid status transition
    if (!isValidTransition(order.status, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from "${order.status}" to "${status}"`,
      });
    }

    // If order is being cancelled, restore inventory
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        if (item.product && item.quantity) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    order.status = status;
    await order.save();
    await order.populate('user', 'name email');

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Dashboard Stats
// ==========================================

// @desc    Get dashboard metrics (admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    // 1. Total active products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // 2. Total orders
    const totalOrders = await Order.countDocuments();

    // 3. Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Total revenue from delivered orders
    const revenueAgg = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? Number(revenueAgg[0].totalRevenue.toFixed(2)) : 0;

    // 5. Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Orders count by status
    const allStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const ordersByStatus = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    statusCounts.forEach((sc) => {
      if (sc._id && ordersByStatus.hasOwnProperty(sc._id)) {
        ordersByStatus[sc._id] = sc.count;
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
        recentOrders,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  getStats,
};
