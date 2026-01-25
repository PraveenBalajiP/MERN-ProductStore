import "../css/footer.css";

function Footer(){
    return(
        <div className="footer">
            <div className="footer-section-1">
                <p className="footer-title">Product Store</p>
                <div className="footer-links">
                    <p>Connect with us:</p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook"></i></a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-x-twitter"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-section-2">
                <p>A simple platform to list, explore, and manage products with ease.</p>
                <pre className="footer-end">&copy; 2026 Product Store  All rights reserved</pre>
            </div>
        </div>
    );
}

export default Footer;