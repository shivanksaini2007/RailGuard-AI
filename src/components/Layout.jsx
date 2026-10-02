import React, { useState } from 'react';
import {
  Activity,
  Bell,
  Camera,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Moon,
  Settings,
  Sun,
  ShieldCheck,
  TrainFront,
  UserRound,
  UsersRound,
  Wifi,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useIncidents } from '../context/IncidentContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  ['/home', 'Operations', LayoutDashboard],
  ['/camera', 'AI Camera', Camera],
  ['/alerts', 'Incidents', Bell],
  ['/reports', 'Reports', FileText],
  ['/map', 'Railway Map', Map],
  ['/driver', 'Driver Cab', TrainFront],
  ['/settings', 'Settings', Settings],
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { incidents } = useIncidents();
  const { isDark, toggleTheme } = useTheme();

  const [sidebar, setSidebar] = useState(false);

  const openCount = incidents.filter(
    (item) => item.status === 'Open'
  ).length;

  const criticalCount = incidents.filter(
    (item) =>
      item.severity === 'critical' &&
      item.status === 'Open'
  ).length;

  return (
    <div className="console">
      <header className="topbar">
        <button
          className="icon-only mobile-only"
          onClick={() => setSidebar((value) => !value)}
        >
          <Menu />
        </button>

        <div className="product-brand">
          <div className="product-icon">
            <TrainFront size={25} />
          </div>

          <div>
            <strong>
              RailGuard <span>AI</span>
            </strong>
            <small>Railway Safety Operations</small>
          </div>
        </div>

        <div className="header-meta">
          <div className="secure-chip">
            <ShieldCheck size={15} />
            {user.role === 'driver' ? 'DRIVER' : 'EMPLOYEE'}
          </div>

          <div className="system-chip">
            <span className="green-dot" />
            SYSTEM ONLINE
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <div className="user-chip">
            <span>{user.name}</span>
            <button onClick={logout}>Exit</button>
          </div>
        </div>
      </header>

      <aside className={`sidebar ${sidebar ? 'show' : ''}`}>
        <div className="sidebar-top">
          <div className="role-card">
            <div className="role-avatar">
              {user.role === 'driver' ? (
                <TrainFront />
              ) : (
                <UsersRound />
              )}
            </div>

            <div>
              <strong>
                {user.role === 'driver'
                  ? 'Train Driver'
                  : 'Railway Employee'}
              </strong>

              <small>{user.name}</small>
            </div>
          </div>

          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? 'nav active' : 'nav'
              }
              onClick={() => setSidebar(false)}
            >
              <Icon size={18} />
              <span>{label}</span>

              {label === 'Incidents' && openCount > 0 && (
                <em>{openCount}</em>
              )}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div>
            <Wifi size={14} />
            Local AI link active
          </div>

          <small>
            {criticalCount} critical alert(s) open
          </small>
        </div>

        <button
          className="logout"
          onClick={logout}
          style={{
            margin: '0 14px 18px',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      <main className="content">
        <header
          style={{
            position: 'static',
            border: 0,
            padding: 0,
            marginBottom: 22,
            background: 'transparent',
          }}
        >
          <div>
            <small style={{ color: '#23d6a0' }}>
              ● CONTROL NETWORK ONLINE
            </small>

            <h1 style={{ margin: '5px 0 0', fontSize: 25 }}>
              Railway Safety Console
            </h1>
          </div>

          <div className="online">
            <Activity size={15} />
            Monitoring active
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
