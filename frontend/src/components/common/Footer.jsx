import { Link } from 'react-router-dom';
import { RiBrainLine, RiGithubLine, RiLinkedinBoxLine, RiTwitterLine } from 'react-icons/ri';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="footer-logo">
                <RiBrainLine />
              </div>
              <span>EduPath <strong>AI</strong></span>
            </Link>
            <p className="footer-tagline">
              AI-powered School Student Dropout Prevention & Career Guidance System.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="GitHub" className="footer-social-link"><RiGithubLine /></a>
              <a href="#" aria-label="LinkedIn" className="footer-social-link"><RiLinkedinBoxLine /></a>
              <a href="#" aria-label="Twitter" className="footer-social-link"><RiTwitterLine /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#hero">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#footer">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Resources</h5>
            <ul className="footer-links">
              <li><a href="#">Career Guidance</a></li>
              <li><a href="#">Attendance Analytics</a></li>
              <li><a href="#">Student Reports</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Support & Contact</h5>
            <ul className="footer-links">
              <li><a href="mailto:support@edupathai.com">support@edupathai.com</a></li>
              <li><a href="tel:+919876543210">+91 98765 43210</a></li>
              <li style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tamil Nadu, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-badges">
            <span className="footer-badge">School Management</span>
            <span className="footer-badge">AI Powered</span>
            <span className="footer-badge">Career Guidance</span>
          </div>
          <p>© 2026 EduPath AI. All Rights Reserved. Developed as a Placement Training Project.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;