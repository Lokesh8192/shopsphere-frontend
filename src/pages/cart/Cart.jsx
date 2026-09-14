import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/api";
import "../../styles/cart.css";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCart();
    }, []);

    async function loadCart() {
        setLoading(true);
        setError("");

        const result = await apiRequest("/api/v1/cart");

        if (result.status === 401) {
            navigate("/login");
            return;
        }

        if (!result.ok) {
            setError(
                result.data?.detail ||
                result.data?.message ||
                "Unable to load your cart."
            );
            setLoading(false);
            return;
        }

        setCart(result.data?.data ?? result.data);
        setLoading(false);
    }

    async function updateQuantity(productId, quantity) {
        if (quantity < 1) return;

        setUpdatingId(productId);
        setError("");

        const result = await apiRequest(`/api/v1/cart/${productId}`, {
            method: "PUT",
            body: JSON.stringify({
                quantity,
            }),
        });

        if (!result.ok) {
            setError(
                result.data?.detail ||
                result.data?.message ||
                "Unable to update cart."
            );
            setUpdatingId(null);
            return;
        }

        setCart(result.data?.data ?? result.data);
        setUpdatingId(null);
    }

    async function removeItem(productId) {
        setRemovingId(productId);
        setError("");

        const result = await apiRequest(`/api/v1/cart/${productId}`, {
            method: "DELETE",
        });

        if (!result.ok) {
            setError(
                result.data?.detail ||
                result.data?.message ||
                "Unable to remove item."
            );
            setRemovingId(null);
            return;
        }

        setCart(result.data?.data ?? result.data);
        setRemovingId(null);
    }

    function getCartItems() {
        if (!cart) return [];

        if (Array.isArray(cart)) {
            return cart;
        }

        return (
            cart.items ||
            cart.cart_items ||
            cart.products ||
            []
        );
    }

    function getItemProduct(item) {
        return item.product || item;
    }

    function getItemProductId(item) {
        return (
            item.product_id ||
            item.product?.id ||
            item.id
        );
    }

    function getItemQuantity(item) {
        return Number(
            item.quantity ||
            item.cart_quantity ||
            1
        );
    }

    function getItemPrice(item) {
        const product = getItemProduct(item);

        return Number(
            item.unit_price ??
            item.price ??
            product.price ??
            0
        );
    }

    const items = getCartItems();

    const subtotal = items.reduce((total, item) => {
        return total + getItemPrice(item) * getItemQuantity(item);
    }, 0);

    const deliveryFee = items.length > 0 ? 0 : 0;
    const total = subtotal + deliveryFee;

    if (loading) {
        return (
            <main className="cart-page">
                <div className="cart-container">
                    <div className="cart-loading">
                        Loading your cart...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="cart-container">

                <div className="cart-header">
                    <div>
                        <span className="section-eyebrow">
                            SHOPPING BAG
                        </span>

                        <h1>Your Cart</h1>

                        <p>
                            Review your items before continuing to checkout.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="continue-shopping-link"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {error && (
                    <div className="cart-error">
                        {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <section className="empty-cart">
                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <h2>Your cart is empty</h2>

                        <p>
                            Looks like you haven't added anything to your
                            cart yet.
                        </p>

                        <Link
                            to="/products"
                            className="shop-products-button"
                        >
                            Start Shopping
                        </Link>
                    </section>
                ) : (
                    <div className="cart-layout">

                        <section className="cart-items-card">
                            <div className="cart-items-header">
                                <h2>
                                    Your Items
                                </h2>

                                <span>
                                    {items.length}{" "}
                                    {items.length === 1
                                        ? "item"
                                        : "items"}
                                </span>
                            </div>

                            <div className="cart-items-list">
                                {items.map((item) => {
                                    const product =
                                        getItemProduct(item);

                                    const productId =
                                        getItemProductId(item);

                                    const quantity =
                                        getItemQuantity(item);

                                    const price =
                                        getItemPrice(item);

                                    const itemTotal =
                                        price * quantity;

                                    return (
                                        <article
                                            className="cart-item"
                                            key={productId}
                                        >
                                            <Link
                                                to={`/products/${product.id}`}
                                                className="cart-product-image"
                                            >
                                                <span>
                                                    {product.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "P"}
                                                </span>
                                            </Link>

                                            <div className="cart-product-info">
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="cart-product-name"
                                                >
                                                    {product.name}
                                                </Link>

                                                {product.sku && (
                                                    <span className="cart-product-sku">
                                                        SKU: {product.sku}
                                                    </span>
                                                )}

                                                <span className="cart-unit-price">
                                                    ₹
                                                    {price.toLocaleString(
                                                        "en-IN"
                                                    )}{" "}
                                                    each
                                                </span>
                                            </div>

                                            <div className="cart-quantity">
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        productId ||
                                                        quantity <= 1
                                                    }
                                                    onClick={() =>
                                                        updateQuantity(
                                                            productId,
                                                            quantity - 1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        productId
                                                    }
                                                    onClick={() =>
                                                        updateQuantity(
                                                            productId,
                                                            quantity + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="cart-item-total">
                                                ₹
                                                {itemTotal.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className="remove-item-button"
                                                disabled={
                                                    removingId ===
                                                    productId
                                                }
                                                onClick={() =>
                                                    removeItem(
                                                        productId
                                                    )
                                                }
                                            >
                                                {removingId === productId
                                                    ? "Removing..."
                                                    : "Remove"}
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>

                        <aside className="order-summary-card">
                            <div className="summary-heading">
                                <span className="section-eyebrow">
                                    ORDER SUMMARY
                                </span>

                                <h2>Summary</h2>
                            </div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>Delivery</span>
                                <strong>
                                    {deliveryFee === 0
                                        ? "FREE"
                                        : `₹${deliveryFee}`}
                                </strong>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-total">
                                <span>Total</span>

                                <strong>
                                    ₹
                                    {total.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className="checkout-button"
                                onClick={() =>
                                    navigate("/address")
                                }
                            >
                                Proceed to Checkout
                            </button>

                            <div className="secure-checkout">
                                <span>🔒</span>

                                <div>
                                    <strong>
                                        Secure Checkout
                                    </strong>

                                    <p>
                                        Your order is processed securely.
                                    </p>
                                </div>
                            </div>
                        </aside>

                    </div>
                )}

            </div>
        </main>
    );
}

export default Cart;