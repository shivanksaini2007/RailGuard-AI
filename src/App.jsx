import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
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
