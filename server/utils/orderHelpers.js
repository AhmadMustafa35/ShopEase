const crypto = require('crypto');

const VALID_STATUS_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

/**
 * Generates an order reference string in the format SE-YYYYMMDD-XXXXX
 * Example: SE-20261016-A3X7K
 */
const generateOrderRef = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  const randomBytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    randomStr += chars[randomBytes[i] % chars.length];
  }

  return `SE-${dateStr}-${randomStr}`;
};

/**
 * Checks if transitioning from currentStatus to newStatus is allowed
 */
const isValidTransition = (currentStatus, newStatus) => {
  if (!VALID_STATUS_TRANSITIONS[currentStatus]) {
    return false;
  }
  return VALID_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
};

module.exports = {
  VALID_STATUS_TRANSITIONS,
  generateOrderRef,
  isValidTransition,
};
