import React from 'react';
import { ArrowUp, Heart, TrainFront, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Overview', to: '/home' },
  { label: 'About Project', to: '/about' },
  { label: 'AI Camera', to: '/camera' },
  { label: 'Incidents', to: '/alerts' },
  { label: 'Reports', to: '/reports' },
  { label: 'Railway Map', to: '/map' },
  { label: 'Settings', to: '/settings' },
];

export default function Footer({ user }) {
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const visibleLinks = user?.role === 'driver'
    ? footerLinks.filter((link) => !['/camera', '/reports', '/settings'].includes(link.to))
    : footerLinks;

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
          {visibleLinks.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
      </div>

      <section className="team-credit" aria-label="Project team">
        <div className="team-heading"><UsersRound size={16} /><span>PROJECT TEAM</span></div>
        <div className="team-details">
          <p><span>Team Name</span><strong>TrackGuardians</strong></p>
          <p><span>Team Leader</span><strong>Shivank Saini</strong></p>
          <p><span>Team Member</span><strong>Shubham Yadav</strong></p>
        </div>
      </section>

      <div className="footer-bottom">
        <p className="footer-credit">
          Built with <Heart size={13} fill="currentColor" /> by
          <strong> TrackGuardians</strong>
        </p>
        <div className="footer-note"><span className="footer-status" /> Student project · Hackathon prototype</div>
        <button className="back-to-top" type="button" onClick={backToTop} aria-label="Back to top">
          Back to top <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
