require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Food = require('./models/Food');
const User = require('./models/User');
const connectDB = require('./config/db');

const restaurants = [
  { name: 'Pizza Palace', emojis: ['🍕', '🥙'], coverColor: '#FFF0E6', tags: ['Italian', 'Pizza', 'Pasta'], cuisine: ['Italian'], rating: 4.8, deliveryTime: { min: 20, max: 30 }, minOrder: 199, isOpen: true },
  { name: 'Burger Bros', emojis: ['🍔', '🌭'], coverColor: '#FFF5E6', tags: ['Burgers', 'American', 'Fries'], cuisine: ['American'], rating: 4.9, deliveryTime: { min: 15, max: 25 }, minOrder: 149, isOpen: true },
  { name: 'Spice Route', emojis: ['🍛', '🫓'], coverColor: '#FFF8E6', tags: ['Indian', 'Biryani', 'Curry'], cuisine: ['Indian'], rating: 4.7, deliveryTime: { min: 30, max: 45 }, minOrder: 249, isOpen: true },
  { name: 'Tokyo Dori', emojis: ['🍣', '🍱'], coverColor: '#E6FFF4', tags: ['Japanese', 'Sushi', 'Ramen'], cuisine: ['Japanese'], rating: 4.9, deliveryTime: { min: 25, max: 35 }, minOrder: 399, isOpen: true },
  { name: 'El Rancho', emojis: ['🌮', '🫔'], coverColor: '#FFFBE6', tags: ['Mexican', 'Tacos', 'Burritos'], cuisine: ['Mexican'], rating: 4.6, deliveryTime: { min: 20, max: 30 }, minOrder: 179, isOpen: true },
  { name: 'Green Eats', emojis: ['🥗', '🥦'], coverColor: '#E6FFF0', tags: ['Healthy', 'Salads', 'Vegan'], cuisine: ['Healthy'], rating: 4.5, deliveryTime: { min: 15, max: 25 }, minOrder: 199, isOpen: true },
];

const seedDB = async () => {
  await connectDB();

  console.log('🗑️  Clearing existing data...');
  await Restaurant.deleteMany();
  await Food.deleteMany();
  await User.deleteMany({ role: { $ne: 'admin' } });

  console.log('🏪 Seeding restaurants...');
  const createdRestaurants = await Restaurant.insertMany(restaurants);

  const rMap = {};
  createdRestaurants.forEach(r => { rMap[r.name] = r._id; });

  const foods = [
    { name: 'Margherita Supreme', emoji: '🍕', bgColor: '#FFF0E6', badge: '🔥 Bestseller', restaurant: rMap['Pizza Palace'], restaurantName: 'Pizza Palace', category: 'pizza', price: 299, rating: 4.8, deliveryTime: 25, isVeg: true, tags: ['bestseller', 'cheese', 'classic'] },
    { name: 'Smoky BBQ Burger', emoji: '🍔', bgColor: '#FFF5E6', badge: 'New', restaurant: rMap['Burger Bros'], restaurantName: 'Burger Bros', category: 'burger', price: 249, rating: 4.9, deliveryTime: 20, isVeg: false, tags: ['bbq', 'smoky', 'juicy'] },
    { name: 'Butter Chicken Bowl', emoji: '🍛', bgColor: '#FFF8F0', badge: "Chef's Pick", restaurant: rMap['Spice Route'], restaurantName: 'Spice Route', category: 'indian', price: 349, rating: 4.7, deliveryTime: 35, isVeg: false, tags: ['butter chicken', 'curry', 'rich'] },
    { name: 'Salmon Nigiri Set', emoji: '🍣', bgColor: '#F0FFF8', badge: 'Premium', restaurant: rMap['Tokyo Dori'], restaurantName: 'Tokyo Dori', category: 'sushi', price: 599, rating: 4.9, deliveryTime: 30, isVeg: false, tags: ['salmon', 'premium', 'japanese'] },
    { name: 'Chicken Tacos (3)', emoji: '🌮', bgColor: '#FFFBF0', badge: 'Popular', restaurant: rMap['El Rancho'], restaurantName: 'El Rancho', category: 'mexican', price: 219, rating: 4.6, deliveryTime: 22, isVeg: false, tags: ['tacos', 'chicken', 'spicy'] },
    { name: 'Ramen Tonkotsu', emoji: '🍜', bgColor: '#F0F8FF', badge: '', restaurant: rMap['Tokyo Dori'], restaurantName: 'Tokyo Dori', category: 'noodles', price: 329, rating: 4.8, deliveryTime: 28, isVeg: false, tags: ['ramen', 'pork', 'broth'] },
    { name: 'Caesar Salad Bowl', emoji: '🥗', bgColor: '#F0FFF4', badge: 'Healthy', restaurant: rMap['Green Eats'], restaurantName: 'Green Eats', category: 'healthy', price: 199, rating: 4.5, deliveryTime: 18, isVeg: true, tags: ['salad', 'healthy', 'light'] },
    { name: 'Dark Choco Lava', emoji: '🍰', bgColor: '#FFF0F8', badge: '⭐ 5.0', restaurant: rMap['Pizza Palace'], restaurantName: 'Pizza Palace', category: 'desserts', price: 149, rating: 5.0, deliveryTime: 15, isVeg: true, tags: ['chocolate', 'dessert', 'lava cake'] },
  ];

  console.log('🍕 Seeding food items...');
  await Food.insertMany(foods);

  console.log('👤 Creating admin user...');
  await User.create({
    name: 'ZestOra Admin',
    email: 'admin@zestora.com',
    password: 'admin123',
    role: 'admin'
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin login: admin@zestora.com / admin123');
  mongoose.disconnect();
};

seedDB().catch(err => { console.error(err); process.exit(1); });
