# 🍽️ My Canteen — Smart Campus Food Ordering System

> A full-stack real-time food ordering web application designed for college/university canteens. Students can browse the menu, add items to their cart, place orders with a simulated payment, and track live order status updates. Admins can manage the menu, view incoming orders in real time, and update order statuses — all with instant WebSocket-powered notifications.

---

## 📑 Table of Contents

1. [High-Level Overview](#1-high-level-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [System Architecture](#4-system-architecture)
5. [Full Execution Flow (User Opens the App)](#5-full-execution-flow)
6. [Frontend Flow](#6-frontend-flow)
7. [Backend Flow](#7-backend-flow)
8. [Database Flow](#8-database-flow)
9. [Authentication & Authorization Flow](#9-authentication--authorization-flow)
10. [API Communication Flow](#10-api-communication-flow)
11. [Key Components & Modules](#11-key-components--modules)
12. [Key Functions & Why They Exist](#12-key-functions--why-they-exist)
13. [Environment Variables](#13-environment-variables)
14. [External Services](#14-external-services)
15. [Data Flow Walkthrough (End-to-End Example)](#15-data-flow-walkthrough)
16. [Error Handling & Validation](#16-error-handling--validation)
17. [Deployment Guide](#17-deployment-guide)
18. [Possible Bugs, Security Risks & Improvements](#18-possible-bugs-security-risks--improvements)
19. [Getting Started (Local Setup)](#19-getting-started-local-setup)

---

## 1. High-Level Overview

**My Canteen** is a MERN-stack (MongoDB, Express, React, Node.js) web application with real-time capabilities via Socket.IO. It solves a common problem on college campuses: **long, unpredictable queues at the canteen**.

### What It Does

| Feature | Description |
|---|---|
| **Student Registration & Login** | Students register with their USN (University Serial Number), admins register with a username. |
| **Browse Menu** | Students see available food items with prices, stock levels, and preparation types. |
| **Cart System** | Persistent cart (localStorage) with add/remove/increase/decrease functionality. |
| **Simulated Payment** | A test-mode payment page that places the order after a fake delay. |
| **Real-Time Order Tracking** | Students see live countdown timers and status updates via WebSocket. |
| **Smart ETA Calculation** | For freshly-prepared items, the system calculates estimated ready times based on pending orders, batch capacity, and prep time. |
| **Admin Menu Management** | Admins can add new menu items (with type: instant or prepared) and delete existing ones. |
| **Admin Order Dashboard** | Admins see all orders in real time, separated into Pending / Preparing / Ready pages. |
| **Status Progression** | Admins can move orders forward: `pending → preparing → ready` (no backward transitions). |
| **Live Notifications** | When an admin marks an order "ready", the student gets an instant notification on their orders page. |

### Two User Roles

- **Student** — Can browse menu, add to cart, pay (dummy), view & track their orders.
- **Admin** — Can manage menu items, view all orders, and update order statuses in real time.

---

## 2. Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.0 | UI library for building component-based interfaces |
| **React Router DOM** | 7.13.0 | Client-side routing and navigation |
| **Vite** | 7.2.4 | Lightning-fast dev server and build tool |
| **Axios** | 1.13.5 | HTTP client for making API calls to the backend |
| **Socket.IO Client** | 4.8.3 | Real-time bidirectional communication with the server |
| **Vanilla CSS** | — | Custom styling with CSS variables for theming |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | — | JavaScript runtime for the server |
| **Express** | 5.2.1 | Web framework for building REST APIs |
| **Mongoose** | 9.1.6 | MongoDB ODM (Object Document Mapper) for data modeling |
| **Socket.IO** | 4.8.3 | Real-time WebSocket server for live updates |
| **bcryptjs** | 3.0.3 | Password hashing for secure authentication |
| **jsonwebtoken** | 9.0.3 | JWT-based stateless authentication |
| **dotenv** | 16.4.5 | Load environment variables from `.env` file |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing middleware |

### Database

| Technology | Purpose |
|---|---|
| **MongoDB** | NoSQL document database (local instance at `mongodb://127.0.0.1:27017/canteen`) |

---

## 3. Folder Structure

```
CanteenApp/
├── client/                          # 🖥️ FRONTEND (React + Vite)
│   ├── index.html                   # HTML entry point — title "My Canteen", mounts React
│   ├── vite.config.js               # Vite config — React plugin, API proxy to port 5000
│   ├── package.json                 # Frontend dependencies & scripts
│   ├── public/
│   │   └── vite.svg                 # Favicon
│   ├── dist/                        # Production build output (generated by `npm run build`)
│   └── src/
│       ├── main.jsx                 # React entry point — renders <App /> into #root
│       ├── App.jsx                  # Root component — defines ALL routes + wraps in CartProvider
│       ├── index.css                # Global CSS — design tokens, status colors, theme variables
│       │
│       ├── api/
│       │   └── axios.js             # Axios instance — baseURL, auth interceptor, 401 handler
│       │
│       ├── auth/
│       │   └── ProtectionRoute.jsx  # Route guards — StudentOnly & AdminOnly wrappers
│       │
│       ├── cart/
│       │   └── CartContext.jsx      # React Context + localStorage cart — add/remove/clear/total
│       │
│       ├── components/
│       │   └── Header.jsx           # Shared nav header — role-based links, cart badge, logout
│       │
│       ├── socket/
│       │   └── socket.js            # Socket.IO client singleton — connects, auto-joins rooms
│       │
│       └── pages/
│           ├── Landing.jsx          # Public landing page — hero, features, CTA sections
│           ├── Login.jsx            # Login form — sends USN/username + password, stores JWT
│           ├── Register.jsx         # Registration form — role selection, USN or username
│           ├── Menu.jsx             # Student menu — grid of food items with "Add to Cart"
│           ├── Cart.jsx             # Cart page — quantity controls, subtotals, proceed to pay
│           ├── Payment.jsx          # Dummy payment — fake delay, then calls POST /orders
│           ├── MyOrders.jsx         # Student's orders — live countdown, status badges, socket updates
│           ├── AdminMenu.jsx        # Admin menu CRUD — add/delete items with full form
│           ├── AdminOrders.jsx      # Admin all orders — shows every order, status update buttons
│           ├── AdminPendingOrders.jsx    # Filtered view — only "pending" orders (red theme)
│           ├── AdminPreparingOrders.jsx  # Filtered view — only "preparing" orders (yellow theme)
│           └── AdminReadyOrders.jsx     # Filtered view — only "ready" orders (green theme)
│
└── server/                          # ⚙️ BACKEND (Node.js + Express)
    ├── .env                         # Environment variables — PORT, MONGO_URI, JWT_SECRET
    ├── package.json                 # Backend dependencies & scripts
    └── src/
        ├── server.js                # Entry point — creates HTTP server, inits Socket.IO, connects DB
        ├── app.js                   # Express app — CORS, JSON parsing, route mounting
        │
        ├── config/
        │   └── db.js                # MongoDB connection using Mongoose
        │
        ├── models/
        │   ├── User.js              # User schema — usn, username, password, role (student/admin)
        │   ├── MenuItem.js          # Menu item schema — name, price, type (instant/prepared), stock
        │   └── Order.js             # Order schema — student ref, items, totalAmount, status, ETA
        │
        ├── controllers/
        │   ├── authController.js    # Register & Login logic — hashing, JWT signing
        │   ├── menuController.js    # CRUD for menu items — add, update, delete, get all
        │   └── orderController.js   # Order logic — place order, get my orders, get all, update status
        │
        ├── middleware/
        │   ├── authMiddleware.js    # JWT verification — extracts user from Bearer token
        │   └── roleMiddleware.js    # Role checker — restricts routes to specific role (admin/student)
        │
        ├── routes/
        │   ├── authRoutes.js        # POST /register, POST /login
        │   ├── profileRoutes.js     # GET /profile (protected test route)
        │   ├── adminRoutes.js       # GET /admin/dashboard (protected admin-only test route)
        │   ├── menuRoutes.js        # GET/POST/PUT/DELETE /menu (role-based)
        │   └── orderRoutes.js       # POST /orders, GET /orders/my, GET /orders, PUT /orders/:id/status
        │
        └── utils/
            └── socketManager.js     # Socket.IO manager — init, room joins, emit helpers
```

---

## 4. System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                         │
│                         http://localhost:5173                         │
│                                                                      │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Landing  │  │  Login   │  │ Register │  │   Protected Pages    │  │
│  │  Page    │  │  Page    │  │   Page   │  │  (Menu, Cart, Orders │  │
│  │          │  │          │  │          │  │   Payment, Admin*)   │  │
│  └──────────┘  └────┬─────┘  └──────────┘  └─────────┬────────────┘  │
│                     │                                │               │
│              ┌──────┴──────────────────────────────────┴──────┐       │
│              │           Axios HTTP Client (REST)            │       │
│              │         + Socket.IO Client (WebSocket)        │       │
│              └──────────────────┬─────────────────────────────┘       │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │
                   HTTP (REST)    │    WebSocket
                   :5050/api/*    │    :5050 (Socket.IO)
                                  │
┌─────────────────────────────────┼────────────────────────────────────┐
│                        SERVER (Node.js + Express)                    │
│                         http://localhost:5050                         │
│                                                                      │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────────────┐  │
│  │   Express    │  │   Middleware   │  │    Socket.IO Server      │  │
│  │   Router     │  │  - authMW     │  │  - Room management       │  │
│  │              │  │  - roleMW     │  │  - Event emitting        │  │
│  │  /api/auth   │  │               │  │  - JWT verification      │  │
│  │  /api/menu   │  └───────┬───────┘  └────────────┬─────────────┘  │
│  │  /api/orders │          │                       │                │
│  │  /api/profile│  ┌───────┴───────┐               │                │
│  │  /api/admin  │  │  Controllers  │               │                │
│  └──────────────┘  │  - auth       │◄──────────────┘                │
│                    │  - menu       │                                │
│                    │  - order      │                                │
│                    └───────┬───────┘                                │
│                            │                                        │
│                    ┌───────┴───────┐                                │
│                    │   Mongoose    │                                │
│                    │    Models     │                                │
│                    │  User         │                                │
│                    │  MenuItem     │                                │
│                    │  Order        │                                │
│                    └───────┬───────┘                                │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │    MongoDB      │
                    │ localhost:27017  │
                    │   db: canteen   │
                    │                 │
                    │  Collections:   │
                    │  - users        │
                    │  - menuitems    │
                    │  - orders       │
                    └─────────────────┘
```

### Communication Patterns

| Pattern | Technology | Purpose |
|---|---|---|
| **REST API** | Axios → Express | All CRUD operations (login, register, menu, orders) |
| **WebSocket** | Socket.IO | Real-time push notifications (new orders → admin, status updates → student) |
| **localStorage** | Browser API | Auth tokens, role, userId, cart data persistence |

---

## 5. Full Execution Flow

Here's exactly what happens from the moment a user opens the app:

### Step 1: App Loads
1. Browser loads `index.html` → Vite injects `main.jsx`.
2. `main.jsx` renders `<App />` wrapped in `<StrictMode>`.
3. `<App />` wraps everything in `<CartProvider>` (initializes cart from localStorage) and `<BrowserRouter>`.
4. The router matches the URL (`/`) and renders `<Landing />`.

### Step 2: Socket Connects
1. `socket.js` is imported (singleton) — it immediately connects to `http://localhost:5050`.
2. On connection, it reads `token`, `userId`, and `role` from localStorage.
3. If authenticated, it emits a `"join"` event to the server to join the user's personal room (and `admin-room` if admin).

### Step 3: User Navigates
- **Unauthenticated** → Landing, Login, or Register pages are accessible.
- **Authenticated** → `ProtectionRoute.jsx` checks `localStorage` for `token` and `role`:
  - `StudentOnly` wrapper: redirects to `/login` if no token or role ≠ "student".
  - `AdminOnly` wrapper: redirects to `/admin/login` if no token or role ≠ "admin".

### Step 4: User Logs In
1. Login form sends `POST /api/auth/login` with `{ usn, username, password }`.
2. Backend finds the user by USN or username, compares bcrypt hash.
3. On success, returns `{ token, role }` — token contains `{ id, role }` payload, expires in 1 day.
4. Frontend stores `token`, `role`, `userId` in localStorage.
5. Socket emits `"join"` to register the user in their personal room.
6. Redirects: students → `/menu`, admins → `/admin/orders`.

### Step 5: Student Orders Food
1. **Menu Page** — `GET /api/menu` fetches all items. Cards show name, price, stock/type.
2. **Add to Cart** — `useCart()` context adds item to state + localStorage.
3. **Cart Page** — Shows items with +/- controls, subtotals, total. "Proceed to Payment" navigates to `/payment`.
4. **Payment Page** — Fake 700ms delay, then `POST /api/orders` with `{ items: [{ menuItem, quantity }] }`.
5. Backend creates the order, calculates ETAs, deducts stock, and emits `"order:new"` to `admin-room` via Socket.IO.
6. Student is redirected to `/orders` (My Orders page).

### Step 6: Admin Manages Orders
1. Admin dashboard receives `"order:new"` socket event — new order appears instantly (highlighted for 3 seconds).
2. Admin clicks "Mark as Preparing" → `PUT /api/orders/:id/status { status: "preparing" }`.
3. Backend updates the order and emits `"order:statusUpdated"` to the student's room.
4. Student sees the status change live on their My Orders page.
5. Admin clicks "Mark as Ready" → same flow → student gets a "ready for pickup" notification.

---

## 6. Frontend Flow

### Routing Map

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | `Landing` | Public | Marketing landing page |
| `/login` | `Login` | Public | Student & admin login |
| `/admin/login` | `Login` | Public | Same component, different redirect |
| `/register` | `Register` | Public | New user registration |
| `/menu` | `Menu` | Student | Browse food items, add to cart |
| `/cart` | `Cart` | Student | View/edit cart, proceed to pay |
| `/payment` | `Payment` | Student | Dummy payment, places order |
| `/orders` | `MyOrders` | Student | View order history, live tracking |
| `/admin/menu` | `AdminMenu` | Admin | Add/delete menu items |
| `/admin/orders` | `AdminOrders` | Admin | View all orders |
| `/admin/orders/pending` | `AdminPendingOrders` | Admin | Pending orders only |
| `/admin/orders/preparing` | `AdminPreparingOrders` | Admin | Preparing orders only |
| `/admin/orders/ready` | `AdminReadyOrders` | Admin | Ready orders only |

### State Management

| Mechanism | What It Manages |
|---|---|
| **React `useState`** | Local component state (forms, loading, errors, orders lists) |
| **React Context (`CartContext`)** | Global cart state — items, quantities, totals |
| **localStorage** | Authentication (`token`, `role`, `userId`) and cart persistence |
| **Socket.IO events** | Real-time order state (new orders, status changes) |

### Component Hierarchy

```
<CartProvider>                      ← Global cart state
  <BrowserRouter>                   ← Client-side routing
    <Routes>
      <Route "/" → Landing />       ← Public
      <Route "/login" → Login />    ← Public
      <Route "/register" → Register />  ← Public
      <StudentOnly>                 ← Auth guard
        <Route "/menu" → Menu />
        <Route "/cart" → Cart />
        <Route "/payment" → Payment />
        <Route "/orders" → MyOrders />
      </StudentOnly>
      <AdminOnly>                   ← Auth guard
        <Route "/admin/menu" → AdminMenu />
        <Route "/admin/orders/*" → Admin*Orders />
      </AdminOnly>
    </Routes>
  </BrowserRouter>
</CartProvider>
```

---

## 7. Backend Flow

### API Routes Summary

| Method | Endpoint | Auth | Role | Controller | Description |
|---|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | — | `authController.register` | Create new user |
| `POST` | `/api/auth/login` | ❌ | — | `authController.login` | Authenticate, return JWT |
| `GET` | `/api/health` | ❌ | — | (inline) | Health check |
| `GET` | `/api/profile` | ✅ | Any | (inline) | Test protected route |
| `GET` | `/api/admin/dashboard` | ✅ | Admin | (inline) | Test admin route |
| `GET` | `/api/menu` | ✅ | Any | `menuController.getMenu` | List all menu items |
| `POST` | `/api/menu` | ✅ | Admin | `menuController.addMenuItem` | Add new menu item |
| `PUT` | `/api/menu/:id` | ✅ | Admin | `menuController.updateMenuItem` | Update menu item |
| `DELETE` | `/api/menu/:id` | ✅ | Admin | `menuController.deleteMenuItem` | Delete menu item |
| `POST` | `/api/orders` | ✅ | Student | `orderController.placeOrder` | Place a new order |
| `GET` | `/api/orders/my` | ✅ | Student | `orderController.getMyOrders` | Get logged-in student's orders |
| `GET` | `/api/orders` | ✅ | Admin | `orderController.getAllOrders` | Get all orders |
| `PUT` | `/api/orders/:id/status` | ✅ | Admin | `orderController.updateOrderStatus` | Update order status |

### Middleware Chain

Every protected request goes through:

```
Request  →  authMiddleware  →  roleMiddleware  →  Controller  →  Response
             (verify JWT)      (check role)       (business logic)
```

1. **`authMiddleware`** — Extracts `Bearer <token>` from the `Authorization` header, verifies it with `jwt.verify()`, and attaches `{ id, role }` to `req.user`.
2. **`roleMiddleware(role)`** — Factory function that returns middleware checking `req.user.role === role`. Returns 403 if mismatch.

### Socket.IO Events

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `join` | Client → Server | `{ userId, token, role }` | Join personal room + admin-room |
| `order:new` | Server → Admin Room | `{ orderId, student, items, totalAmount, status, estimatedReadyTime, createdAt }` | Notify admin of new order |
| `order:statusUpdated` | Server → Student Room | `{ orderId, status }` | Notify student of status change |

---

## 8. Database Flow

### Collections & Schemas

#### `users`

```javascript
{
  usn: String,          // Unique, sparse — for students (e.g., "1RV21CS001")
  username: String,     // Unique, sparse — for admins (e.g., "admin123")
  password: String,     // bcrypt hashed, required
  role: String,         // "admin" | "student", required
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

#### `menuitems`

```javascript
{
  name: String,                   // e.g., "Veg Dosa"
  price: Number,                  // e.g., 40
  available: Boolean,             // default: true
  preparationType: String,        // "instant" | "prepared", required
  stock: Number,                  // For instant items (e.g., packaged chips)
  prepTimePerBatch: Number,       // For prepared items — minutes per batch
  batchCapacity: Number           // For prepared items — items per batch
}
```

#### `orders`

```javascript
{
  student: ObjectId → User,       // Who placed the order
  items: [{
    menuItem: ObjectId → MenuItem, // What was ordered
    quantity: Number,               // How many
    preparationType: String,        // Copied from menu item
    estimatedReadyTime: Date        // Per-item ETA
  }],
  totalAmount: Number,             // Total price
  status: String,                  // "pending" | "preparing" | "ready"
  estimatedReadyTime: Date,        // Overall order ETA (max of all items)
  createdAt: Date,                 // Auto-generated
  updatedAt: Date                  // Auto-generated
}
```

### Relationships (Diagram)

```
┌─────────┐         ┌─────────────┐         ┌──────────┐
│  User   │ 1 ──── N│   Order     │ N ──── N │ MenuItem │
│         │         │             │         │          │
│ _id     │◄────────│ student     │         │ _id      │
│ usn     │         │ items[]     │────────►│ name     │
│ username│         │  .menuItem  │         │ price    │
│ password│         │  .quantity  │         │ type     │
│ role    │         │ totalAmount │         │ stock    │
└─────────┘         │ status      │         └──────────┘
                    │ ETA         │
                    └─────────────┘
```

### Key Queries

| Operation | Query | File |
|---|---|---|
| Find user by USN or username | `User.findOne({ $or: [{ usn }, { username }] })` | `authController.js` |
| Get all menu items | `MenuItem.find()` | `menuController.js` |
| Get student's orders (newest first) | `Order.find({ student: id }).populate("items.menuItem").sort({ createdAt: -1 })` | `orderController.js` |
| Get all pending orders for ETA calc | `Order.find({ status: { $in: ["pending", "preparing"] }, "items.menuItem": id })` | `orderController.js` |

---

## 9. Authentication & Authorization Flow

### Registration Flow

```
Client                                    Server
  │                                         │
  ├─ POST /api/auth/register ──────────────►│
  │  { usn/username, password, role }       │
  │                                         ├─ Validate fields
  │                                         ├─ bcrypt.hash(password, 10)
  │                                         ├─ User.create(...)
  │                                         │
  │◄── 201 { message: "User registered" } ──┤
  │                                         │
```

### Login Flow

```
Client                                    Server
  │                                         │
  ├─ POST /api/auth/login ────────────────►│
  │  { usn, username, password }            │
  │                                         ├─ User.findOne({ $or: [usn, username] })
  │                                         ├─ bcrypt.compare(password, hash)
  │                                         ├─ jwt.sign({ id, role }, SECRET, { expiresIn: "1d" })
  │                                         │
  │◄── 200 { token, role } ────────────────┤
  │                                         │
  ├─ Store token, role, userId in localStorage
  ├─ socket.emit("join", { userId, token, role })
  ├─ Navigate to /menu (student) or /admin/orders (admin)
```

### Auth Verification (Every Protected Request)

```
Client                                    Server
  │                                         │
  ├─ GET /api/menu ────────────────────────►│
  │  Header: Authorization: Bearer <JWT>    │
  │                                         ├─ authMiddleware:
  │                                         │    Extract token from header
  │                                         │    jwt.verify(token, SECRET)
  │                                         │    Attach { id, role } to req.user
  │                                         │
  │                                         ├─ roleMiddleware (if applicable):
  │                                         │    Check req.user.role === required
  │                                         │    403 if mismatch
  │                                         │
  │◄── 200 [menu items] ──────────────────┤
```

### Token Expiry / 401 Handling

The Axios response interceptor in `api/axios.js` automatically:
1. Catches any 401 response.
2. Clears all auth data from localStorage.
3. Redirects to the appropriate login page (student or admin).

---

## 10. API Communication Flow

### Complete Request → Response Cycle

```
┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   React Page     │     │  Axios Instance  │     │  Express Server  │
│  (e.g., Menu)    │     │  (api/axios.js)  │     │  (app.js)        │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                       │                         │
         │ api.get("/menu")      │                         │
         ├──────────────────────►│                         │
         │                       │ Interceptor adds        │
         │                       │ Authorization header    │
         │                       ├────────────────────────►│
         │                       │                         │ Route: /api/menu
         │                       │                         │ Middleware chain:
         │                       │                         │   authMiddleware ✓
         │                       │                         │ Controller:
         │                       │                         │   menuController.getMenu()
         │                       │                         │   → MenuItem.find()
         │                       │                         │   → res.json(menu)
         │                       │◄────────────────────────┤
         │ res.data = [...]      │                         │
         │◄──────────────────────┤                         │
         │                       │                         │
         │ setMenu(res.data)     │                         │
         │ (re-render UI)        │                         │
         │                       │                         │
```

---

## 11. Key Components & Modules

### Frontend

| Component/Module | File | Role |
|---|---|---|
| **`App`** | `App.jsx` | Root component — all routes defined here, wrapped in CartProvider |
| **`Header`** | `components/Header.jsx` | Shared navigation bar — shows role-specific links (Menu, Cart, Orders for students / Menu, Pending, Preparing, Ready for admins), cart badge count, logout button |
| **`CartContext`** | `cart/CartContext.jsx` | React Context for global cart state — persisted in localStorage with `addItem`, `increase`, `decrease`, `remove`, `clear` functions and computed `count`/`total` |
| **`ProtectionRoute`** | `auth/ProtectionRoute.jsx` | Two wrapper components (`StudentOnly`, `AdminOnly`) that check localStorage for valid auth and correct role |
| **`axios.js`** | `api/axios.js` | Pre-configured Axios instance — adds Bearer token to every request, auto-redirects on 401 |
| **`socket.js`** | `socket/socket.js` | Socket.IO client singleton — auto-connects, auto-joins room on connection |
| **`Landing`** | `pages/Landing.jsx` | Premium marketing page — Hero, How It Works, Features, Problem vs Solution, CTA, Footer with scroll animations |
| **`Login`** | `pages/Login.jsx` | Login form — decodes JWT to extract userId, stores auth data, joins socket room |
| **`Register`** | `pages/Register.jsx` | Registration form with role selection, client-side validation (password length, match) |
| **`Menu`** | `pages/Menu.jsx` | Student menu grid — shows items as square cards with "Add to Cart" button, stock info, preparation type |
| **`Cart`** | `pages/Cart.jsx` | Shopping cart — line items with +/- buttons, subtotals, total, "Proceed to Payment" |
| **`Payment`** | `pages/Payment.jsx` | Order summary + fake payment — 700ms delay, then POST to create order, redirect to orders |
| **`MyOrders`** | `pages/MyOrders.jsx` | Student order history — live countdown timers (refreshes every second), socket listener for status updates, "ready" notification |
| **`AdminOrders`** | `pages/AdminOrders.jsx` | All orders view for admin — socket listener for new orders (highlighted), status update buttons |
| **`AdminMenu`** | `pages/AdminMenu.jsx` | Menu management — add form (name, price, prep type, stock or batch settings), delete button with confirmation |
| **`AdminPendingOrders`** | `pages/AdminPendingOrders.jsx` | Pending-only orders (red theme) — "Mark as Preparing" and "Mark as Ready" buttons |
| **`AdminPreparingOrders`** | `pages/AdminPreparingOrders.jsx` | Preparing-only orders (yellow theme) — "Mark as Ready" button |
| **`AdminReadyOrders`** | `pages/AdminReadyOrders.jsx` | Ready-only orders (green theme) — completion banner |

### Backend

| Module | File | Role |
|---|---|---|
| **`server.js`** | `src/server.js` | Entry point — loads env, creates HTTP server, initializes Socket.IO, connects DB, starts listening |
| **`app.js`** | `src/app.js` | Express app — sets up CORS, JSON parsing, mounts all route groups |
| **`db.js`** | `config/db.js` | MongoDB connection — uses `mongoose.connect()` with `MONGO_URI` from `.env` |
| **`User`** | `models/User.js` | Mongoose model — users with dual identity (USN for students, username for admins) |
| **`MenuItem`** | `models/MenuItem.js` | Mongoose model — two preparation types with different attributes |
| **`Order`** | `models/Order.js` | Mongoose model — order with nested items array, status progression, ETA tracking |
| **`authController`** | `controllers/authController.js` | Register (hash + create) and Login (find + compare + sign JWT) |
| **`menuController`** | `controllers/menuController.js` | CRUD operations for menu items with type-specific validation |
| **`orderController`** | `controllers/orderController.js` | Core order logic — ETA calculation, stock deduction, socket emissions |
| **`authMiddleware`** | `middleware/authMiddleware.js` | JWT verification — extracts and validates Bearer token |
| **`roleMiddleware`** | `middleware/roleMiddleware.js` | Role-based access control — factory function returning middleware |
| **`socketManager`** | `utils/socketManager.js` | Socket.IO lifecycle management — init, join rooms (with JWT verification), emit to user/room/all |

---

## 12. Key Functions & Why They Exist

### `placeOrder` (orderController.js)
**Why:** This is the most complex function in the backend. It handles:
- Validating all ordered items against the database.
- Deducting stock for instant items (and returning error if out of stock).
- Calculating ETAs for prepared items by counting all pending orders for the same item across the system, then computing batch-based wait times.
- Creating the order document with per-item and overall estimated ready times.
- Emitting a `"order:new"` socket event to the admin room for real-time dashboard updates.

### `updateOrderStatus` (orderController.js)
**Why:** Enforces the one-way status progression rule (`pending → preparing → ready`). A numeric hierarchy prevents backward transitions. After updating, it emits `"order:statusUpdated"` to the specific student's socket room.

### `initSocketServer` (socketManager.js)
**Why:** Centralizes Socket.IO setup. Key behavior: on client `"join"`, it verifies the JWT (if provided) and joins the socket to the user's personal room (using their MongoDB `_id` as room name). Admins additionally join `"admin-room"` for receiving broadcast order notifications.

### `CartProvider` (CartContext.jsx)
**Why:** Provides a clean API for cart operations across all components without prop drilling. The cart persists in localStorage so it survives page refreshes. Uses `useMemo` for efficient computed values (`count`, `total`).

### `formatCountdown` (MyOrders.jsx)
**Why:** Converts the `estimatedReadyTime` Date into a human-readable countdown ("X min Y sec"). A `setInterval` runs every second to keep the display live. Shows "0 min" when ready, "Being prepared..." for items without ETA.

### Axios interceptors (axios.js)
**Why:** The request interceptor auto-attaches the JWT from localStorage so every API call is authenticated without manual header management. The response interceptor catches 401 errors globally, clears stale auth, and redirects to login — preventing the user from seeing broken authenticated pages.

---

## 13. Environment Variables

Located in `server/.env`:

| Variable | Value | Purpose |
|---|---|---|
| `PORT` | `5050` | Port the Express + Socket.IO server listens on |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/canteen` | MongoDB connection string — local instance, database named "canteen" |
| `JWT_SECRET` | `supersecretkey` | Secret key used to sign and verify JWT tokens |

> ⚠️ **Security Note:** The `JWT_SECRET` should be a long, random string in production (not `supersecretkey`).

---

## 14. External Services

This application currently uses **no external/cloud services**. Everything runs locally:

| Service | Status | Details |
|---|---|---|
| **Database** | Local MongoDB | `mongodb://127.0.0.1:27017/canteen` — requires MongoDB to be running locally |
| **Payment Gateway** | Simulated | The payment is a fake 700ms `setTimeout` delay — no real payment processing |
| **Email/SMS** | None | No notifications beyond in-app WebSocket events |
| **Cloud Hosting** | None | Designed for local development |
| **File Storage** | None | No image uploads or file storage |
| **Analytics** | None | No tracking or analytics |

---

## 15. Data Flow Walkthrough

### Complete Example: Student Orders a Dosa

Here's a step-by-step trace of a student ordering a freshly-prepared dosa:

#### 1. Student Browses Menu
```
Frontend: Menu.jsx → useEffect → api.get("/menu")
Backend:  menuRoutes.js → authMiddleware → menuController.getMenu()
          → MenuItem.find() → Returns all items
Frontend: setMenu(data) → Renders grid of food cards
```

#### 2. Student Adds Dosa to Cart
```
Frontend: Menu.jsx → quickAdd(dosaItem)
          → CartContext.addItem({ _id, name: "Dosa", price: 40, preparationType: "prepared" }, 1)
          → Cart state updated → localStorage.setItem("cart", JSON.stringify(items))
          → "Added Dosa to cart" notice shown for 1.2s
```

#### 3. Student Proceeds to Payment
```
Frontend: Cart.jsx → Shows: Dosa × 1, Subtotal: ₹40, Total: ₹40
          → "Proceed to Payment" → navigate("/payment")
```

#### 4. Student Pays (Simulated)
```
Frontend: Payment.jsx → payNow()
          → 700ms fake delay (setTimeout)
          → api.post("/orders", { items: [{ menuItem: "abc123", quantity: 1 }] })

Backend:  orderRoutes.js → authMiddleware → roleMiddleware("student") → orderController.placeOrder()
          → MenuItem.findById("abc123") → confirms it's "prepared" type
          → Order.find({ status: { $in: ["pending", "preparing"] }, "items.menuItem": "abc123" })
            → Finds 3 pending dosas from other orders
          → totalPendingQuantity = 3 + 1 (current) = 4
          → batchCapacity = 4, prepTimePerBatch = 5 min
          → totalBatches = ceil(4/4) = 1
          → waitTimeMs = 1 × 5 × 60 × 1000 = 300000ms (5 min)
          → estimatedReadyTime = now + 5 minutes
          → Order.create({ student, items, totalAmount: 40, status: "pending", estimatedReadyTime })
          → Order.findById().populate("student").populate("items.menuItem")
          → emitToRoom("admin-room", "order:new", { orderId, student, items, ... })
          → res.status(201).json(populatedOrder)

Frontend: → clear() → empties cart
          → navigate("/orders") after 500ms delay
```

#### 5. Admin Sees the Order (Real-Time)
```
Server:   socketManager → io.to("admin-room").emit("order:new", orderData)

Frontend (Admin): AdminPendingOrders.jsx → socket.on("order:new", handler)
          → If status === "pending", prepend to orders list
          → Highlight new order for 3 seconds (light red background)
          → Admin sees: "Student: 1RV21CS001, Total: ₹40, Items: Dosa × 1"
```

#### 6. Admin Marks as Preparing
```
Frontend (Admin): → Click "⏳ Mark as Preparing"
          → api.put("/orders/ORDER_ID/status", { status: "preparing" })

Backend:  → authMiddleware → roleMiddleware("admin") → orderController.updateOrderStatus()
          → Order.findById(ORDER_ID) → current status: "pending"
          → statusHierarchy: pending(1) → preparing(2) → ALLOWED (2 > 1)
          → Order.findByIdAndUpdate(ORDER_ID, { status: "preparing" })
          → emitToUser(studentId, "order:statusUpdated", { orderId, status: "preparing" })

Frontend (Student): MyOrders.jsx → socket.on("order:statusUpdated", handler)
          → Updates order status in state to "preparing"
          → Status badge changes from "PENDING" (grey) to "PREPARING" (yellow)
          → Countdown timer still ticking: "4 min 32 sec"
```

#### 7. Admin Marks as Ready
```
Frontend (Admin): → Click "✅ Mark as Ready"
          → api.put("/orders/ORDER_ID/status", { status: "ready" })

Backend:  → Same validation → preparing(2) → ready(3) → ALLOWED
          → emitToUser(studentId, "order:statusUpdated", { orderId, status: "ready" })

Frontend (Student): → socket handler fires
          → Status badge: "READY" (green)
          → Countdown: "0 min"
          → Blue notification banner: "One of your orders is ready for pickup."
          → Order card highlighted briefly, then fades after 4 seconds
```

---

## 16. Error Handling & Validation

### Backend Error Handling

| Layer | How Errors Are Handled |
|---|---|
| **Controllers** | Every controller wraps logic in `try/catch` blocks. Errors return JSON: `{ error: err.message }` with 500 status. |
| **Auth Middleware** | Missing/invalid token → `401 { message: "No token provided" }` or `401 { message: "Invalid token" }` |
| **Role Middleware** | Wrong role → `403 { message: "Access denied" }` |
| **Validation** | Missing fields → `400 { message: "..." }` (e.g., "Missing fields", "Invalid status", "Invalid or unavailable menu item") |
| **Order Status** | Backward transition → `400 { message: 'Cannot change order status from "ready" back to "preparing"...' }` |
| **Stock Check** | Insufficient stock → `400 { message: "Dosa is out of stock" }` |
| **DB Connection Failure** | Logs error and calls `process.exit(1)` — server crashes intentionally |

### Frontend Error Handling

| Layer | How Errors Are Handled |
|---|---|
| **Axios Interceptor** | 401 → clears localStorage, redirects to login page |
| **API Calls** | `catch(err)` → sets error state → displays error message in red text |
| **Form Validation** | Client-side checks: password length ≥ 6, passwords match, required fields |
| **Empty States** | "No orders yet", "Menu is currently unavailable", "Your cart is empty" |
| **Loading States** | "Loading menu...", "Loading orders...", "Processing..." during payment |
| **Socket Errors** | Logged to console; reconnection attempts (5 retries with 1s delay) |

### Validation Summary

| Field | Validation | Location |
|---|---|---|
| Password | Required | Backend |
| Role | Must be "admin" or "student" | Backend |
| Menu Item | Name and price required, valid preparationType | `menuController.js` |
| Order Status | Must be "pending", "preparing", or "ready" + no backward transitions | `orderController.js` |
| Stock | Cannot order more than available stock for instant items | `orderController.js` |
| JWT Token | Must be valid, not expired, properly formatted | `authMiddleware.js` |

---

## 17. Deployment Guide

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (v6+ recommended) running locally or on a cloud service
- **npm** or **yarn**

### Local Development Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd CanteenApp

# 2. Start MongoDB (in a separate terminal)
mongod

# 3. Setup and start the backend
cd server
npm install
npm run dev    # Uses nodemon for hot-reload

# 4. Setup and start the frontend (in a new terminal)
cd client
npm install
npm run dev    # Vite dev server at http://localhost:5173
```

### Production Deployment (Recommended)

| Component | Recommended Hosting | Notes |
|---|---|---|
| **Frontend** | Vercel, Netlify, or AWS S3 + CloudFront | Run `npm run build` in `/client`, deploy the `dist/` folder |
| **Backend** | Railway, Render, AWS EC2, or DigitalOcean | Deploy `/server` with `npm start`, set env variables |
| **Database** | MongoDB Atlas (free tier available) | Replace `MONGO_URI` with Atlas connection string |

### Production Checklist

- [ ] Set a strong, random `JWT_SECRET` (not `supersecretkey`)
- [ ] Configure CORS to allow only your frontend domain (not `"*"`)
- [ ] Update Socket.IO CORS `origin` to your frontend domain
- [ ] Update Axios `baseURL` to your production backend URL
- [ ] Update Socket.IO client `SOCKET_URL` to your production backend URL
- [ ] Fix Vite proxy in `vite.config.js` (points to port 5000, should be 5050 or removed for production)
- [ ] Use HTTPS in production
- [ ] Add rate limiting to auth endpoints (prevent brute force)
- [ ] Add helmet.js for security headers
- [ ] Use MongoDB Atlas with IP whitelisting
- [ ] Set up proper logging (Winston, Pino) instead of `console.log`

---

## 18. Possible Bugs, Security Risks & Improvements

### 🐛 Bugs

| Bug | Details | Fix |
|---|---|---|
| **Vite proxy port mismatch** | `vite.config.js` proxies to port 5000, but the server runs on port 5050. The proxy is unused since the frontend uses Axios with a hardcoded `baseURL`, but it's misleading. | Update proxy target to `http://localhost:5050`. |
| **Registration allows anyone to be admin** | Any user can select "admin" role during registration. There's no server-side restriction on who can register as admin. | Add admin registration restrictions (invite code, super-admin approval, or disable public admin registration). |
| **Cart ignores stock limits** | The cart allows adding unlimited quantities. Stock validation only happens at payment time — users may see an error after filling their cart. | Validate stock on add-to-cart and show warnings. |
| **No order completion state** | Orders go up to "ready" but are never marked "completed/collected". Ready orders accumulate forever. | Add a "collected" status and auto-archive old orders. |
| **Admin order pages fetch ALL orders** | `AdminPendingOrders`, `AdminPreparingOrders`, and `AdminReadyOrders` each call `GET /orders` (fetching ALL orders) and filter client-side. This is inefficient. | Add query params: `GET /orders?status=pending` and filter server-side. |
| **Socket reconnection doesn't rejoin rooms** | If the socket disconnects and reconnects, the `connect` handler re-joins. But if localStorage was cleared in the meantime, it won't rejoin. | Add a re-authentication flow on reconnect. |

### 🔒 Security Risks

| Risk | Severity | Details | Fix |
|---|---|---|---|
| **Weak JWT secret** | 🔴 High | `supersecretkey` is trivially guessable. | Use a 256-bit random string. |
| **Open CORS** | 🔴 High | `cors()` with no origin restriction allows any website to call your API. | `cors({ origin: "http://localhost:5173" })` |
| **Open Socket.IO CORS** | 🔴 High | `origin: "*"` in Socket.IO config. | Restrict to your frontend domain. |
| **No rate limiting** | 🟡 Medium | Login and register endpoints are vulnerable to brute-force attacks. | Use `express-rate-limit`. |
| **No input sanitization** | 🟡 Medium | User inputs (name, USN) are inserted directly into the database. NoSQL injection is partially mitigated by Mongoose, but XSS is possible if data is rendered as HTML. | Sanitize inputs with a library like `express-mongo-sanitize`. |
| **Password stored after registration, no email verification** | 🟡 Medium | Accounts can be created with any USN without verification. | Add email/USN verification flow. |
| **No HTTPS enforcement** | 🟡 Medium | JWTs are sent over HTTP in development. | Use HTTPS in production. |
| **localStorage for auth** | 🟢 Low | Tokens in localStorage are vulnerable to XSS attacks. | Consider httpOnly cookies with a CSRF token for production. |

### 💡 Improvements

| Improvement | Priority | Description |
|---|---|---|
| **Server-side order filtering** | High | Add `?status=pending` query param to `/api/orders` to avoid fetching all orders for each admin page. |
| **Image uploads for menu items** | Medium | Add image support with Cloudinary or S3 — show food photos on menu cards. |
| **Real payment integration** | Medium | Integrate Razorpay, Stripe, or UPI for actual payments. |
| **Order history & "collected" status** | Medium | Add a final status so ready orders can be marked collected. Archive old orders. |
| **Search & filter on menu** | Low | Category filters (snacks, meals, drinks), search bar. |
| **Admin stock management** | Medium | Allow admins to update stock quantities without deleting/re-creating items. The `updateMenuItem` endpoint exists but no UI for it. |
| **Push notifications** | Low | Use Web Push API or Service Workers for browser notifications when order is ready. |
| **Order cancellation** | Medium | Allow students to cancel pending orders (before they're being prepared). |
| **Pagination** | Medium | Paginate orders lists for better performance with many orders. |
| **Unit & integration tests** | Medium | Add Jest/Vitest tests for controllers, middleware, and React components. |
| **TypeScript migration** | Low | Add type safety across the codebase. |
| **Dark mode** | Low | CSS variables already support theming — add a dark mode toggle. |
| **Mobile responsiveness** | Medium | Some pages (like the Landing page grid) have basic responsive support, but admin pages need more work. |

---

## 19. Getting Started (Local Setup)

### Prerequisites

1. **Node.js** — v18 or above ([download](https://nodejs.org))
2. **MongoDB** — v6 or above ([download](https://www.mongodb.com/try/download/community))

### Step-by-Step Setup

```bash
# 1. Start MongoDB (keep this terminal running)
mongod

# 2. In a new terminal: Start the backend
cd server
npm install
npm run dev
# ✅ You should see:
#   🚀 Server running on port 5050
#   MongoDB connected
#   ✅ Socket.IO server initialized

# 3. In another new terminal: Start the frontend
cd client
npm install
npm run dev
# ✅ You should see:
#   VITE v7.x.x  ready in xxx ms
#   ➜ Local: http://localhost:5173/
```

### Quick Test

1. Open `http://localhost:5173` in your browser.
2. Click **"Get Started"** → Register as a **Student** with a USN (e.g., `1RV21CS001`).
3. Login with your credentials → You'll land on the **Menu** page.
4. In another browser/incognito tab, register as an **Admin** (username: `admin1`).
5. Login as admin → You'll see the **Admin Orders** dashboard.
6. As a student: add items to cart → proceed to payment → pay.
7. Watch the order appear instantly on the admin's dashboard! 🎉

---

## 📄 License

ISC

---

<p align="center">
  Built with ❤️ for modern campuses<br/>
  <strong>My Canteen</strong> — Skip the Queue. Order Smart. Eat Faster.
</p>
