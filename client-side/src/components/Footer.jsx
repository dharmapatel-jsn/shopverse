import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container container">
      <div className="footer-brand">
        <h2>
          Shop<span>Verse</span>
        </h2>
        <p>
          Your one-stop destination for fashion, electronics, and more.
          Quality products at unbeatable prices, delivered fast.
        </p>
      </div>

      <div className="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/login">Sign In</Link></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Follow Us</h4>
        <div className="social-icons">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Twitter">𝕏</a>
          <a href="#" aria-label="Instagram">ig</a>
          <a href="#" aria-label="YouTube">yt</a>
        </div>
      </div>
    </div>

    <div className="footer-student">
      <p>Made by <strong>Dharma Patel</strong></p>
      <p>University Road, Rajkot, Gujarat - 360005, India</p>
    </div>
  </footer>
);

export default Footer;
