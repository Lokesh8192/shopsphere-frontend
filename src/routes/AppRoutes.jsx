import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import Products from "../pages/products/Products";
import ProductDetails from "../pages/products/ProductDetails";
import Cart from "../pages/cart/Cart";
import Addresses from "../pages/address/Addresses";
import Orders from "../pages/orders/Orders";
import OrderDetails from "../pages/orders/OrderDetails";
import AdminRoute from "../components/common/AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminOrders from "../pages/admin/AdminOrders";


function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={
                    <Home />
                }
            />

            <Route
                path="/login"
                element={
                    <Login />
                }
            />

            <Route
                path="/register"
                element={
                    <Register />
                }
            />
            <Route
                path="/products"
                element={<Products />}
            />
            <Route
                path="/products/:productId"
                element={
                    <ProtectedRoute>
                        <ProductDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/cart"
                element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/address"
                element={
                    <ProtectedRoute>
                        <Addresses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/:orderId"
                element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                }
            />
            <Route element={<AdminRoute />}>
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />

                <Route
                    path="/admin/categories"
                    element={<AdminCategories />}
                />

                <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                />
            </Route>
            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}


export default AppRoutes;