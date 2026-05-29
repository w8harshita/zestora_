const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: String,
  emoji: String,
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  items: [orderItemSchema],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  pricing: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 29 },
    gst: Number,
    total: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'wallet', 'cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelReason: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
