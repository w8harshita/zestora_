require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── Serve Frontend (public folder) ─────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── API Health Check ────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🍕 ZestOra API is running!',
    version: '1.0.0',
    endpoints: {
      auth:        '/api/auth',
      foods:       '/api/foods',
      restaurants: '/api/restaurants',
      cart:        '/api/cart',
      orders:      '/api/orders'
    }
  });
});

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/foods',       require('./routes/foods'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/cart',        require('./routes/cart'));
app.use('/api/orders',      require('./routes/orders'));

// ── Catch-all: serve frontend for any non-API route ─────────
// This means http://localhost:5000 and http://localhost:5000/anything
// will all serve your food.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'food.html'));
});

// ── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ZestOra server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend:  http://localhost:${PORT}`);
  console.log(`📡 API:       http://localhost:${PORT}/api`);
});