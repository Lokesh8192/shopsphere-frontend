import { Link } from "react-router-dom";
import "../../styles/admin.css";

function AdminDashboard() {
    return (
        <main className="admin-page">
            <div className="admin-container">

                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <section className="admin-welcome">
                    <div className="admin-welcome-content">
                        <span className="admin-eyebrow">
                            ADMINISTRATION · DASHBOARD
                        </span>

                        <h1>ShopSphere Admin</h1>

                        <p>
                            Manage your store operations from one
                            centralized workspace.
                        </p>
                    </div>

                    <div className="admin-profile">
                        <div className="admin-avatar">
                            A
                        </div>

                        <div>
                            <span>Account</span>
                            <strong>Administrator</strong>
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    MANAGEMENT OVERVIEW
                ========================================== */}

                <section className="admin-overview">
                    <article className="admin-stat-card">
                        <div className="admin-stat-icon">
                            P
                        </div>

                        <div className="admin-stat-content">
                            <span>Products</span>

                            <strong>Catalog</strong>

                            <p>
                                Manage products
                            </p>
                        </div>

                        <Link
                            to="/admin/products"
                            className="admin-stat-link"
                        >
                            Open →
                        </Link>
                    </article>

                    <article className="admin-stat-card">
                        <div className="admin-stat-icon">
                            C
                        </div>

                        <div className="admin-stat-content">
                            <span>Categories</span>

                            <strong>Organization</strong>

                            <p>
                                Manage categories
                            </p>
                        </div>

                        <Link
                            to="/admin/categories"
                            className="admin-stat-link"
                        >
                            Open →
                        </Link>
                    </article>

                    <article className="admin-stat-card">
                        <div className="admin-stat-icon">
                            O
                        </div>

                        <div className="admin-stat-content">
                            <span>Orders</span>

                            <strong>Processing</strong>

                            <p>
                                Review and update
                            </p>
                        </div>

                        <Link
                            to="/admin/orders"
                            className="admin-stat-link"
                        >
                            Open →
                        </Link>
                    </article>

                    <article className="admin-stat-card">
                        <div className="admin-stat-icon">
                            U
                        </div>

                        <div className="admin-stat-content">
                            <span>Users</span>

                            <strong>Protected</strong>

                            <p>
                                Role-based access
                            </p>
                        </div>

                        <div className="admin-access-badge">
                            Admin
                        </div>
                    </article>
                </section>

                {/* ==========================================
                    QUICK ACTIONS
                ========================================== */}

                <section className="admin-section">
                    <div className="admin-section-heading">
                        <div>
                            <span className="admin-eyebrow">
                                STORE MANAGEMENT
                            </span>

                            <h2>Quick Actions</h2>

                            <p>
                                Jump directly to the area you want
                                to manage.
                            </p>
                        </div>
                    </div>

                    <div className="admin-action-grid">
                        <Link
                            to="/admin/products"
                            className="admin-action-card"
                        >
                            <div className="action-icon">
                                P
                            </div>

                            <div className="admin-action-content">
                                <div className="admin-action-top">
                                    <span className="admin-action-label">
                                        CATALOG
                                    </span>
                                </div>

                                <h3>
                                    Products
                                </h3>

                                <p>
                                    Create, update, and manage
                                    products in your store catalog.
                                </p>

                                <span className="admin-action-link">
                                    Manage Products
                                    <span>→</span>
                                </span>
                            </div>
                        </Link>

                        <Link
                            to="/admin/categories"
                            className="admin-action-card"
                        >
                            <div className="action-icon">
                                C
                            </div>

                            <div className="admin-action-content">
                                <div className="admin-action-top">
                                    <span className="admin-action-label">
                                        ORGANIZATION
                                    </span>
                                </div>

                                <h3>
                                    Categories
                                </h3>

                                <p>
                                    Organize your catalog with
                                    structured product categories.
                                </p>

                                <span className="admin-action-link">
                                    Manage Categories
                                    <span>→</span>
                                </span>
                            </div>
                        </Link>

                        <Link
                            to="/admin/orders"
                            className="admin-action-card"
                        >
                            <div className="action-icon">
                                O
                            </div>

                            <div className="admin-action-content">
                                <div className="admin-action-top">
                                    <span className="admin-action-label">
                                        OPERATIONS
                                    </span>
                                </div>

                                <h3>
                                    Orders
                                </h3>

                                <p>
                                    Review customer orders and
                                    update order processing status.
                                </p>

                                <span className="admin-action-link">
                                    Manage Orders
                                    <span>→</span>
                                </span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* ==========================================
                    ADMIN PRINCIPLES
                ========================================== */}

                <section className="admin-section">
                    <div className="admin-section-heading">
                        <div>
                            <span className="admin-eyebrow">
                                ADMIN PRINCIPLES
                            </span>

                            <h2>
                                Store Operations
                            </h2>

                            <p>
                                Core principles behind the
                                ShopSphere administration area.
                            </p>
                        </div>
                    </div>

                    <div className="admin-principles">
                        <div className="admin-principle">
                            <div className="principle-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Secure Access
                                </strong>

                                <p>
                                    Administrative features are
                                    restricted to users with the
                                    appropriate admin role.
                                </p>
                            </div>
                        </div>

                        <div className="admin-principle">
                            <div className="principle-icon">
                                ◈
                            </div>

                            <div>
                                <strong>
                                    Centralized Management
                                </strong>

                                <p>
                                    Products, categories, and
                                    orders can be managed from a
                                    single workspace.
                                </p>
                            </div>
                        </div>

                        <div className="admin-principle">
                            <div className="principle-icon">
                                →
                            </div>

                            <div>
                                <strong>
                                    Order Control
                                </strong>

                                <p>
                                    Keep order review and status
                                    management organized in one
                                    place.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}

export default AdminDashboard;