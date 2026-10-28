const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { generateOrderRef } = require('../utils/orderHelpers');

// @desc    Place a new order from current user cart
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res, next) => {
  try {
    const { fullName, phone, address, city } = req.body;

    // Validate delivery info
    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, phone number, address, and city for delivery',
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price image stock isActive',
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to your cart before checking out.',
      });
    }

    // Pre-validate that all products are active and in stock
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: 'An item in your cart is no longer available. Please update your cart.',
        });
      }

      const freshProduct = await Product.findById(item.product._id);
      if (!freshProduct || !freshProduct.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product.name}" is no longer available.`,
        });
      }

      if (freshProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${freshProduct.name}". Only ${freshProduct.stock} available, but you requested ${item.quantity}.`,
        });
      }
    }

    // Decrement stock atomically with rollback safeguard
    const decrementedItems = [];
    const orderItems = [];
    let totalAmount = 0;

    try {
      for (const item of cart.items) {
        const prodId = item.product._id;
        const qty = item.quantity;

        const updatedProduct = await Product.findOneAndUpdate(
          { _id: prodId, stock: { $gte: qty }, isActive: true },
          { $inc: { stock: -qty } },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error(
            `Unable to reserve stock for "${item.product.name}". It may have just sold out.`
          );
        }

        decrementedItems.push({ productId: prodId, quantity: qty });

        const price = updatedProduct.price;
        totalAmount += price * qty;

        orderItems.push({
          product: updatedProduct._id,
          name: updatedProduct.name,
          price: price,
          quantity: qty,
          image: updatedProduct.image || 'no-image.jpg',
        });
      }

      // Generate unique orderRef
      let orderRef = generateOrderRef();
      // Ensure uniqueness in the rare chance of collision
      while (await Order.findOne({ orderRef })) {
        orderRef = generateOrderRef();
      }

      // Create the order document
      const order = await Order.create({
        user: req.user._id,
        orderRef,
        items: orderItems,
        deliveryInfo: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
        },
        totalAmount: Number(totalAmount.toFixed(2)),
        status: 'Pending',
        paymentMethod: 'COD',
      });

      // Clear the user's cart
      cart.items = [];
      await cart.save();

      return res.status(201).json({
        success: true,
        order,
      });
    } catch (err) {
      // Rollback any stock already decremented during this order attempt
      for (const dec of decrementedItems) {
        await Product.findByIdAndUpdate(dec.productId, {
          $inc: { stock: dec.quantity },
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to place order due to inventory conflicts',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders of the logged-in customer
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow customer to see their own orders, unless admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
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

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
};
