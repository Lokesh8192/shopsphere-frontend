import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../../api/api";
import { useAuth } from "../../context/useAuth";

import "../../styles/auth.css";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                setError(
                    response.data?.detail ||
                    response.data?.message ||
                    "Login failed"
                );

                return;
            }

            const {
                access_token,
                refresh_token,
                user,
            } = response.data.data;

            login({
                access_token,
                refresh_token,
                user,
            });

            alert("User logged in successfully");

            navigate("/", {
                replace: true,
                state: {
                    scrollToUserDetails: true,
                },
            });
        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.message ||
                "Something went wrong while logging in."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-container">

                {/* ==========================================
                    LEFT BRAND PANEL
                ========================================== */}
                <section className="auth-brand-panel">
                    <div className="auth-brand-content">

                        <div className="auth-brand-mark">
                            S
                        </div>

                        <span className="auth-eyebrow">
                            WELCOME TO SHOPSPHERE
                        </span>

                        <h1>
                            Your shopping
                            <br />
                            journey starts here.
                        </h1>

                        <p>
                            Sign in to manage your cart,
                            delivery addresses, orders,
                            and continue shopping with
                            ShopSphere.
                        </p>

                        <div className="auth-features">

                            <div className="auth-feature">
                                <span className="auth-feature-icon">
                                    ✓
                                </span>

                                <span>
                                    Secure account access
                                </span>
                            </div>

                            <div className="auth-feature">
                                <span className="auth-feature-icon">
                                    🛒
                                </span>

                                <span>
                                    Easy cart management
                                </span>
                            </div>

                            <div className="auth-feature">
                                <span className="auth-feature-icon">
                                    📦
                                </span>

                                <span>
                                    Track your orders
                                </span>
                            </div>

                        </div>

                    </div>
                </section>


                {/* ==========================================
                    LOGIN FORM PANEL
                ========================================== */}
                <section className="auth-form-panel">
                    <div className="auth-card">

                        <span className="auth-eyebrow">
                            ACCOUNT LOGIN
                        </span>

                        <h2>
                            Welcome back
                        </h2>

                        <p className="auth-subtitle">
                            Sign in to continue shopping with
                            ShopSphere.
                        </p>


                        {/* ERROR */}
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}


                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            {/* ==================================
                                EMAIL
                            ================================== */}
                            <div className="auth-form-group">

                                <label htmlFor="login-email">
                                    Email address
                                </label>

                                <input
                                    id="login-email"
                                    className="auth-input"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                />

                            </div>


                            {/* ==================================
                                PASSWORD
                            ================================== */}
                            <div className="auth-form-group">

                                <label htmlFor="login-password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">

                                    <input
                                        id="login-password"
                                        className="auth-input auth-password-input"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* ==================================
                                OPTIONS
                            ================================== */}
                            <div className="auth-options">

                                <label className="auth-check">

                                    <input
                                        type="checkbox"
                                    />

                                    <span>
                                        Remember me
                                    </span>

                                </label>

                            </div>


                            {/* ==================================
                                LOGIN BUTTON
                            ================================== */}
                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign In"}
                            </button>

                        </form>


                        {/* ==================================
                            REGISTER LINK
                        ================================== */}
                        <p className="auth-bottom-text">
                            Don't have an account?{" "}

                            <Link to="/register">
                                Create an account
                            </Link>
                        </p>

                    </div>
                </section>

            </div>
        </main>
    );
}

export default Login;