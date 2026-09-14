import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

import "../../styles/home.css";


function Home() {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  const location = useLocation();


  /* =========================================================
     SCROLL TO USER DETAILS AFTER LOGIN
  ========================================================= */

  useEffect(() => {
    if (
      location.state?.scrollToUserDetails &&
      isAuthenticated &&
      user
    ) {
      setTimeout(() => {
        const userDetails =
          document.getElementById(
            "user-details"
          );

        if (userDetails) {
          userDetails.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [
    location.state,
    isAuthenticated,
    user,
  ]);


  return (
    <main className="home-page">

      {/* =================================================
                HERO SECTION
            ================================================= */}

      <section className="home-hero">

        <div className="home-container home-hero-grid">

          {/* =================================================
                        HERO CONTENT
                    ================================================= */}

          <div className="home-hero-content">

            <span className="home-eyebrow">
              SMART SHOPPING STARTS HERE
            </span>


            <h1>
              Everything you need.
              <span>
                All in one place.
              </span>
            </h1>


            <p className="home-hero-description">
              Discover quality products, simple shopping,
              secure checkout, and reliable delivery with
              ShopSphere.
            </p>


            <div className="home-hero-actions">

              <Link
                to="/products"
                className="home-primary-button"
              >
                Shop Now
              </Link>


              <Link
                to="/products"
                className="home-secondary-button"
              >
                Explore Products
              </Link>

            </div>


            <div className="home-hero-trust">

              <div>
                <strong>
                  500+
                </strong>

                <span>
                  Products
                </span>
              </div>


              <div>
                <strong>
                  Secure
                </strong>

                <span>
                  Checkout
                </span>
              </div>


              <div>
                <strong>
                  Fast
                </strong>

                <span>
                  Delivery
                </span>
              </div>

            </div>

          </div>


          {/* =================================================
                        HERO VISUAL
                    ================================================= */}

          <div className="home-hero-visual">

            <div className="hero-glow hero-glow-one" />

            <div className="hero-glow hero-glow-two" />


            <div className="hero-main-card">

              <div className="hero-card-top">

                <span className="hero-card-badge">
                  ShopSphere
                </span>

                <span className="hero-card-dot">
                  ●
                </span>

              </div>


              <div className="hero-shopping-icon">
                🛍️
              </div>


              <h3>
                Your everyday
                <br />
                shopping destination
              </h3>


              <p>
                Browse. Choose. Checkout.
              </p>


              <div className="hero-mini-products">

                <div>
                  📱
                </div>

                <div>
                  👕
                </div>

                <div>
                  ⌚
                </div>

                <div>
                  🏠
                </div>

              </div>

            </div>


            {/* FLOATING CARD 1 */}

            <div className="hero-floating-card hero-floating-card-one">

              <span className="floating-icon">
                ✓
              </span>


              <div>

                <strong>
                  Secure Shopping
                </strong>

                <small>
                  Protected checkout
                </small>

              </div>

            </div>


            {/* FLOATING CARD 2 */}

            <div className="hero-floating-card hero-floating-card-two">

              <span className="floating-icon">
                ⚡
              </span>


              <div>

                <strong>
                  Quick Delivery
                </strong>

                <small>
                  Fast & reliable
                </small>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
                USER ACCOUNT SNAPSHOT
            ================================================= */}

      {isAuthenticated && user && (

        <section
          id="user-details"
          className="home-user-section"
        >

          <div className="home-container">

            <div className="home-user-card">

              {/* USER AVATAR */}

              <div className="home-user-avatar">

                {(
                  user.username ||
                  user.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}

              </div>


              {/* USER MAIN CONTENT */}

              <div className="home-user-main">

                <div className="home-user-heading">

                  <div>

                    <span className="home-user-eyebrow">
                      ACCOUNT SNAPSHOT
                    </span>


                    <h2>
                      Welcome back,{" "}
                      {user.username ||
                        "User"}{" "}
                      👋
                    </h2>


                    <p>
                      You're signed in and ready
                      to continue shopping.
                    </p>

                  </div>


                  <span className="home-user-status">
                    ● Active
                  </span>

                </div>


                {/* USER INFORMATION */}

                <div className="home-user-info">

                  {/* EMAIL */}

                  <div className="home-user-info-item">

                    <span>
                      Email
                    </span>

                    <strong>
                      {user.email ||
                        "N/A"}
                    </strong>

                  </div>


                  {/* USERNAME */}

                  <div className="home-user-info-item">

                    <span>
                      Username
                    </span>

                    <strong>
                      {user.username ||
                        "N/A"}
                    </strong>

                  </div>


                  {/* ACCOUNT */}

                  <div className="home-user-info-item">

                    <span>
                      Account
                    </span>

                    <strong>
                      {user.role ===
                        "admin"
                        ? "Administrator"
                        : "Customer"}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* =================================================
                SHOP BY CATEGORY
            ================================================= */}

      <section className="home-section">

        <div className="home-container">

          <div className="home-section-heading">

            <div>

              <span className="home-eyebrow">
                EXPLORE
              </span>


              <h2>
                Shop by category
              </h2>

            </div>


            <Link
              to="/products"
              className="home-view-link"
            >
              View All Products →
            </Link>

          </div>


          <div className="home-category-grid">

            {/* ELECTRONICS */}

            <Link
              to="/products"
              className="home-category-card category-electronics"
            >

              <div className="category-icon">
                📱
              </div>


              <div>

                <h3>
                  Electronics
                </h3>

                <p>
                  Devices & accessories
                </p>

              </div>


              <span className="category-arrow">
                →
              </span>

            </Link>


            {/* FASHION */}

            <Link
              to="/products"
              className="home-category-card category-fashion"
            >

              <div className="category-icon">
                👕
              </div>


              <div>

                <h3>
                  Fashion
                </h3>

                <p>
                  Style for every day
                </p>

              </div>


              <span className="category-arrow">
                →
              </span>

            </Link>


            {/* HOME */}

            <Link
              to="/products"
              className="home-category-card category-home"
            >

              <div className="category-icon">
                🏠
              </div>


              <div>

                <h3>
                  Home & Living
                </h3>

                <p>
                  Make your space better
                </p>

              </div>


              <span className="category-arrow">
                →
              </span>

            </Link>


            {/* ESSENTIALS */}

            <Link
              to="/products"
              className="home-category-card category-essentials"
            >

              <div className="category-icon">
                🛒
              </div>


              <div>

                <h3>
                  Daily Essentials
                </h3>

                <p>
                  Everyday favourites
                </p>

              </div>


              <span className="category-arrow">
                →
              </span>

            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
                WHY SHOPSPHERE
            ================================================= */}

      <section className="home-benefits-section">

        <div className="home-container">

          <div className="home-centered-heading">

            <span className="home-eyebrow">
              WHY SHOPSPHERE
            </span>


            <h2>
              A simpler way to shop online
            </h2>


            <p>
              Everything is designed around a smooth,
              secure, and convenient shopping experience.
            </p>

          </div>


          <div className="home-benefits-grid">

            {/* SECURE */}

            <div className="home-benefit-card">

              <div className="benefit-icon">
                🔒
              </div>


              <h3>
                Secure Shopping
              </h3>


              <p>
                Your account and order information
                are protected with secure authentication.
              </p>

            </div>


            {/* DELIVERY */}

            <div className="home-benefit-card">

              <div className="benefit-icon">
                🚚
              </div>


              <h3>
                Reliable Delivery
              </h3>


              <p>
                Simple address management and
                dependable order processing.
              </p>

            </div>


            {/* CHECKOUT */}

            <div className="home-benefit-card">

              <div className="benefit-icon">
                💳
              </div>


              <h3>
                Easy Checkout
              </h3>


              <p>
                Select your address and complete
                your order in just a few steps.
              </p>

            </div>


            {/* EXPERIENCE */}

            <div className="home-benefit-card">

              <div className="benefit-icon">
                ⭐
              </div>


              <h3>
                Great Experience
              </h3>


              <p>
                Clean navigation and responsive
                design across devices.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
                HOW IT WORKS
            ================================================= */}

      <section className="home-section">

        <div className="home-container">

          <div className="home-section-heading centered">

            <div>

              <span className="home-eyebrow">
                HOW IT WORKS
              </span>


              <h2>
                Shopping made simple
              </h2>

            </div>

          </div>


          <div className="home-steps">

            {/* STEP 1 */}

            <div className="home-step">

              <div className="step-number">
                01
              </div>


              <div>

                <h3>
                  Browse products
                </h3>


                <p>
                  Explore our product collection
                  and find what you need.
                </p>

              </div>

            </div>


            <div className="home-step-line" />


            {/* STEP 2 */}

            <div className="home-step">

              <div className="step-number">
                02
              </div>


              <div>

                <h3>
                  Add to cart
                </h3>


                <p>
                  Choose your products and manage
                  quantities from your cart.
                </p>

              </div>

            </div>


            <div className="home-step-line" />


            {/* STEP 3 */}

            <div className="home-step">

              <div className="step-number">
                03
              </div>


              <div>

                <h3>
                  Checkout securely
                </h3>


                <p>
                  Select your delivery address
                  and place your order.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
                FINAL CTA
            ================================================= */}

      <section className="home-cta-section">

        <div className="home-container">

          <div className="home-cta-card">

            <div>

              <span className="home-eyebrow">
                READY TO SHOP?
              </span>


              <h2>
                Find something you'll love.
              </h2>


              <p>
                Explore the ShopSphere catalog
                and start shopping today.
              </p>

            </div>


            <Link
              to="/products"
              className="home-cta-button"
            >
              Browse Products →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;