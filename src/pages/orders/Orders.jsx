import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/api";
import "../../styles/orders.css";

function Orders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrders() {
            setLoading(true);
            setError("");

            try {
                const result = await apiRequest("/api/v1/orders");

                if (result.status === 401) {
                    navigate("/login");
                    return;
                }

                if (!result.ok) {
                    setError(
                        result.data?.detail ||
                        result.data?.message ||
                        "Unable to load your orders."
                    );
                    return;
                }

                const responseData = result.data;

                const data = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : Array.isArray(responseData?.orders)
                            ? responseData.orders
                            : [];

                setOrders(data);
            } catch (err) {
                console.error("Load orders error:", err);
                setError("Unable to load your orders.");
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, [navigate]);

    function getStatusClass(status) {
        const normalized = String(status || "")
            .toLowerCase()
            .replace(/\s+/g, "-");

        if (
            normalized.includes("delivered") ||
            normalized.includes("success")
        ) {
            return "status-success";
        }

        if (
            normalized.includes("cancel") ||
            normalized.includes("fail")
        ) {
            return "status-danger";
        }

        if (
            normalized.includes("pending") ||
            normalized.includes("process")
        ) {
            return "status-warning";
        }

        if (normalized.includes("ship")) {
            return "status-info";
        }

        return "status-default";
    }

    function getStatusIcon(status) {
        const normalized = String(status || "").toLowerCase();

        if (normalized.includes("delivered")) {
            return "✓";
        }

        if (normalized.includes("cancel")) {
            return "×";
        }

        if (normalized.includes("ship")) {
            return "→";
        }

        if (
            normalized.includes("pending") ||
            normalized.includes("process")
        ) {
            return "◷";
        }

        return "•";
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function getOrderTotal(order) {
        return Number(
            order.total_amount ??
            order.total_price ??
            order.grand_total ??
            order.amount ??
            0
        );
    }

    function getItemCount(order) {
        if (Array.isArray(order.items)) {
            return order.items.reduce(
                (total, item) =>
                    total + Number(item.quantity || 0),
                0
            );
        }

        if (Array.isArray(order.order_items)) {
            return order.order_items.reduce(
                (total, item) =>
                    total + Number(item.quantity || 0),
                0
            );
        }

        return Number(
            order.item_count ??
            order.quantity ??
            0
        );
    }

    function getAddress(order) {
        return (
            order.shipping_address ||
            order.address ||
            order.shippingAddress ||
            null
        );
    }

    function getFirstProductName(order) {
        const items = Array.isArray(order.items)
            ? order.items
            : Array.isArray(order.order_items)
                ? order.order_items
                : [];

        if (items.length === 0) {
            return null;
        }

        const item = items[0];

        return (
            item?.product_name ||
            item?.product?.name ||
            item?.name ||
            null
        );
    }

    function getOrderSummary(order, itemCount) {
        const productName = getFirstProductName(order);

        if (!productName) {
            return `${itemCount} ${itemCount === 1 ? "item" : "items"
                } in this order`;
        }

        if (itemCount > 1) {
            return `${productName} + ${itemCount - 1
                } more ${itemCount - 1 === 1 ? "item" : "items"
                }`;
        }

        return productName;
    }

    if (loading) {
        return (
            <main className="orders-page">
                <div className="orders-container">
                    <div className="orders-loading">
                        <div className="orders-loading-spinner" />

                        <h2>Loading your orders</h2>

                        <p>
                            Please wait while we fetch your order
                            history.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="orders-page">
            <div className="orders-container">
                <div className="orders-header">
                    <div>
                        <span className="section-eyebrow">
                            ACCOUNT · ORDERS
                        </span>

                        <h1>My Orders</h1>

                        <p>
                            View your purchases, check delivery status,
                            and manage your recent orders.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="shop-more-button"
                    >
                        Continue Shopping →
                    </Link>
                </div>

                {error && (
                    <div className="orders-error">
                        <span>!</span>
                        <div>{error}</div>
                    </div>
                )}

                {orders.length === 0 ? (
                    <section className="empty-orders">
                        <div className="empty-orders-icon">
                            📦
                        </div>

                        <span className="section-eyebrow">
                            YOUR ORDER HISTORY
                        </span>

                        <h2>No orders yet</h2>

                        <p>
                            Once you complete a purchase, your orders
                            will appear here with their status and
                            details.
                        </p>

                        <Link
                            to="/products"
                            className="start-shopping-button"
                        >
                            Start Shopping
                        </Link>
                    </section>
                ) : (
                    <section className="orders-section">
                        <div className="orders-section-header">
                            <div>
                                <span className="section-eyebrow">
                                    ORDER HISTORY
                                </span>

                                <h2>
                                    {orders.length}{" "}
                                    {orders.length === 1
                                        ? "Order"
                                        : "Orders"}
                                </h2>
                            </div>

                            <span className="orders-section-note">
                                Most recent orders first
                            </span>
                        </div>

                        <div className="orders-list">
                            {orders.map((order) => {
                                const orderId = order.order_id;

                                const status =
                                    order.status ||
                                    order.order_status ||
                                    "Pending";

                                const total =
                                    getOrderTotal(order);

                                const itemCount =
                                    getItemCount(order);

                                const address =
                                    getAddress(order);

                                return (
                                    <article
                                        key={orderId}
                                        className="order-card"
                                    >
                                        <div className="order-card-top">
                                            <div className="order-card-identity">
                                                <div className="order-icon">
                                                    <span>📦</span>
                                                </div>

                                                <div>
                                                    <div className="order-title-row">
                                                        <h2>
                                                            Order #
                                                            {orderId}
                                                        </h2>

                                                        <span
                                                            className={`order-status ${getStatusClass(
                                                                status
                                                            )}`}
                                                        >
                                                            <span className="status-icon">
                                                                {getStatusIcon(
                                                                    status
                                                                )}
                                                            </span>

                                                            {status}
                                                        </span>
                                                    </div>

                                                    <p className="order-date">
                                                        Placed on{" "}
                                                        {formatDate(
                                                            order.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link
                                                to={`/orders/${orderId}`}
                                                className="view-order-button"
                                            >
                                                View Details
                                            </Link>
                                        </div>

                                        <div className="order-card-divider" />

                                        <div className="order-card-content">
                                            <div className="order-summary-block">
                                                <span className="order-label">
                                                    ITEMS
                                                </span>

                                                <strong>
                                                    {itemCount}{" "}
                                                    {itemCount === 1
                                                        ? "item"
                                                        : "items"}
                                                </strong>

                                                <p>
                                                    {getOrderSummary(
                                                        order,
                                                        itemCount
                                                    )}
                                                </p>
                                            </div>

                                            <div className="order-summary-block">
                                                <span className="order-label">
                                                    DELIVERY
                                                </span>

                                                <strong>
                                                    {address?.city
                                                        ? address.city
                                                        : "Standard Delivery"}
                                                </strong>

                                                <p>
                                                    {address?.state ||
                                                        "Delivery address"}
                                                </p>
                                            </div>

                                            <div className="order-summary-block order-total-block">
                                                <span className="order-label">
                                                    TOTAL
                                                </span>

                                                <strong>
                                                    ₹
                                                    {total.toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </strong>

                                                <p>
                                                    Order value
                                                </p>
                                            </div>
                                        </div>

                                        <div className="order-card-footer">
                                            <span>
                                                Order #{orderId}
                                            </span>

                                            <Link
                                                to={`/orders/${orderId}`}
                                                className="mobile-view-order"
                                            >
                                                Open Order →
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

export default Orders;