const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  description: String,
  emoji: { type: String, default: '🍽️' },
  bgColor: { type: String, default: '#FFF0E6' },
  badge: String,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  restaurantName: String,
  category: {
    type: String,
    required: true,
    enum: ['pizza', 'burger', 'sushi', 'indian', 'mexican', 'noodles', 'healthy', 'desserts', 'drinks', 'other']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  totalRatings: { type: Number, default: 0 },
  deliveryTime: { type: Number, default: 30 },
  isVeg: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
