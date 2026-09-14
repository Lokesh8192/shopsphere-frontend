import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/api";
import "../../styles/admin-products.css";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    sku: "",
    stock_quantity: "",
    category_id: "",
    is_active: true,
};

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        setError("");

        try {
            const result = await apiRequest("/api/v1/products");

            if (result.status === 401) {
                setError("Your session has expired. Please sign in again.");
                return;
            }

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to load products."
                );
                return;
            }

            const responseData = result.data;

            const data = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : Array.isArray(responseData?.products)
                        ? responseData.products
                        : [];

            setProducts(data);
        } catch (err) {
            console.error("Load products error:", err);
            setError("Unable to load products.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function openCreateForm() {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setSuccess("");
        setShowForm(true);
    }

    function openEditForm(product) {
        setEditingId(product.id);

        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            sku: product.sku || "",
            stock_quantity: product.stock_quantity ?? "",
            category_id: product.category_id ?? "",
            is_active: Boolean(product.is_active),
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            sku: form.sku.trim(),
            stock_quantity: Number(form.stock_quantity),
            category_id: Number(form.category_id),
            is_active: Boolean(form.is_active),
        };

        try {
            const endpoint = editingId
                ? `/api/v1/products/${editingId}`
                : "/api/v1/products";

            const method = editingId ? "PUT" : "POST";

            const result = await apiRequest(endpoint, {
                method,
                body: JSON.stringify(payload),
            });

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to save product."
                );
                return;
            }

            setSuccess(
                editingId
                    ? "Product updated successfully."
                    : "Product created successfully."
            );

            closeForm();

            await loadProducts();
        } catch (err) {
            console.error("Save product error:", err);

            setError(
                err.message ||
                "Something went wrong while saving the product."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(productId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(productId);
        setError("");
        setSuccess("");

        try {
            const result = await apiRequest(
                `/api/v1/products/${productId}`,
                {
                    method: "DELETE",
                }
            );

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to delete product."
                );
                return;
            }

            setSuccess("Product deleted successfully.");

            await loadProducts();
        } catch (err) {
            console.error("Delete product error:", err);
            setError("Something went wrong while deleting the product.");
        } finally {
            setDeletingId(null);
        }
    }

    function formatPrice(price) {
        return Number(price || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function getStockClass(stock) {
        return Number(stock) > 0
            ? "stock-available"
            : "stock-empty";
    }

    return (
        <main className="admin-products-page">
            <div className="admin-products-container">

                {/* ==========================================
                    BREADCRUMB
                ========================================== */}

                <div className="admin-products-breadcrumb">
                    <Link to="/admin">Admin</Link>
                    <span>/</span>
                    <span>Products</span>
                </div>

                {/* ==========================================
                    HEADER
                ========================================== */}

                <section className="admin-products-header">
                    <div>
                        <span className="admin-eyebrow">
                            CATALOG MANAGEMENT
                        </span>

                        <h1>Products</h1>

                        <p>
                            Create, update, and manage products in
                            your ShopSphere catalog.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-add-product-button"
                        onClick={openCreateForm}
                    >
                        + Add Product
                    </button>
                </section>

                {/* ==========================================
                    ALERTS
                ========================================== */}

                {error && (
                    <div className="admin-products-alert error">
                        <span>!</span>
                        <div>{error}</div>
                    </div>
                )}

                {success && (
                    <div className="admin-products-alert success">
                        <span>✓</span>
                        <div>{success}</div>
                    </div>
                )}

                {/* ==========================================
                    CONTENT
                ========================================== */}

                {loading ? (
                    <div className="admin-products-loading">
                        <div className="admin-loading-spinner" />

                        <h2>Loading products</h2>

                        <p>
                            Please wait while we load your catalog.
                        </p>
                    </div>
                ) : products.length === 0 ? (
                    <section className="admin-empty-products">
                        <div className="admin-empty-icon">
                            P
                        </div>

                        <span className="admin-eyebrow">
                            CATALOG
                        </span>

                        <h2>No products found</h2>

                        <p>
                            Start building your catalog by adding
                            your first product.
                        </p>

                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="admin-empty-button"
                        >
                            Add First Product
                        </button>
                    </section>
                ) : (
                    <section className="admin-product-table-card">
                        <div className="admin-product-table-header">
                            <div>
                                <span className="admin-eyebrow">
                                    CATALOG
                                </span>

                                <h2>
                                    Product Inventory
                                </h2>
                            </div>

                            <span className="admin-product-count">
                                {products.length}{" "}
                                {products.length === 1
                                    ? "product"
                                    : "products"}
                            </span>
                        </div>

                        <div className="admin-product-table-wrapper">
                            <table className="admin-product-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="admin-product-name-cell">
                                                    <div className="admin-product-avatar">
                                                        {product.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "P"}
                                                    </div>

                                                    <div className="admin-product-name-content">
                                                        <strong>
                                                            {product.name}
                                                        </strong>

                                                        <span>
                                                            ID: {product.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="admin-sku">
                                                    {product.sku || "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <strong className="admin-product-price">
                                                    ₹
                                                    {formatPrice(
                                                        product.price
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={getStockClass(
                                                        product.stock_quantity
                                                    )}
                                                >
                                                    {product.stock_quantity}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`product-status ${product.is_active
                                                            ? "active"
                                                            : "inactive"
                                                        }`}
                                                >
                                                    <span>
                                                        {product.is_active
                                                            ? "●"
                                                            : "●"}
                                                    </span>

                                                    {product.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-category-id">
                                                    #{product.category_id ?? "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-product-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditForm(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-action"
                                                        disabled={
                                                            deletingId ===
                                                            product.id
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        {deletingId ===
                                                            product.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* ==========================================
                    PRODUCT FORM
                ========================================== */}

                {showForm && (
                    <div
                        className="admin-modal-overlay"
                        onClick={closeForm}
                    >
                        <div
                            className="admin-product-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="admin-modal-header">
                                <div>
                                    <span className="admin-eyebrow">
                                        PRODUCT MANAGEMENT
                                    </span>

                                    <h2>
                                        {editingId
                                            ? "Edit Product"
                                            : "Add Product"}
                                    </h2>

                                    <p>
                                        {editingId
                                            ? "Update the selected product information."
                                            : "Add a new product to your catalog."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="admin-close-button"
                                    onClick={closeForm}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                className="admin-product-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="admin-form-grid">

                                    <div className="admin-form-group full">
                                        <label htmlFor="name">
                                            Product Name
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label htmlFor="sku">
                                            SKU
                                        </label>

                                        <input
                                            id="sku"
                                            type="text"
                                            name="sku"
                                            value={form.sku}
                                            onChange={handleChange}
                                            placeholder="SKU-001"
                                            required
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label htmlFor="price">
                                            Price
                                        </label>

                                        <div className="admin-input-prefix">
                                            <span>₹</span>

                                            <input
                                                id="price"
                                                type="number"
                                                name="price"
                                                value={form.price}
                                                onChange={handleChange}
                                                placeholder="999.99"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-form-group">
                                        <label htmlFor="stock_quantity">
                                            Stock Quantity
                                        </label>

                                        <input
                                            id="stock_quantity"
                                            type="number"
                                            name="stock_quantity"
                                            value={form.stock_quantity}
                                            onChange={handleChange}
                                            placeholder="100"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label htmlFor="category_id">
                                            Category ID
                                        </label>

                                        <input
                                            id="category_id"
                                            type="number"
                                            name="category_id"
                                            value={form.category_id}
                                            onChange={handleChange}
                                            placeholder="1"
                                            min="1"
                                            required
                                        />

                                        <small className="admin-field-help">
                                            Enter the ID of an existing
                                            category.
                                        </small>
                                    </div>

                                    <div className="admin-form-group full">
                                        <label htmlFor="description">
                                            Description
                                        </label>

                                        <textarea
                                            id="description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Describe the product..."
                                            rows="5"
                                        />
                                    </div>

                                    <div className="admin-form-group full">
                                        <label className="admin-checkbox">
                                            <input
                                                type="checkbox"
                                                name="is_active"
                                                checked={form.is_active}
                                                onChange={handleChange}
                                            />

                                            <span>
                                                Product is active and
                                                available in the store
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="admin-form-actions">
                                    <button
                                        type="button"
                                        className="admin-cancel-button"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="admin-save-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingId
                                                ? "Update Product"
                                                : "Create Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default AdminProducts;