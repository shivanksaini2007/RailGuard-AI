import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, TrainFront, UsersRound } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('employee');
  const [id, setId] = useState('RG-1001');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/home" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(role === 'driver' ? 'DRV-1001' : id, pin);
      navigate('/home');
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Check your ID and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-grid-glow" />

      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">
            <TrainFront size={28} />
          </div>

          <div>
            <div className="login-title">
              RailGuard <span>AI</span>
            </div>
            <div className="login-subtitle">
              Railway Safety Operations
            </div>
          </div>
        </div>

        <div className="secure-banner">
          <LockKeyhole size={16} />
          Restricted access — demo railway personnel only
        </div>

        <div className="role-switch">
          <button
            className={
              role === 'employee'
                ? 'role-btn active'
                : 'role-btn'
            }
            onClick={() => {
              setRole('employee');
              setId('RG-1001');
              setPin('');
            }}
          >
            <UsersRound size={18} />
            <span>Railway Employee</span>
          </button>

          <button
            className={
              role === 'driver'
                ? 'role-btn active'
                : 'role-btn'
            }
            onClick={() => {
              setRole('driver');
              setId('DRV-1001');
              setPin('');
            }}
          >
            <TrainFront size={18} />
            <span>Train Driver</span>
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>Employee / Driver ID</label>

            <div className="input-wrap">
              <UsersRound size={17} />

              <input
                placeholder="Enter personnel ID"
                autoComplete="username"
                value={id}
                onChange={(event) => setId(event.target.value)}
                disabled={role === 'driver'}
              />
            </div>
          </div>

          <div className="field">
            <label>Password</label>

            <div className="input-wrap">
              <LockKeyhole size={17} />

              <input
                placeholder="Enter your password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                type="password"
                autoComplete="current-password"
                maxLength={100}
              />
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button className="login-btn" disabled={submitting}>
            <ShieldCheck size={18} />
            {submitting ? 'Signing in…' : 'Enter Operations Console'}
          </button>
        </form>

        <p className="login-note">
Frontend demo login: use RG-1001 for Employee or DRV-1001 for Driver, and enter any non-empty password. Data is saved in this browser.
        </p>
      </div>
    </div>
  );
}
