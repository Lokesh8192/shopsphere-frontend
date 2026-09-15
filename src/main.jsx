import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// Global styles
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/products.css";
import "./styles/product-details.css";
import "./styles/cart.css";
import "./styles/address.css";
import "./styles/orders.css";
import "./styles/order-details.css";
import "./styles/admin.css";
import "./styles/admin-products.css";
import "./styles/admin-categories.css";
import "./styles/admin-orders.css";
import "./styles/auth.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);