import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import AdminMenu from "./pages/AdminMenu";
import AdminPendingOrders from "./pages/AdminPendingOrders";
import AdminPreparingOrders from "./pages/AdminPreparingOrders";
import AdminReadyOrders from "./pages/AdminReadyOrders";
import { AdminOnly, StudentOnly } from "./auth/ProtectionRoute";
import { CartProvider } from "./cart/CartContext";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";



function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/menu"
            element={
              <StudentOnly>
                <Menu />
              </StudentOnly>
            }
          />
          <Route
            path="/cart"
            element={
              <StudentOnly>
                <Cart />
              </StudentOnly>
            }
          />
          <Route
            path="/payment"
            element={
              <StudentOnly>
                <Payment />
              </StudentOnly>
            }
          />
          <Route
            path="/orders"
            element={
              <StudentOnly>
                <MyOrders />
              </StudentOnly>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminOnly>
                <AdminMenu />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/orders/pending"
            element={
              <AdminOnly>
                <AdminPendingOrders />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/orders/preparing"
            element={
              <AdminOnly>
                <AdminPreparingOrders />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/orders/ready"
            element={
              <AdminOnly>
                <AdminReadyOrders />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminOnly>
                <AdminOrders />
              </AdminOnly>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
