const Food = require('../models/Food');

// @route  GET /api/foods
exports.getAllFoods = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice, isVeg, restaurantId } = req.query;
    const query = { isAvailable: true };

    if (category) query.category = category;
    if (isVeg === 'true') query.isVeg = true;
    if (restaurantId) query.restaurant = restaurantId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { restaurantName: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'delivery_time') sortOption = { deliveryTime: 1 };

    const foods = await Food.find(query).sort(sortOption).populate('restaurant', 'name isOpen');
    res.status(200).json({ success: true, count: foods.length, data: foods });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/foods/:id
exports.getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant');
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found.' });
    res.status(200).json({ success: true, data: food });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/foods  (admin)
exports.createFood = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, data: food });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/foods/:id  (admin)
exports.updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found.' });
    res.status(200).json({ success: true, data: food });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/foods/:id  (admin)
exports.deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found.' });
    res.status(200).json({ success: true, message: 'Food item deleted.' });
  } catch (err) {
    next(err);
  }
};
