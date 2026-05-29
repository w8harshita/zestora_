const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @route  POST /api/orders/place
exports.placeOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = 29;
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + gst;

    const estimatedDelivery = new Date(Date.now() + 35 * 60 * 1000); // 35 min from now

    const order = await Order.create({
      user: req.user._id,
      restaurant: cart.restaurant,
      items: cart.items.map(i => ({
        food: i.food,
        name: i.name,
        emoji: i.emoji,
        price: i.price,
        quantity: i.quantity
      })),
      deliveryAddress,
      pricing: { subtotal, deliveryFee, gst, total },
      paymentMethod: paymentMethod || 'cod',
      estimatedDelivery
    });

    // Clear cart after placing order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, message: 'Order placed successfully! 🎉', data: order });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('restaurant', 'name emojis');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised.' });

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised.' });

    if (!['placed', 'confirmed'].includes(order.status))
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage.' });

    order.status = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by user';
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled.', data: order });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/orders/:id/status  (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders  (admin - all orders)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('restaurant', 'name');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};
