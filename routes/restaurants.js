const express = require('express');
const router = express.Router();
const {
  getAllRestaurants, getRestaurantById, getRestaurantMenu,
  createRestaurant, updateRestaurant, deleteRestaurant
} = require('../controllers/restaurantController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);
router.post('/', protect, adminOnly, createRestaurant);
router.put('/:id', protect, adminOnly, updateRestaurant);
router.delete('/:id', protect, adminOnly, deleteRestaurant);

module.exports = router;
