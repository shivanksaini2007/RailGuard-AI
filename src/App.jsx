import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import About from './pages/About';
import Alerts from './pages/Alerts';
import Camera from './pages/Camera';
import DriverMode from './pages/DriverMode';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RailwayMap from './pages/RailwayMap';
import ReportDetails from './pages/ReportDetails';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { useAuth } from './context/AuthContext';

function ConsoleShell() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="console">
      <Navbar
        user={user}
        onMenuClick={() => setSidebarOpen((open) => !open)}
        onLogout={logout}
      />

      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
        onLogout={logout}
      />

      <main className="content">
        <div className="console-heading">
          <div>
            <span className="console-eyebrow">
              <span className="green-dot" /> CONTROL NETWORK ONLINE
            </span>
            <h1>Railway Safety Console</h1>
          </div>
          <div className="online">
            <Activity size={15} />
            Monitoring active
          </div>
        </div>

        <Outlet />
        <Footer />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ConsoleShell />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/:id" element={<ReportDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/map" element={<RailwayMap />} />
          <Route path="/driver" element={<DriverMode />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
