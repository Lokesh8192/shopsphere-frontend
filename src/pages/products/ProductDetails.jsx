import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { apiRequest } from "../../api/api";

import "../../styles/product-details.css";


function ProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] =
        useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =========================================================
       LOAD PRODUCT
    ========================================================= */

    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            setError("");

            try {
                const result =
                    await apiRequest(
                        `/api/v1/products/${productId}`
                    );

                if (!result.ok) {
                    setError(
                        result.data?.detail ||
                        result.data?.message ||
                        "Unable to load product."
                    );

                    return;
                }

                const productData =
                    result.data?.data ??
                    result.data;

                setProduct(productData);

            } catch (err) {
                console.error(
                    "Product loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Something went wrong while loading the product."
                );
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [productId]);


    /* =========================================================
       QUANTITY
    ========================================================= */

    function increaseQuantity() {
        if (!product) {
            return;
        }

        if (
            quantity <
            Number(product.stock_quantity || 0)
        ) {
            setQuantity(
                (current) =>
                    current + 1
            );
        }
    }


    function decreaseQuantity() {
        setQuantity(
            (current) =>
                Math.max(
                    1,
                    current - 1
                )
        );
    }


    /* =========================================================
       ADD TO CART
    ========================================================= */

    async function handleAddToCart() {
        if (!product) {
            return;
        }

        setAddingToCart(true);
        setMessage("");
        setError("");

        try {
            const result =
                await apiRequest(
                    "/api/v1/cart/items",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            product_id:
                                product.id,
                            quantity,
                        }),
                    }
                );


            if (!result.ok) {

                if (
                    result.status ===
                    401
                ) {
                    navigate("/login");
                    return;
                }

                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to add product to cart."
                );

                return;
            }


            setMessage(
                "Product added to cart successfully."
            );

        } catch (err) {

            console.error(
                "Add to cart error:",
                err
            );

            setError(
                err.message ||
                "Something went wrong while adding the product to cart."
            );

        } finally {
            setAddingToCart(false);
        }
    }


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <main className="product-details-page">

                <div className="product-details-container">

                    <div className="product-details-loading">

                        <div className="product-details-spinner" />

                        <h2>
                            Loading product
                        </h2>

                        <p>
                            Please wait while we load
                            the product details.
                        </p>

                    </div>

                </div>

            </main>
        );
    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error && !product) {
        return (
            <main className="product-details-page">

                <div className="product-details-container">

                    <div className="product-details-error">

                        <div className="product-error-icon">
                            !
                        </div>

                        <h2>
                            Product unavailable
                        </h2>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/products"
                            className="primary-button"
                        >
                            ← Back to Products
                        </Link>

                    </div>

                </div>

            </main>
        );
    }


    if (!product) {
        return null;
    }


    /* =========================================================
       PRODUCT DATA
    ========================================================= */

    const stockQuantity =
        Number(
            product.stock_quantity || 0
        );

    const stockAvailable =
        stockQuantity > 0;

    const totalPrice =
        Number(product.price || 0) *
        quantity;

    const productName =
        product.name || "Product";


    const formattedPrice =
        Number(
            product.price || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );


    const formattedTotal =
        totalPrice.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );


    let stockLabel = "Out of stock";

    if (stockQuantity > 5) {
        stockLabel =
            `${stockQuantity} units available`;
    } else if (stockQuantity > 0) {
        stockLabel =
            `Only ${stockQuantity} left`;
    }


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <main className="product-details-page">

            <div className="product-details-container">

                {/* =================================================
                    BREADCRUMB
                ================================================= */}

                <nav
                    className="product-breadcrumb"
                    aria-label="Breadcrumb"
                >
                    <Link to="/">
                        Home
                    </Link>

                    <span>
                        /
                    </span>

                    <Link to="/products">
                        Products
                    </Link>

                    <span>
                        /
                    </span>

                    <span className="breadcrumb-current">
                        {productName}
                    </span>
                </nav>


                {/* =================================================
                    PRODUCT MAIN CARD
                ================================================= */}

                <section className="product-details-card">

                    {/* =================================================
                        PRODUCT VISUAL
                    ================================================= */}

                    <div className="product-image-section">

                        <div className="product-main-image">

                            <span className="product-image-label">
                                SHOPSPHERE
                            </span>


                            <div className="product-main-icon">
                                🛍️
                            </div>


                            <strong>
                                {productName
                                    .charAt(0)
                                    .toUpperCase()}
                            </strong>


                            <small>
                                Premium Product
                            </small>

                        </div>

                    </div>


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="product-info-section">

                        {/* CATEGORY */}

                        <span className="product-category-badge">
                            {product.category_name ||
                                product.category?.name ||
                                (product.category_id
                                    ? `Category ${product.category_id}`
                                    : "ShopSphere Product")}
                        </span>


                        {/* TITLE */}

                        <h1>
                            {productName}
                        </h1>


                        {/* SKU */}

                        {product.sku && (
                            <div className="product-sku-line">
                                SKU:{" "}
                                <strong>
                                    {product.sku}
                                </strong>
                            </div>
                        )}


                        {/* RATING */}

                        <div className="product-rating-row">

                            <span className="rating-stars">
                                ★★★★★
                            </span>

                            <span className="rating-text">
                                ShopSphere product
                            </span>

                        </div>


                        {/* PRICE */}

                        <div className="product-price">
                            ₹{formattedPrice}
                        </div>


                        {/* DESCRIPTION */}

                        <p className="product-description">
                            {product.description ||
                                "This product is currently available at ShopSphere. Add it to your cart and continue shopping."}
                        </p>


                        {/* PRODUCT META */}

                        <div className="product-meta">

                            <div className="meta-item">

                                <span>
                                    Availability
                                </span>

                                <strong
                                    className={
                                        stockAvailable
                                            ? "in-stock"
                                            : "out-of-stock"
                                    }
                                >
                                    {stockLabel}
                                </strong>

                            </div>


                            <div className="meta-item">

                                <span>
                                    Product ID
                                </span>

                                <strong>
                                    #{product.id}
                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            QUANTITY
                        ================================================= */}

                        {stockAvailable && (

                            <div className="quantity-section">

                                <div>
                                    <span className="quantity-label">
                                        Quantity
                                    </span>

                                    <small className="quantity-hint">
                                        Maximum {stockQuantity}
                                    </small>
                                </div>


                                <div className="quantity-control">

                                    <button
                                        type="button"
                                        onClick={
                                            decreaseQuantity
                                        }
                                        disabled={
                                            quantity <= 1
                                        }
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>


                                    <span>
                                        {quantity}
                                    </span>


                                    <button
                                        type="button"
                                        onClick={
                                            increaseQuantity
                                        }
                                        disabled={
                                            quantity >=
                                            stockQuantity
                                        }
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            TOTAL
                        ================================================= */}

                        <div className="product-total">

                            <span>
                                Order Total
                            </span>

                            <strong>
                                ₹{formattedTotal}
                            </strong>

                        </div>


                        {/* =================================================
                            SUCCESS / ERROR
                        ================================================= */}

                        {message && (
                            <div
                                className="success-message"
                                role="status"
                            >
                                <span>
                                    ✓
                                </span>

                                <p>
                                    {message}
                                </p>

                            </div>
                        )}


                        {error && (
                            <div
                                className="error-message"
                                role="alert"
                            >
                                <span>
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>
                        )}


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="product-actions">

                            <button
                                type="button"
                                className="add-to-cart-button"
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    !stockAvailable ||
                                    addingToCart
                                }
                            >
                                <span>
                                    {addingToCart
                                        ? "Adding to Cart..."
                                        : stockAvailable
                                            ? "Add to Cart"
                                            : "Out of Stock"}
                                </span>
                            </button>


                            <Link
                                to="/products"
                                className="continue-shopping-button"
                            >
                                ← Continue Shopping
                            </Link>

                        </div>


                        {/* VIEW CART AFTER SUCCESS */}

                        {message && (
                            <Link
                                to="/cart"
                                className="view-cart-link"
                            >
                                View Cart →
                            </Link>
                        )}

                    </div>

                </section>


                {/* =================================================
                    SHOPPING BENEFITS
                ================================================= */}

                <section className="product-benefits">

                    <div className="benefit-card">

                        <span className="benefit-icon">
                            🔒
                        </span>

                        <div>

                            <strong>
                                Secure Checkout
                            </strong>

                            <p>
                                Your order is processed
                                through secure ShopSphere
                                authentication.
                            </p>

                        </div>

                    </div>


                    <div className="benefit-card">

                        <span className="benefit-icon">
                            ✓
                        </span>

                        <div>

                            <strong>
                                Quality Products
                            </strong>

                            <p>
                                Browse products managed
                                through the ShopSphere store.
                            </p>

                        </div>

                    </div>


                    <div className="benefit-card">

                        <span className="benefit-icon">
                            🚚
                        </span>

                        <div>

                            <strong>
                                Easy Shopping
                            </strong>

                            <p>
                                Add products to your cart
                                and continue checkout easily.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}

export default ProductDetails;