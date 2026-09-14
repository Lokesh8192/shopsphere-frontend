import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../../api/api";
import "../../styles/admin-orders.css";

const STATUS_OPTIONS = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        setError("");

        try {
            const result = await apiRequest("/api/v1/orders");

            if (result.status === 401) {
                setError(
                    "Your session has expired. Please sign in again."
                );
                return;
            }

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                        result.data?.message ||
                        "Unable to load orders."
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
            setError("Unable to load orders.");
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(orderId, status) {
        setUpdatingId(orderId);
        setError("");
        setSuccess("");

        try {
            const result = await apiRequest(
                `/api/v1/orders/${orderId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                        result.data?.message ||
                        "Unable to update order status."
                );
                return;
            }

            setSuccess(
                `Order #${orderId} status updated successfully.`
            );

            await loadOrders();
        } catch (err) {
            console.error("Update order status error:", err);

            setError(
                "Something went wrong while updating the order."
            );
        } finally {
            setUpdatingId(null);
        }
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

    function getStatusClass(status) {
        const normalized = String(status || "")
            .toLowerCase()
            .replace(/\s+/g, "-");

        if (normalized.includes("deliver")) {
            return "status-delivered";
        }

        if (
            normalized.includes("cancel") ||
            normalized.includes("fail")
        ) {
            return "status-cancelled";
        }

        if (normalized.includes("ship")) {
            return "status-shipped";
        }

        if (normalized.includes("process")) {
            return "status-processing";
        }

        if (normalized.includes("pending")) {
            return "status-pending";
        }

        return "status-default";
    }

    function getStatusIcon(status) {
        const normalized = String(status || "").toLowerCase();

        if (normalized.includes("deliver")) {
            return "✓";
        }

        if (
            normalized.includes("cancel") ||
            normalized.includes("fail")
        ) {
            return "×";
        }

        if (normalized.includes("ship")) {
            return "→";
        }

        if (
            normalized.includes("process") ||
            normalized.includes("pending")
        ) {
            return "◷";
        }

        return "•";
    }

    function getItems(order) {
        if (Array.isArray(order.items)) {
            return order.items;
        }

        if (Array.isArray(order.order_items)) {
            return order.order_items;
        }

        return [];
    }

    function getItemCount(order) {
        const items = getItems(order);

        if (items.length > 0) {
            return items.reduce(
                (total, item) =>
                    total + Number(item.quantity || 0),
                0
            );
        }

        return Number(order.item_count || 0);
    }

    function getTotal(order) {
        return Number(
            order.total_amount ??
                order.total_price ??
                order.grand_total ??
                order.amount ??
                0
        );
    }

    const pendingCount = orders.filter((order) =>
        String(
            order.status ||
                order.order_status ||
                ""
        )
            .toLowerCase()
            .includes("pending")
    ).length;

    const processingCount = orders.filter((order) =>
        String(
            order.status ||
                order.order_status ||
                ""
        )
            .toLowerCase()
            .includes("process")
    ).length;

    const shippedCount = orders.filter((order) =>
        String(
            order.status ||
                order.order_status ||
                ""
        )
            .toLowerCase()
            .includes("ship")
    ).length;

    const deliveredCount = orders.filter((order) =>
        String(
            order.status ||
                order.order_status ||
                ""
        )
            .toLowerCase()
            .includes("deliver")
    ).length;

    const cancelledCount = orders.filter((order) =>
        String(
            order.status ||
                order.order_status ||
                ""
        )
            .toLowerCase()
            .includes("cancel")
    ).length;

    const totalOrderValue = orders.reduce(
        (total, order) =>
            total + getTotal(order),
        0
    );

    return (
        <main className="admin-orders-page">
            <div className="admin-orders-container">

                {/* ==========================================
                    BREADCRUMB
                ========================================== */}

                <div className="admin-orders-breadcrumb">
                    <Link to="/admin">Admin</Link>
                    <span>/</span>
                    <span>Orders</span>
                </div>

                {/* ==========================================
                    HEADER
                ========================================== */}

                <section className="admin-orders-header">
                    <div>
                        <span className="admin-eyebrow">
                            ORDER MANAGEMENT · OPERATIONS
                        </span>

                        <h1>Orders</h1>

                        <p>
                            Review customer orders, monitor progress,
                            and update fulfillment status.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={loadOrders}
                        disabled={loading}
                    >
                        ↻ Refresh
                    </button>
                </section>

                {/* ==========================================
                    ALERTS
                ========================================== */}

                {error && (
                    <div className="admin-orders-alert error">
                        <span>!</span>
                        <div>{error}</div>
                    </div>
                )}

                {success && (
                    <div className="admin-orders-alert success">
                        <span>✓</span>
                        <div>{success}</div>
                    </div>
                )}

                {/* ==========================================
                    STATISTICS
                ========================================== */}

                <section className="admin-order-stats">
                    <div className="admin-order-stat">
                        <div className="admin-order-stat-icon">
                            O
                        </div>

                        <div>
                            <span>Total Orders</span>
                            <strong>{orders.length}</strong>
                            <p>All customer orders</p>
                        </div>
                    </div>

                    <div className="admin-order-stat">
                        <div className="admin-order-stat-icon">
                            P
                        </div>

                        <div>
                            <span>Pending</span>
                            <strong>{pendingCount}</strong>
                            <p>Awaiting action</p>
                        </div>
                    </div>

                    <div className="admin-order-stat">
                        <div className="admin-order-stat-icon">
                            W
                        </div>

                        <div>
                            <span>Processing</span>
                            <strong>{processingCount}</strong>
                            <p>Being prepared</p>
                        </div>
                    </div>

                    <div className="admin-order-stat">
                        <div className="admin-order-stat-icon">
                            S
                        </div>

                        <div>
                            <span>Shipped</span>
                            <strong>{shippedCount}</strong>
                            <p>In transit</p>
                        </div>
                    </div>

                    <div className="admin-order-stat">
                        <div className="admin-order-stat-icon">
                            D
                        </div>

                        <div>
                            <span>Delivered</span>
                            <strong>{deliveredCount}</strong>
                            <p>Completed orders</p>
                        </div>
                    </div>

                    <div className="admin-order-stat">
                        <div className="admin-order-stat-icon">
                            X
                        </div>

                        <div>
                            <span>Cancelled</span>
                            <strong>{cancelledCount}</strong>
                            <p>Cancelled orders</p>
                        </div>
                    </div>

                    <div className="admin-order-stat admin-order-stat-wide">
                        <div className="admin-order-stat-icon">
                            ₹
                        </div>

                        <div>
                            <span>Total Order Value</span>

                            <strong>
                                ₹
                                {totalOrderValue.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </strong>

                            <p>Combined order value</p>
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    ORDERS TABLE
                ========================================== */}

                {loading ? (
                    <div className="admin-orders-loading">
                        <div className="admin-orders-loading-spinner" />

                        <h2>Loading orders</h2>

                        <p>
                            Please wait while we load the order
                            queue.
                        </p>
                    </div>
                ) : orders.length === 0 ? (
                    <section className="admin-empty-orders">
                        <div className="admin-empty-order-icon">
                            O
                        </div>

                        <span className="admin-eyebrow">
                            STORE ORDERS
                        </span>

                        <h2>No orders found</h2>

                        <p>
                            Customer orders will appear here after
                            purchases are placed.
                        </p>
                    </section>
                ) : (
                    <section className="admin-orders-card">
                        <div className="admin-orders-card-header">
                            <div>
                                <span className="admin-eyebrow">
                                    STORE ORDERS
                                </span>

                                <h2>Order Queue</h2>

                                <p>
                                    Update the fulfillment status
                                    directly from this workspace.
                                </p>
                            </div>

                            <span className="admin-orders-count">
                                {orders.length}{" "}
                                {orders.length === 1
                                    ? "order"
                                    : "orders"}
                            </span>
                        </div>

                        <div className="admin-orders-table-wrapper">
                            <table className="admin-orders-table">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map((order) => {
                                        const orderId =
                                            order.order_id;

                                        const status =
                                            order.status ||
                                            order.order_status ||
                                            "PENDING";

                                        const itemCount =
                                            getItemCount(order);

                                        const total =
                                            getTotal(order);

                                        const isUpdating =
                                            updatingId === orderId;

                                        return (
                                            <tr key={orderId}>
                                                <td>
                                                    <div className="admin-order-number">
                                                        <div className="admin-order-icon">
                                                            O
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                Order #
                                                                {orderId}
                                                            </strong>

                                                            <span>
                                                                {order.user_id
                                                                    ? `User #${order.user_id}`
                                                                    : "Customer order"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="admin-order-date">
                                                        {formatDate(
                                                            order.created_at
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="admin-items-count">
                                                        {itemCount}
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong className="admin-order-total">
                                                        ₹
                                                        {total.toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`admin-order-status ${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        <span>
                                                            {getStatusIcon(
                                                                status
                                                            )}
                                                        </span>

                                                        {status}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="admin-status-control">
                                                        <select
                                                            className="admin-order-status-select"
                                                            value={status}
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onChange={(event) =>
                                                                updateOrderStatus(
                                                                    orderId,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            {STATUS_OPTIONS.map(
                                                                (
                                                                    option
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {
                                                                            option
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                        {isUpdating && (
                                                            <span className="status-saving">
                                                                Saving...
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <Link
                                                        to={`/orders/${orderId}`}
                                                        className="admin-view-order"
                                                    >
                                                        View →
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

export default AdminOrders;