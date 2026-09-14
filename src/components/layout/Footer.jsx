function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-main">
                    <div className="footer-brand">
                        <span className="footer-brand-mark">S</span>

                        <div>
                            <strong>ShopSphere</strong>

                            <p>
                                Simple. Secure. Smarter shopping.
                            </p>
                        </div>
                    </div>

                    <div className="footer-links">
                        <a href="/products">
                            Products
                        </a>

                        <a href="/orders">
                            Orders
                        </a>

                        <a href="/address">
                            Address
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © 2026 ShopSphere. All rights reserved.
                    </p>

                    <span>
                        Built with React & FastAPI
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;