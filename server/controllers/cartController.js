const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to format cart and calculate total price
const formatCartResponse = (cartDoc) => {
  if (!cartDoc) {
    return {
      items: [],
      totalPrice: 0,
    };
  }

  // Filter out any items without a populated active product
  const validItems = cartDoc.items.filter(
    (item) => item.product && item.product.isActive !== false
  );

  const totalPrice = validItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return {
    _id: cartDoc._id,
    user: cartDoc.user,
    items: validItems,
    totalPrice: Number(totalPrice.toFixed(2)),
    createdAt: cartDoc.createdAt,
    updatedAt: cartDoc.updatedAt,
  };
};

// @desc    Get user's shopping cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price image stock isActive category',
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 },
      });
    }

    // Filter out inactive or deleted products from cart
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product && item.product.isActive !== false
    );

    if (cart.items.length !== originalLength) {
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const qty = parseInt(quantity, 10) || 1;
    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    // Check product existence and stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable',
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock available. Currently only ${product.stock} left in stock`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + qty;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add requested quantity. You already have ${cart.items[itemIndex].quantity} in your cart, and only ${product.stock} are available`,
        });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price image stock isActive category',
    });

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of an item in cart
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required',
      });
    }

    const qty = parseInt(quantity, 10);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    if (qty <= 0) {
      // Remove item if quantity is zero or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Verify product stock
      const product = await Product.findById(cart.items[itemIndex].product);
      if (!product || !product.isActive) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res.status(400).json({
          success: false,
          message: 'Product is no longer available and was removed from cart',
        });
      }

      if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock})`,
        });
      }

      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price image stock isActive category',
    });

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price image stock isActive category',
    });

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
