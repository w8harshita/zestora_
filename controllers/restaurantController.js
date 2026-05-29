const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

// @route  GET /api/restaurants
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, isOpen, sort } = req.query;
    const query = { isActive: true };

    if (isOpen === 'true') query.isOpen = true;
    if (cuisine) query.cuisine = { $in: [cuisine] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { rating: -1 };
    if (sort === 'delivery_time') sortOption = { 'deliveryTime.min': 1 };
    if (sort === 'min_order') sortOption = { minOrder: 1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const restaurants = await Restaurant.find(query).sort(sortOption);
    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/restaurants/:id
exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/restaurants/:id/menu
exports.getRestaurantMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    const menu = await Food.find({ restaurant: req.params.id, isAvailable: true });

    // Group by category
    const grouped = menu.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({ success: true, restaurant, menu: grouped });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/restaurants  (admin)
exports.createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/restaurants/:id  (admin)
exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/restaurants/:id  (admin)
exports.deleteRestaurant = async (req, res, next) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Restaurant deleted.' });
  } catch (err) {
    next(err);
  }
};
