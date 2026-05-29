const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @route  GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food', 'name emoji price isAvailable');
    if (!cart) return res.status(200).json({ success: true, data: { items: [], subtotal: 0 } });
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/cart/add
exports.addToCart = async (req, res, next) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable)
      return res.status(404).json({ success: false, message: 'Food item not available.' });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        restaurant: food.restaurant,
        items: [{ food: food._id, name: food.name, emoji: food.emoji, price: food.price, quantity }]
      });
    } else {
      // Warn if adding from a different restaurant
      if (cart.restaurant && cart.restaurant.toString() !== food.restaurant.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Your cart has items from another restaurant. Clear cart first.',
          clearRequired: true
        });
      }

      const existingItem = cart.items.find(i => i.food.toString() === foodId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ food: food._id, name: food.name, emoji: food.emoji, price: food.price, quantity });
        if (!cart.restaurant) cart.restaurant = food.restaurant;
      }
      await cart.save();
    }

    res.status(200).json({ success: true, message: `${food.name} added to cart!`, data: cart });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/cart/update
exports.updateCartItem = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.find(i => i.food.toString() === foodId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart.' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.food.toString() !== foodId);
      if (cart.items.length === 0) cart.restaurant = undefined;
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/cart/remove/:foodId
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.items = cart.items.filter(i => i.food.toString() !== req.params.foodId);
    if (cart.items.length === 0) cart.restaurant = undefined;
    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed.', data: cart });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/cart/clear
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    next(err);
  }
};
