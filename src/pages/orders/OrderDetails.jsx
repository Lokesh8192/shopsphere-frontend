import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../api/api";
import "../../styles/order-details.css";

function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [cancelling, setCancelling] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    async function loadOrder() {
        setLoading(true);
        setError("");

        const result = await apiRequest(
            `/api/v1/orders/${orderId}`
        );

        if (result.status === 401) {
            navigate("/login");
            return;
        }

        if (!result.ok) {
            setError(
                result.data?.detail ||
                result.data?.message ||
                "Unable to load order."
            );
            setLoading(false);
            return;
        }

        const responseData = result.data;

        const orderData =
            responseData?.data &&
                !Array.isArray(responseData.data)
                ? responseData.data
                : responseData?.order || responseData;

        setOrder(orderData);

        await loadPayment();

        setLoading(false);
    }

    async function loadPayment() {
        setPaymentLoading(true);

        const result = await apiRequest(
            `/api/v1/payments/order/${orderId}`
        );

        if (result.ok) {
            const responseData = result.data;

            const paymentData =
                responseData?.data &&
                    !Array.isArray(responseData.data)
                    ? responseData.data
                    : responseData?.payment || responseData;

            setPayment(paymentData);
        } else if (result.status === 404) {
            setPayment(null);
        }

        setPaymentLoading(false);
    }

    async function handleCancelOrder() {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) {
            return;
        }

        setCancelling(true);
        setError("");

        const result = await apiRequest(
            `/api/v1/orders/${orderId}/cancel`,
            {
                method: "PATCH",
            }
        );

        if (!result.ok) {
            setError(
                result.data?.detail ||
                result.data?.message ||
                "Unable to cancel the order."
            );
            setCancelling(false);
            return;
        }

        const responseData = result.data;

        const updatedOrder =
            responseData?.data &&
                !Array.isArray(responseData.data)
                ? responseData.data
                : responseData?.order || responseData;

        setOrder(updatedOrder);
        setCancelling(false);

        await loadPayment();
    }

    function formatDate(dateValue) {
        if (!dateValue) return "—";

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

    function formatDateTime(dateValue) {
        if (!dateValue) return "—";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function getStatus(orderData) {
        return (
            orderData?.status ||
            orderData?.order_status ||
            "Pending"
        );
    }

    function getStatusClass(status) {
        const normalized = String(status)
            .toLowerCase()
            .replace(/\s+/g, "-");

        if (normalized.includes("delivered")) {
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

    function getItems(orderData) {
        if (Array.isArray(orderData?.items)) {
            return orderData.items;
        }

        if (Array.isArray(orderData?.order_items)) {
            return orderData.order_items;
        }

        return [];
    }

    function getItemProduct(item) {
        return item?.product || item;
    }

    function getItemPrice(item) {
        return Number(
            item?.unit_price ??
            item?.price ??
            item?.product?.price ??
            0
        );
    }

    function getItemQuantity(item) {
        return Number(item?.quantity || 1);
    }

    function getProductName(item) {
        const product = getItemProduct(item);

        return (
            item?.product_name ||
            product?.name ||
            "Product"
        );
    }

    function getTotal(orderData) {
        return Number(
            orderData?.total_amount ??
            orderData?.total_price ??
            orderData?.grand_total ??
            orderData?.amount ??
            0
        );
    }

    function getSubtotal(orderData, items) {
        if (orderData?.subtotal != null) {
            return Number(orderData.subtotal);
        }

        return items.reduce(
            (total, item) =>
                total +
                getItemPrice(item) *
                getItemQuantity(item),
            0
        );
    }

    function getAddress(orderData) {
        if (orderData?.shipping_address) {
            return orderData.shipping_address;
        }

        if (orderData?.address) {
            return orderData.address;
        }

        if (orderData?.shippingAddress) {
            return orderData.shippingAddress;
        }

        // Support flat shipping-address fields
        if (
            orderData?.shipping_full_name ||
            orderData?.shipping_address_lane ||
            orderData?.shipping_city ||
            orderData?.shipping_state ||
            orderData?.shipping_postal_code
        ) {
            return {
                full_name: orderData.shipping_full_name,
                phone_number: orderData.shipping_phone_number,
                address_lane: orderData.shipping_address_lane,
                city: orderData.shipping_city,
                state: orderData.shipping_state,
                postal_code: orderData.shipping_postal_code,
                country: orderData.shipping_country,
            };
        }

        return null;
    }

    function getPaymentStatus() {
        if (!payment) {
            return "Not Available";
        }

        return (
            payment.payment_status ||
            payment.status ||
            "Pending"
        );
    }

    function getPaymentMethod() {
        if (!payment) {
            return "—";
        }

        return (
            payment.payment_method ||
            payment.method ||
            "—"
        );
    }

    const status = getStatus(order);
    const items = getItems(order);
    const address = getAddress(order);

    const subtotal = getSubtotal(order, items);
    const total = getTotal(order);

    const deliveryFee =
        order?.delivery_fee != null
            ? Number(order.delivery_fee)
            : Math.max(total - subtotal, 0);

    const normalizedStatus = String(status).toLowerCase();

    const canCancel =
        normalizedStatus.includes("pending") ||
        normalizedStatus === "created";

    if (loading) {
        return (
            <main className="order-details-page">
                <div className="order-details-container">
                    <div className="order-details-loading">
                        Loading order details...
                    </div>
                </div>
            </main>
        );
    }

    if (error && !order) {
        return (
            <main className="order-details-page">
                <div className="order-details-container">
                    <div className="order-details-error">
                        <h2>Order unavailable</h2>
                        <p>{error}</p>

                        <Link
                            to="/orders"
                            className="back-orders-button"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="order-details-page">
            <div className="order-details-container">

                <div className="order-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/orders">My Orders</Link>
                    <span>/</span>
                    <span>Order #{order.order_id}</span>
                </div>

                {error && (
                    <div className="order-details-error-banner">
                        {error}
                    </div>
                )}

                <section className="order-hero">

                    <div>
                        <span className="section-eyebrow">
                            ORDER DETAILS
                        </span>

                        <h1>
                            Order #{order.order_id}
                        </h1>

                        <p>
                            Placed on{" "}
                            {formatDateTime(
                                order.created_at
                            )}
                        </p>
                    </div>

                    <div className="order-hero-actions">
                        <span
                            className={`large-order-status ${getStatusClass(
                                status
                            )}`}
                        >
                            {status}
                        </span>

                        {canCancel && (
                            <button
                                type="button"
                                className="cancel-order-button"
                                disabled={cancelling}
                                onClick={handleCancelOrder}
                            >
                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel Order"}
                            </button>
                        )}
                    </div>

                </section>

                <section className="order-status-card">

                    <div className="status-card-header">
                        <div>
                            <span className="section-eyebrow">
                                ORDER PROGRESS
                            </span>

                            <h2>
                                Track Your Order
                            </h2>
                        </div>

                        <span className="current-status">
                            {status}
                        </span>
                    </div>

                    <div className="status-timeline">

                        <div
                            className={`status-step ${[
                                "pending",
                                "confirmed",
                                "processing",
                                "shipped",
                                "delivered",
                            ].includes(
                                normalizedStatus
                            ) ||
                                normalizedStatus.includes(
                                    "process"
                                ) ||
                                normalizedStatus.includes(
                                    "ship"
                                ) ||
                                normalizedStatus.includes(
                                    "deliver"
                                )
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="status-dot">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Order Placed
                                </strong>

                                <span>
                                    Your order has been
                                    received.
                                </span>
                            </div>
                        </div>

                        <div
                            className={`status-step ${normalizedStatus.includes(
                                "process"
                            ) ||
                                normalizedStatus.includes(
                                    "ship"
                                ) ||
                                normalizedStatus.includes(
                                    "deliver"
                                )
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="status-dot">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Processing
                                </strong>

                                <span>
                                    Your order is being
                                    prepared.
                                </span>
                            </div>
                        </div>

                        <div
                            className={`status-step ${normalizedStatus.includes(
                                "ship"
                            ) ||
                                normalizedStatus.includes(
                                    "deliver"
                                )
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="status-dot">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Shipped
                                </strong>

                                <span>
                                    Your package is on
                                    its way.
                                </span>
                            </div>
                        </div>

                        <div
                            className={`status-step ${normalizedStatus.includes(
                                "deliver"
                            )
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="status-dot">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Delivered
                                </strong>

                                <span>
                                    Package delivered
                                    successfully.
                                </span>
                            </div>
                        </div>

                    </div>
                </section>

                <div className="order-content-grid">

                    <div className="order-main-column">

                        <section className="order-items-card">

                            <div className="card-heading">
                                <div>
                                    <span className="section-eyebrow">
                                        PURCHASE
                                    </span>

                                    <h2>
                                        Order Items
                                    </h2>
                                </div>

                                <span className="item-count">
                                    {items.length}{" "}
                                    {items.length === 1
                                        ? "item"
                                        : "items"}
                                </span>
                            </div>

                            {items.length === 0 ? (
                                <div className="no-order-items">
                                    No item information available.
                                </div>
                            ) : (
                                <div className="order-items-list">
                                    {items.map(
                                        (item, index) => {
                                            const price =
                                                getItemPrice(
                                                    item
                                                );

                                            const quantity =
                                                getItemQuantity(
                                                    item
                                                );

                                            const itemTotal =
                                                price *
                                                quantity;

                                            const product =
                                                getItemProduct(
                                                    item
                                                );

                                            return (
                                                <article
                                                    className="order-item"
                                                    key={
                                                        item.order_item_id ||
                                                        item.id ||
                                                        index
                                                    }
                                                >
                                                    <div className="order-item-image">
                                                        <span>
                                                            {getProductName(
                                                                item
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <div className="order-item-info">
                                                        <h3>{getProductName(item)}</h3>

                                                        {(item.sku || product.sku) && (
                                                            <span>
                                                                SKU: {item.sku || product.sku}
                                                            </span>
                                                        )}

                                                        <p>
                                                            ₹{price.toLocaleString("en-IN")} × {quantity}
                                                        </p>
                                                    </div>

                                                    <div className="order-item-price">
                                                        ₹
                                                        {itemTotal.toLocaleString("en-IN", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </div>
                                                </article>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </section>

                        <section className="shipping-card">

                            <div className="card-heading">
                                <div>
                                    <span className="section-eyebrow">
                                        DELIVERY
                                    </span>

                                    <h2>
                                        Shipping Address
                                    </h2>
                                </div>
                            </div>

                            {address ? (
                                <div className="shipping-address">

                                    <div className="shipping-icon">
                                        📍
                                    </div>

                                    <div>
                                        <h3>
                                            {address.full_name ||
                                                "Delivery Address"}
                                        </h3>

                                        {address.phone_number && (
                                            <p>
                                                {
                                                    address.phone_number
                                                }
                                            </p>
                                        )}

                                        {address.address_lane && (
                                            <p>
                                                {
                                                    address.address_lane
                                                }
                                            </p>
                                        )}

                                        <p>
                                            {address.city &&
                                                `${address.city}, `}
                                            {address.state &&
                                                `${address.state} `}
                                            {address.postal_code}
                                        </p>

                                        {address.country && (
                                            <p>
                                                {
                                                    address.country
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="no-address-info">
                                    Shipping address information is
                                    not available.
                                </div>
                            )}
                        </section>

                    </div>

                    <aside className="order-sidebar">

                        <section className="summary-card">

                            <span className="section-eyebrow">
                                PAYMENT
                            </span>

                            <h2>
                                Payment Details
                            </h2>

                            {paymentLoading ? (
                                <p className="payment-loading">
                                    Loading payment information...
                                </p>
                            ) : (
                                <>
                                    <div className="payment-row">
                                        <span>
                                            Payment ID
                                        </span>

                                        <strong>
                                            {payment?.payment_id ||
                                                "—"}
                                        </strong>
                                    </div>

                                    <div className="payment-row">
                                        <span>
                                            Method
                                        </span>

                                        <strong>
                                            {getPaymentMethod()}
                                        </strong>
                                    </div>

                                    <div className="payment-row">
                                        <span>
                                            Status
                                        </span>

                                        <strong
                                            className={`payment-status ${getStatusClass(
                                                getPaymentStatus()
                                            )}`}
                                        >
                                            {getPaymentStatus()}
                                        </strong>
                                    </div>
                                </>
                            )}

                        </section>

                        <section className="summary-card">

                            <span className="section-eyebrow">
                                ORDER TOTAL
                            </span>

                            <h2>
                                Price Summary
                            </h2>

                            <div className="price-row">
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="price-row">
                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    {deliveryFee === 0
                                        ? "FREE"
                                        : `₹${deliveryFee.toLocaleString(
                                            "en-IN"
                                        )}`}
                                </strong>
                            </div>

                            <div className="price-divider" />

                            <div className="grand-total-row">
                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {total.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                        </section>

                        <Link
                            to="/orders"
                            className="back-to-orders-link"
                        >
                            ← Back to My Orders
                        </Link>

                    </aside>
                </div>

            </div>
        </main>
    );
}

export default OrderDetails;