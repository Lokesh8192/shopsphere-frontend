import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../../api/api";

import "../../styles/auth.css";


function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [showSuccessModal, setShowSuccessModal] =
        useState(false);


    /* =========================================================
       HANDLE INPUT
    ========================================================= */

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


    /* =========================================================
       SUBMIT REGISTRATION
    ========================================================= */

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");


        /* -----------------------------------------------------
           PASSWORD MATCH
        ----------------------------------------------------- */

        if (
            formData.password !==
            formData.confirm_password
        ) {
            setError(
                "Password and confirm password do not match."
            );

            return;
        }


        setLoading(true);


        try {
            const response = await apiRequest(
                "/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                }
            );


            /* -------------------------------------------------
               API ERROR
            ------------------------------------------------- */

            if (!response.ok) {
                const validationDetails =
                    response.data?.error?.details;


                if (Array.isArray(validationDetails)) {
                    setError(
                        validationDetails
                            .map(
                                (item) =>
                                    item.message
                            )
                            .join(", ")
                    );
                } else {
                    setError(
                        response.data?.message ||
                        response.data?.detail ||
                        "Registration failed"
                    );
                }

                return;
            }


            /* -------------------------------------------------
               SUCCESS
            ------------------------------------------------- */

            setShowSuccessModal(true);


            setFormData({
                username: "",
                email: "",
                password: "",
                confirm_password: "",
            });

        } catch (err) {
            console.error(
                "Registration error:",
                err
            );

            setError(
                err.message ||
                "Something went wrong while creating your account."
            );
        } finally {
            setLoading(false);
        }
    }


    /* =========================================================
       GO TO LOGIN
    ========================================================= */

    function handleContinueToLogin() {
        setShowSuccessModal(false);

        navigate("/login", {
            replace: true,
        });
    }


    return (
        <>
            <main className="auth-page">

                <div className="auth-container">

                    {/* =================================================
                        LEFT BRAND PANEL
                    ================================================= */}

                    <section className="auth-brand-panel">

                        <div className="auth-brand-content">

                            <div className="auth-brand-mark">
                                S
                            </div>


                            <span className="auth-eyebrow">
                                JOIN SHOPSPHERE
                            </span>


                            <h1>
                                Start your
                                <br />
                                shopping journey.
                            </h1>


                            <p>
                                Create your ShopSphere account
                                and enjoy an easier way to browse
                                products, manage your cart, and
                                place orders.
                            </p>


                            <div className="auth-features">

                                <div className="auth-feature">

                                    <span className="auth-feature-icon">
                                        ✓
                                    </span>

                                    <span>
                                        Secure account
                                    </span>

                                </div>


                                <div className="auth-feature">

                                    <span className="auth-feature-icon">
                                        🛍️
                                    </span>

                                    <span>
                                        Discover products
                                    </span>

                                </div>


                                <div className="auth-feature">

                                    <span className="auth-feature-icon">
                                        🚚
                                    </span>

                                    <span>
                                        Easy order management
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        REGISTER FORM
                    ================================================= */}

                    <section className="auth-form-panel">

                        <div className="auth-card">

                            <span className="auth-eyebrow">
                                CREATE ACCOUNT
                            </span>


                            <h2>
                                Create your account
                            </h2>


                            <p className="auth-subtitle">
                                Sign up to start shopping with
                                ShopSphere.
                            </p>


                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (
                                <div className="auth-error">
                                    {error}
                                </div>
                            )}


                            {/* =================================================
                                FORM
                            ================================================= */}

                            <form
                                className="auth-form"
                                onSubmit={handleSubmit}
                                autoComplete="off"
                            >

                                {/* USERNAME */}

                                <div className="auth-form-group">

                                    <label htmlFor="register-username">
                                        Username
                                    </label>

                                    <input
                                        id="register-username"
                                        className="auth-input"
                                        type="text"
                                        name="username"
                                        value={
                                            formData.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="auth-form-group">

                                    <label htmlFor="register-email">
                                        Email address
                                    </label>

                                    <input
                                        id="register-email"
                                        className="auth-input"
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        required
                                    />

                                </div>


                                {/* PASSWORD */}

                                <div className="auth-form-group">

                                    <label htmlFor="register-password">
                                        Password
                                    </label>

                                    <div className="auth-input-wrapper">

                                        <input
                                            id="register-password"
                                            className="auth-input auth-password-input"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Create a password"
                                            autoComplete="new-password"
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
                                        >
                                            {showPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                    </div>

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="auth-form-group">

                                    <label htmlFor="register-confirm-password">
                                        Confirm password
                                    </label>

                                    <div className="auth-input-wrapper">

                                        <input
                                            id="register-confirm-password"
                                            className="auth-input auth-password-input"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirm_password"
                                            value={
                                                formData.confirm_password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Confirm your password"
                                            autoComplete="new-password"
                                            required
                                        />


                                        <button
                                            type="button"
                                            className="auth-password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                    </div>

                                </div>


                                {/* TERMS */}

                                <div className="auth-options register-options">

                                    <label className="auth-check">

                                        <input
                                            type="checkbox"
                                            required
                                        />

                                        <span>
                                            I agree to the
                                            ShopSphere terms
                                            and conditions
                                        </span>

                                    </label>

                                </div>


                                {/* REGISTER BUTTON */}

                                <button
                                    type="submit"
                                    className="auth-submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"}
                                </button>

                            </form>


                            {/* LOGIN */}

                            <p className="auth-bottom-text">

                                Already have an account?{" "}

                                <Link to="/login">
                                    Sign in
                                </Link>

                            </p>

                        </div>

                    </section>

                </div>

            </main>


            {/* =========================================================
                SUCCESS MODAL
            ========================================================= */}

            {showSuccessModal && (

                <div
                    className="register-success-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="register-success-title"
                >

                    <div className="register-success-modal">

                        {/* SUCCESS ICON */}

                        <div className="register-success-icon">
                            ✓
                        </div>


                        {/* CONTENT */}

                        <span className="register-success-eyebrow">
                            SHOPSPHERE ACCOUNT
                        </span>


                        <h2 id="register-success-title">
                            Account created successfully!
                        </h2>


                        <p>
                            Your ShopSphere account has been
                            created successfully. You can now
                            sign in and start shopping.
                        </p>


                        {/* BUTTON */}

                        <button
                            type="button"
                            className="register-success-button"
                            onClick={handleContinueToLogin}
                        >
                            Continue to Sign In
                        </button>


                        <button
                            type="button"
                            className="register-success-secondary"
                            onClick={handleContinueToLogin}
                        >
                            Go to Login
                        </button>

                    </div>

                </div>

            )}
        </>
    );
}

export default Register;