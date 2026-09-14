import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/api";
import "../../styles/admin-categories.css";

const emptyForm = {
    name: "",
    description: "",
};

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        setError("");

        try {
            const result = await apiRequest("/api/v1/categories");

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
                    "Unable to load categories."
                );
                return;
            }

            const responseData = result.data;

            const data = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : Array.isArray(responseData?.categories)
                        ? responseData.categories
                        : [];

            setCategories(data);
        } catch (err) {
            console.error("Load categories error:", err);
            setError("Unable to load categories.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function openCreateForm() {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setSuccess("");
        setShowForm(true);
    }

    function openEditForm(category) {
        setEditingId(
            category.id ??
            category.category_id
        );

        setForm({
            name: category.name || "",
            description: category.description || "",
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
        };

        try {
            const endpoint = editingId
                ? `/api/v1/categories/${editingId}`
                : "/api/v1/categories";

            const method = editingId ? "PUT" : "POST";

            const result = await apiRequest(endpoint, {
                method,
                body: JSON.stringify(payload),
            });

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to save category."
                );
                return;
            }

            setSuccess(
                editingId
                    ? "Category updated successfully."
                    : "Category created successfully."
            );

            closeForm();

            await loadCategories();
        } catch (err) {
            console.error("Save category error:", err);

            setError(
                err.message ||
                "Something went wrong while saving the category."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(categoryId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(categoryId);
        setError("");
        setSuccess("");

        try {
            const result = await apiRequest(
                `/api/v1/categories/${categoryId}`,
                {
                    method: "DELETE",
                }
            );

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to delete category."
                );
                return;
            }

            setSuccess("Category deleted successfully.");

            await loadCategories();
        } catch (err) {
            console.error("Delete category error:", err);
            setError("Something went wrong while deleting the category.");
        } finally {
            setDeletingId(null);
        }
    }

    function getCategoryId(category) {
        return category.id ?? category.category_id;
    }

    return (
        <main className="admin-categories-page">
            <div className="admin-categories-container">

                {/* ==========================================
                    BREADCRUMB
                ========================================== */}

                <div className="admin-categories-breadcrumb">
                    <Link to="/admin">Admin</Link>
                    <span>/</span>
                    <span>Categories</span>
                </div>

                {/* ==========================================
                    HEADER
                ========================================== */}

                <section className="admin-categories-header">
                    <div>
                        <span className="admin-eyebrow">
                            STORE ORGANIZATION
                        </span>

                        <h1>Categories</h1>

                        <p>
                            Organize your ShopSphere product catalog
                            into clear and meaningful categories.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-add-category-button"
                        onClick={openCreateForm}
                    >
                        + Add Category
                    </button>
                </section>

                {/* ==========================================
                    ALERTS
                ========================================== */}

                {error && (
                    <div className="admin-category-alert error">
                        <span>!</span>
                        <div>{error}</div>
                    </div>
                )}

                {success && (
                    <div className="admin-category-alert success">
                        <span>✓</span>
                        <div>{success}</div>
                    </div>
                )}

                {/* ==========================================
                    CONTENT
                ========================================== */}

                {loading ? (
                    <div className="admin-categories-loading">
                        <div className="admin-category-loading-spinner" />

                        <h2>Loading categories</h2>

                        <p>
                            Please wait while we load your catalog
                            structure.
                        </p>
                    </div>
                ) : categories.length === 0 ? (
                    <section className="admin-empty-categories">
                        <div className="admin-empty-category-icon">
                            C
                        </div>

                        <span className="admin-eyebrow">
                            CATALOG STRUCTURE
                        </span>

                        <h2>No categories found</h2>

                        <p>
                            Create your first category to organize
                            products in your ShopSphere catalog.
                        </p>

                        <button
                            type="button"
                            className="admin-empty-category-button"
                            onClick={openCreateForm}
                        >
                            Add First Category
                        </button>
                    </section>
                ) : (
                    <section className="admin-category-list-card">
                        <div className="admin-category-list-header">
                            <div>
                                <span className="admin-eyebrow">
                                    CATALOG STRUCTURE
                                </span>

                                <h2>
                                    Product Categories
                                </h2>
                            </div>

                            <span className="admin-category-count">
                                {categories.length}{" "}
                                {categories.length === 1
                                    ? "category"
                                    : "categories"}
                            </span>
                        </div>

                        <div className="admin-category-list">
                            {categories.map((category) => {
                                const categoryId =
                                    getCategoryId(category);

                                return (
                                    <article
                                        key={categoryId}
                                        className="admin-category-card"
                                    >
                                        <div className="category-icon">
                                            {category.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "C"}
                                        </div>

                                        <div className="category-info">
                                            <div className="category-title-row">
                                                <h3>
                                                    {category.name}
                                                </h3>

                                                <span className="category-id">
                                                    ID: {categoryId}
                                                </span>
                                            </div>

                                            <p>
                                                {category.description ||
                                                    "No description available."}
                                            </p>
                                        </div>

                                        <div className="category-actions">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditForm(
                                                        category
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="category-delete-button"
                                                disabled={
                                                    deletingId ===
                                                    categoryId
                                                }
                                                onClick={() =>
                                                    handleDelete(
                                                        categoryId
                                                    )
                                                }
                                            >
                                                {deletingId ===
                                                    categoryId
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ==========================================
                    CATEGORY MODAL
                ========================================== */}

                {showForm && (
                    <div
                        className="admin-category-modal-overlay"
                        onClick={closeForm}
                    >
                        <div
                            className="admin-category-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="admin-category-modal-header">
                                <div>
                                    <span className="admin-eyebrow">
                                        CATEGORY MANAGEMENT
                                    </span>

                                    <h2>
                                        {editingId
                                            ? "Edit Category"
                                            : "Add Category"}
                                    </h2>

                                    <p>
                                        {editingId
                                            ? "Update the selected category."
                                            : "Create a new product category."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="admin-category-close-button"
                                    onClick={closeForm}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                className="admin-category-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="admin-category-form-group">
                                    <label htmlFor="category-name">
                                        Category Name
                                    </label>

                                    <input
                                        id="category-name"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Example: Electronics"
                                        required
                                    />
                                </div>

                                <div className="admin-category-form-group">
                                    <label htmlFor="category-description">
                                        Description
                                    </label>

                                    <textarea
                                        id="category-description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe this product category..."
                                        rows="5"
                                    />
                                </div>

                                <div className="admin-category-form-actions">
                                    <button
                                        type="button"
                                        className="admin-category-cancel-button"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="admin-category-save-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingId
                                                ? "Update Category"
                                                : "Create Category"}
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

export default AdminCategories;