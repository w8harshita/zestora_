const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: String,
  emojis: [String],
  coverColor: { type: String, default: '#FFF0E6' },
  tags: [String],
  cuisine: [String],
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  totalRatings: { type: Number, default: 0 },
  deliveryTime: {
    min: { type: Number, default: 20 },
    max: { type: Number, default: 40 }
  },
  minOrder: { type: Number, default: 149 },
  deliveryFee: { type: Number, default: 29 },
  isOpen: { type: Boolean, default: true },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
