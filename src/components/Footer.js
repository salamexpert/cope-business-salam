import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-brand">CopeBusiness</h3>
            <p className="footer-description">
              Professional digital marketing services to boost your online presence and grow your business.
            </p>
            <div className="footer-social">
              <a href="#twitter" className="social-link" aria-label="Twitter">
                𝕏
              </a>
              <a href="#facebook" className="social-link" aria-label="Facebook">
                f
              </a>
              <a href="#linkedin" className="social-link" aria-label="LinkedIn">
                in
              </a>
              <a href="#instagram" className="social-link" aria-label="Instagram">
                📷
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Product</h4>
            <ul className="footer-links">
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li>
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <a href="#api">API Documentation</a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Company</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>
            <ul className="footer-links">
              <li>
                <a href="#help">Help Center</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">Get in Touch</h4>
            <ul className="footer-contact">
              <li>
                <a href="mailto:support@copebusiness.com">support@copebusiness.com</a>
              </li>
              <li>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li className="footer-address">
                123 Business Ave<br />
                New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} CopeBusiness. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
            <Link to="/legal-disclaimer">Legal Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
