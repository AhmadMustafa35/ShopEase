import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getCart as fetchCartApi, addToCart as addToCartApi, updateCartItem as updateCartItemApi, removeCartItem as removeCartItemApi } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'shopease_guest_cart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  // Helper to calculate total price for local cart
  const calculateLocalTotal = (items) => {
    return items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Load cart based on authentication state
  const loadCart = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const res = await fetchCartApi();
        if (res?.success && res.cart) {
          setCart({
            items: res.cart.items || [],
            totalPrice: res.cart.totalPrice ?? calculateLocalTotal(res.cart.items || []),
          });
        }
      } catch (error) {
        console.error('Error fetching server cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user: load from localStorage
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCart({
            items: parsed.items || [],
            totalPrice: parsed.totalPrice ?? calculateLocalTotal(parsed.items || []),
          });
        } catch {
          setCart({ items: [], totalPrice: 0 });
        }
      } else {
        setCart({ items: [], totalPrice: 0 });
      }
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Sync guest cart changes to localStorage
  const saveGuestCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    const productId = typeof product === 'object' ? product._id : product;

    if (user) {
      try {
        const res = await addToCartApi(productId, quantity);
        if (res?.success && res.cart) {
          setCart({
            items: res.cart.items || [],
            totalPrice: res.cart.totalPrice ?? calculateLocalTotal(res.cart.items || []),
          });
          toast.success('Added to cart!');
          return true;
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Could not add item to cart';
        toast.error(errorMsg);
        return false;
      }
    } else {
      // Guest mode
      const currentItems = [...cart.items];
      const existingIndex = currentItems.findIndex(
        (item) => (item.product?._id || item.product) === productId
      );

      if (existingIndex > -1) {
        const currentQty = currentItems[existingIndex].quantity;
        const maxStock = currentItems[existingIndex].product?.stock ?? 999;
        const newQty = Math.min(currentQty + quantity, maxStock);
        currentItems[existingIndex] = {
          ...currentItems[existingIndex],
          quantity: newQty,
        };
      } else {
        const productObj = typeof product === 'object' ? product : { _id: productId, name: 'Product', price: 0 };
        currentItems.push({
          _id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          product: productObj,
          quantity: Math.min(quantity, productObj.stock ?? 999),
        });
      }

      const updatedCart = {
        items: currentItems,
        totalPrice: calculateLocalTotal(currentItems),
      };
      saveGuestCart(updatedCart);
      toast.success('Added to cart!');
      return true;
    }
  };

  // Update quantity of an item
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    if (user) {
      try {
        const res = await updateCartItemApi(itemId, quantity);
        if (res?.success && res.cart) {
          setCart({
            items: res.cart.items || [],
            totalPrice: res.cart.totalPrice ?? calculateLocalTotal(res.cart.items || []),
          });
          return true;
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not update quantity');
        return false;
      }
    } else {
      // Guest mode
      const updatedItems = cart.items.map((item) => {
        if (item._id === itemId) {
          const maxStock = item.product?.stock ?? 999;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      });

      const updatedCart = {
        items: updatedItems,
        totalPrice: calculateLocalTotal(updatedItems),
      };
      saveGuestCart(updatedCart);
      return true;
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    if (user) {
      try {
        const res = await removeCartItemApi(itemId);
        if (res?.success && res.cart) {
          setCart({
            items: res.cart.items || [],
            totalPrice: res.cart.totalPrice ?? calculateLocalTotal(res.cart.items || []),
          });
          toast.success('Item removed from cart');
          return true;
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove item');
        return false;
      }
    } else {
      // Guest mode
      const updatedItems = cart.items.filter((item) => item._id !== itemId);
      const updatedCart = {
        items: updatedItems,
        totalPrice: calculateLocalTotal(updatedItems),
      };
      saveGuestCart(updatedCart);
      toast.success('Item removed from cart');
      return true;
    }
  };

  // Clear cart locally
  const clearCart = () => {
    setCart({ items: [], totalPrice: 0 });
    localStorage.removeItem(GUEST_CART_KEY);
  };

  // Computed total count of items in cart
  const cartCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cart]);

  const value = {
    cart,
    loading,
    cartCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
