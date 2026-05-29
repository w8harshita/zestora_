# 🍕 ZestOra — Backend API

REST API for the ZestOra food delivery platform, built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your MONGO_URI and JWT_SECRET

# 3. Seed the database with sample data
npm run seed

# 4. Start the server
npm run dev        # development (with nodemon)
npm start          # production
```

Server runs at **http://localhost:5000**

---

## 📁 Project Structure

```
zestora-backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, login, profile
│   ├── foodController.js      # Food CRUD
│   ├── restaurantController.js# Restaurant CRUD + menu
│   ├── cartController.js      # Cart management
│   └── orderController.js     # Order placement & tracking
├── middleware/
│   ├── auth.js                # JWT protect + adminOnly
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── Food.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── foods.js
│   ├── restaurants.js
│   ├── cart.js
│   └── orders.js
├── seed.js                    # Sample data seeder
├── server.js                  # Entry point
└── .env.example
```

---

## 🔐 Auth API — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Create new account |
| POST | `/login` | ❌ | Login, returns JWT |
| GET | `/me` | ✅ | Get current user |
| PUT | `/update-profile` | ✅ | Update name, phone, addresses |
| PUT | `/change-password` | ✅ | Change password |

**Register body:**
```json
{ "name": "Harshita", "email": "h@example.com", "password": "secret123", "phone": "9999999999" }
```

**Login response:**
```json
{ "success": true, "token": "eyJ...", "data": { "name": "Harshita", "email": "..." } }
```

---

## 🍕 Foods API — `/api/foods`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | Get all foods (with filters) |
| GET | `/:id` | ❌ | Get food by ID |
| POST | `/` | 🔑 Admin | Add new food item |
| PUT | `/:id` | 🔑 Admin | Update food item |
| DELETE | `/:id` | 🔑 Admin | Delete food item |

**Query filters:** `?category=pizza&search=burger&sort=rating&minPrice=100&maxPrice=500&isVeg=true`

---

## 🏪 Restaurants API — `/api/restaurants`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | Get all restaurants |
| GET | `/:id` | ❌ | Get restaurant by ID |
| GET | `/:id/menu` | ❌ | Get full menu grouped by category |
| POST | `/` | 🔑 Admin | Add restaurant |
| PUT | `/:id` | 🔑 Admin | Update restaurant |
| DELETE | `/:id` | 🔑 Admin | Delete restaurant |

---

## 🛒 Cart API — `/api/cart`

> All routes require authentication (`Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get current user's cart |
| POST | `/add` | Add item to cart |
| PUT | `/update` | Update item quantity |
| DELETE | `/remove/:foodId` | Remove item from cart |
| DELETE | `/clear` | Clear entire cart |

**Add to cart body:**
```json
{ "foodId": "<food_id>", "quantity": 2 }
```

---

## 📦 Orders API — `/api/orders`

> All routes require authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/place` | ✅ User | Place order from cart |
| GET | `/my-orders` | ✅ User | Get my order history |
| GET | `/:id` | ✅ User | Get order details |
| PUT | `/:id/cancel` | ✅ User | Cancel order |
| PUT | `/:id/status` | 🔑 Admin | Update order status |
| GET | `/` | 🔑 Admin | Get all orders |

**Place order body:**
```json
{
  "deliveryAddress": { "street": "42 MG Road", "city": "Jamshedpur", "state": "JH", "pincode": "831001" },
  "paymentMethod": "upi"
}
```

**Order statuses:** `placed → confirmed → preparing → out_for_delivery → delivered`

---

## 🌱 Seeded Data

After running `npm run seed`:

| Type | Data |
|---|---|
| Restaurants | Pizza Palace, Burger Bros, Spice Route, Tokyo Dori, El Rancho, Green Eats |
| Food Items | 8 dishes across all categories |
| Admin User | `admin@zestora.com` / `admin123` |

---

## 🔧 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zestora
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🛠️ Tech Stack

- **Node.js** + **Express** — Server & routing
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **cors** — Cross-origin requests
- **morgan** — Request logging
