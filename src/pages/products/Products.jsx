import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../../api/api";

import "../../styles/products.css";


function Products() {
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default");


    /* =========================================================
       LOAD PRODUCTS
    ========================================================= */

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await apiRequest(
                        "/api/v1/products"
                    );

                if (!response.ok) {
                    setError(
                        response.data?.message ||
                        response.data?.detail ||
                        "Failed to load products."
                    );

                    return;
                }

                const productData =
                    Array.isArray(
                        response.data?.data
                    )
                        ? response.data.data
                        : [];

                setProducts(productData);

            } catch (err) {
                console.error(
                    "Products loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Something went wrong while loading products."
                );
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);


    /* =========================================================
       SEARCH + SORT
    ========================================================= */

    const filteredProducts = useMemo(() => {
        let result = [...products];


        /* SEARCH */

        if (searchTerm.trim()) {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            result = result.filter(
                (product) => {
                    const name =
                        product.name
                            ?.toLowerCase() || "";

                    const description =
                        product.description
                            ?.toLowerCase() || "";

                    const sku =
                        product.sku
                            ?.toLowerCase() || "";

                    return (
                        name.includes(search) ||
                        description.includes(search) ||
                        sku.includes(search)
                    );
                }
            );
        }


        /* SORT */

        if (sortBy === "price-low") {
            result.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );
        }

        if (sortBy === "price-high") {
            result.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );
        }

        if (sortBy === "name") {
            result.sort(
                (a, b) =>
                    (a.name || "").localeCompare(
                        b.name || ""
                    )
            );
        }


        return result;

    }, [
        products,
        searchTerm,
        sortBy,
    ]);


    /* =========================================================
       CLEAR SEARCH
    ========================================================= */

    function clearSearch() {
        setSearchTerm("");
    }


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <main className="products-page">

                <div className="products-container">

                    <div className="products-loading">

                        <div className="products-loading-spinner" />

                        <h2>
                            Loading products
                        </h2>

                        <p>
                            Please wait while we load
                            the latest products.
                        </p>

                    </div>

                </div>

            </main>
        );
    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error) {
        return (
            <main className="products-page">

                <div className="products-container">

                    <div className="products-error">

                        <div className="products-error-icon">
                            !
                        </div>

                        <h2>
                            Unable to load products
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            </main>
        );
    }


    return (
        <main className="products-page">

            <div className="products-container">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <section className="products-hero">

                    <div className="products-hero-content">

                        <span className="products-eyebrow">
                            SHOPSPHERE STORE
                        </span>

                        <h1>
                            Discover products
                            <span>
                                made for you.
                            </span>
                        </h1>

                        <p>
                            Browse our collection, compare
                            products, and find exactly what
                            you're looking for.
                        </p>

                    </div>


                    <div className="products-hero-stats">

                        <div className="products-stat">
                            <strong>
                                {products.length}
                            </strong>

                            <span>
                                Products
                            </span>
                        </div>


                        <div className="products-stat">
                            <strong>
                                Secure
                            </strong>

                            <span>
                                Shopping
                            </span>
                        </div>

                    </div>

                </section>


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <section className="products-toolbar">

                    <div className="products-search">

                        <span className="products-search-icon">
                            ⌕
                        </span>

                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search products by name or SKU..."
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="products-search-clear"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}

                    </div>


                    <div className="products-toolbar-right">

                        <span className="products-result-count">
                            {filteredProducts.length}{" "}
                            {filteredProducts.length === 1
                                ? "product"
                                : "products"}
                        </span>


                        <select
                            className="products-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(
                                    event.target.value
                                )
                            }
                            aria-label="Sort products"
                        >
                            <option value="default">
                                Sort: Featured
                            </option>

                            <option value="name">
                                Sort: Name
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>
                        </select>

                    </div>

                </section>


                {/* =================================================
                    EMPTY PRODUCTS
                ================================================= */}

                {products.length === 0 && (
                    <div className="products-empty">

                        <div className="products-empty-icon">
                            🛍️
                        </div>

                        <h2>
                            No products available
                        </h2>

                        <p>
                            There are currently no products
                            available in the store.
                        </p>

                    </div>
                )}


                {/* =================================================
                    SEARCH EMPTY
                ================================================= */}

                {products.length > 0 &&
                    filteredProducts.length === 0 && (
                        <div className="products-empty">

                            <div className="products-empty-icon">
                                🔎
                            </div>

                            <h2>
                                No matching products
                            </h2>

                            <p>
                                We couldn't find anything
                                matching "{searchTerm}".
                            </p>

                            <button
                                type="button"
                                className="products-reset-button"
                                onClick={clearSearch}
                            >
                                Clear Search
                            </button>

                        </div>
                    )}


                {/* =================================================
                    PRODUCT GRID
                ================================================= */}

                {filteredProducts.length > 0 && (

                    <div className="product-grid">

                        {filteredProducts.map(
                            (product) => {

                                const stock =
                                    Number(
                                        product.stock_quantity || 0
                                    );

                                const price =
                                    Number(
                                        product.price || 0
                                    );

                                const isInStock =
                                    stock > 0;

                                const stockLabel =
                                    stock === 0
                                        ? "Out of Stock"
                                        : stock <= 5
                                            ? `Only ${stock} left`
                                            : "In Stock";


                                return (
                                    <article
                                        key={
                                            product.id
                                        }
                                        className="product-card"
                                    >

                                        {/* ==================================
                                            PRODUCT VISUAL
                                        ================================== */}

                                        <div className="product-image">

                                            <span className="product-image-badge">
                                                ShopSphere
                                            </span>

                                            <div className="product-placeholder-icon">
                                                🛍️
                                            </div>

                                            <span className="product-image-text">
                                                Product
                                            </span>

                                        </div>


                                        {/* ==================================
                                            PRODUCT CONTENT
                                        ================================== */}

                                        <div className="product-body">

                                            <div className="product-top-line">

                                                <span className="product-category">
                                                    {product.category?.name ||
                                                        "Product"}
                                                </span>


                                                {product.sku && (
                                                    <span className="product-sku">
                                                        SKU{" "}
                                                        {product.sku}
                                                    </span>
                                                )}

                                            </div>


                                            <h2 className="product-name">
                                                {product.name}
                                            </h2>


                                            <p className="product-description">
                                                {product.description ||
                                                    "Quality product from ShopSphere."}
                                            </p>


                                            {/* ==================================
                                                PRICE + STOCK
                                            ================================== */}

                                            <div className="product-meta">

                                                <span className="product-price">
                                                    ₹
                                                    {price.toFixed(
                                                        2
                                                    )}
                                                </span>


                                                <span
                                                    className={
                                                        isInStock
                                                            ? stock <= 5
                                                                ? "stock-low"
                                                                : "stock-available"
                                                            : "stock-unavailable"
                                                    }
                                                >
                                                    {stockLabel}
                                                </span>

                                            </div>


                                            {/* ==================================
                                                ACTION
                                            ================================== */}

                                            <div className="product-card-actions">

                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="product-details-button"
                                                >
                                                    View Details
                                                </Link>

                                            </div>

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

        </main>
    );
}


export default Products;