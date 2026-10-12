import React from 'react';
import { ArrowUp, Heart, TrainFront } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Overview', to: '/home' },
  { label: 'About', to: '/about' },
  { label: 'AI Camera', to: '/camera' },
  { label: 'Alerts', to: '/alerts' },
  { label: 'Reports', to: '/reports' },
  { label: 'Railway Map', to: '/map' },
  { label: 'Settings', to: '/settings' },
];

export default function Footer() {
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="portfolio-footer">
      <div className="footer-main">
        <Link to="/home" className="footer-brand" aria-label="RailGuard AI home">
          <span className="footer-mark"><TrainFront size={19} /></span>
          <span>
            <strong>RailGuard <span>AI</span></strong>
            <small>Safer tracks. Smarter response.</small>
          </span>
        </Link>
        <p className="footer-description">
          A student-built railway safety prototype for incident awareness and faster reporting.
        </p>
      </div>

      <div className="footer-navigation">
        <span className="footer-label">QUICK LINKS</span>
        <nav aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <p className="footer-credit">
          Built with <Heart size={13} fill="currentColor" /> by
          <strong> Shivank Saini</strong> &amp; <strong>Shubham</strong>
        </p>
        <div className="footer-note"><span className="footer-status" /> Student project · Hackathon prototype</div>
        <button className="back-to-top" type="button" onClick={backToTop} aria-label="Back to top">
          Back to top <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
