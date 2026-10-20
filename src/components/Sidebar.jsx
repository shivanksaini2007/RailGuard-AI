import React from 'react';
import {
  Bell, Camera, FileText, Info, LayoutDashboard,
  Map, Settings, TrainFront, UsersRound, Wifi, LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';

const navigation = [
  ['/home', 'Operations', LayoutDashboard],
  ['/camera', 'AI Camera', Camera],
  ['/alerts', 'Incidents', Bell],
  ['/reports', 'Reports', FileText],
  ['/map', 'Railway Map', Map],
  ['/driver', 'Driver Safety', TrainFront],
  ['/settings', 'Settings', Settings],
  ['/about', 'About Project', Info],
];

export default function Sidebar({ user, isOpen, onNavigate, onLogout }) {
  const { incidents } = useIncidents();
  const openCount = incidents.filter((item) => item.status === 'Open').length;
  const criticalCount = incidents.filter(
    (item) => item.severity === 'critical' && item.status === 'Open'
  ).length;

  return (
    <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-top">
        <div className="role-card">
          <div className="role-avatar">
            {user.role === 'driver' ? <TrainFront size={19} /> : <UsersRound size={19} />}
          </div>
          <div>
            <strong>{user.role === 'driver' ? 'Train Driver' : 'Railway Employee'}</strong>
            <small>{user.name}</small>
          </div>
        </div>

        {(user?.role === 'driver'
          ? navigation.filter(([path]) => ['/home', '/driver', '/map', '/alerts', '/about'].includes(path))
          : navigation.filter(([path]) => path !== '/driver')
        ).map(([path, label, Icon]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => isActive ? 'nav active' : 'nav'}
            onClick={onNavigate}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'Incidents' && openCount > 0 && <em>{openCount}</em>}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div><Wifi size={14} /> Local AI link active</div>
        <small>{criticalCount} critical alert(s) open</small>
      </div>

      <button className="logout" onClick={onLogout}>
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}
