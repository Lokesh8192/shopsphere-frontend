import { useEffect, useState } from "react";
import {
    Link,
    NavLink,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { apiRequest } from "../../api/api";

function Navbar() {
    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        async function loadCartCount() {
            if (!isAuthenticated) {
                setCartCount(0);
                return;
            }

            try {
                const response = await apiRequest("/api/v1/cart");

                if (!response.ok) {
                    return;
                }

                const cart = response.data?.data;
                const items = cart?.items || [];

                const count = items.reduce(
                    (total, item) =>
                        total + Number(item.quantity || 0),
                    0
                );

                setCartCount(count);
            } catch {
                setCartCount(0);
            }
        }

        loadCartCount();
    }, [isAuthenticated]);

    async function handleLogout() {
        await logout();

        setCartCount(0);
        setMenuOpen(false);

        navigate("/login");
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    function getUserInitial() {
        return (
            user?.username ||
            user?.email ||
            "U"
        )
            .charAt(0)
            .toUpperCase();
    }

    return (
        <header className="navbar">
            <div className="container navbar-container">

                <Link
                    to="/"
                    className="navbar-brand"
                    onClick={closeMenu}
                    aria-label="ShopSphere Home"
                >
                    <span className="brand-mark">
                        S
                    </span>

                    <span className="navbar-brand-text">
                        ShopSphere
                    </span>
                </Link>

                <button
                    type="button"
                    className={`navbar-menu-button ${
                        menuOpen
                            ? "navbar-menu-button-open"
                            : ""
                    }`}
                    onClick={() =>
                        setMenuOpen((current) => !current)
                    }
                    aria-label={
                        menuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={menuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav
                    className={
                        menuOpen
                            ? "navbar-nav navbar-nav-open"
                            : "navbar-nav"
                    }
                >
                    <NavLink
                        to="/"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive
                                ? "navbar-link navbar-link-active"
                                : "navbar-link"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/products"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive
                                ? "navbar-link navbar-link-active"
                                : "navbar-link"
                        }
                    >
                        Products
                    </NavLink>

                    {isAuthenticated && (
                        <>
                            <NavLink
                                to="/cart"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "navbar-link navbar-link-active"
                                        : "navbar-link"
                                }
                            >
                                <span className="cart-link">
                                    <span>Cart</span>

                                    {cartCount > 0 && (
                                        <span className="cart-badge">
                                            {cartCount > 99
                                                ? "99+"
                                                : cartCount}
                                        </span>
                                    )}
                                </span>
                            </NavLink>

                            <NavLink
                                to="/orders"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "navbar-link navbar-link-active"
                                        : "navbar-link"
                                }
                            >
                                Orders
                            </NavLink>

                            <NavLink
                                to="/address"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "navbar-link navbar-link-active"
                                        : "navbar-link"
                                }
                            >
                                Address
                            </NavLink>

                            {user?.role === "admin" && (
                                <NavLink
                                    to="/admin"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "navbar-link navbar-link-active navbar-admin-link"
                                            : "navbar-link navbar-admin-link"
                                    }
                                >
                                    Admin
                                </NavLink>
                            )}

                            <div className="navbar-user">
                                <span className="navbar-user-avatar">
                                    {getUserInitial()}
                                </span>

                                <div className="navbar-user-details">
                                    <span className="navbar-user-label">
                                        Signed in as
                                    </span>

                                    <span className="navbar-username">
                                        {user?.username ||
                                            user?.email ||
                                            "User"}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {!isAuthenticated && (
                        <div className="navbar-auth">
                            <NavLink
                                to="/login"
                                onClick={closeMenu}
                                className="navbar-login"
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                onClick={closeMenu}
                                className="navbar-register"
                            >
                                Register
                            </NavLink>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;