import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ShieldCheck, TrainFront } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const quickLinks = [
  { label: 'Overview', to: '/home' },
  { label: 'About', to: '/about' },
  { label: 'Camera', to: '/camera' },
  { label: 'Alerts', to: '/alerts' },
  { label: 'Reports', to: '/reports' },
  { label: 'Map', to: '/map' },
];

export default function Navbar({ user, onMenuClick, onLogout }) {
  return (
    <header className="topbar">
      <button
        className="icon-only mobile-only"
        onClick={onMenuClick}
        aria-label="Open navigation"
        type="button"
      >
        <Menu size={20} />
      </button>

      <NavLink className="product-brand" to="/home" aria-label="RailGuard AI home">
        <span className="product-icon"><TrainFront size={23} /></span>
        <span className="brand-copy">
          <strong>RailGuard <span>AI</span></strong>
          <small>Railway Safety Operations</small>
        </span>
      </NavLink>

      <nav className="topbar-links" aria-label="Quick navigation">
        {quickLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-meta">
        <div className="secure-chip">
          <ShieldCheck size={15} />
          {user?.role === 'driver' ? 'DRIVER' : 'EMPLOYEE'}
        </div>
        <div className="system-chip"><span className="green-dot" /> SYSTEM ONLINE</div>
        <ThemeToggle />
        <div className="user-chip">
          <span>{user?.name || 'User'}</span>
          <button onClick={onLogout} aria-label="Sign out" type="button">Exit</button>
        </div>
      </div>
    </header>
  );
}
