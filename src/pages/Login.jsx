import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, TrainFront, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('employee');
  const [id, setId] = useState('RG-1001');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');

  if (user) {
    navigate('/home');
    return null;
  }

  const submit = (event) => {
    event.preventDefault();

    const success = login(
      role === 'driver' ? 'DRV-1001' : id,
      pin
    );

    if (!success) {
      setError(
        role === 'driver'
          ? 'Use demo driver PIN 1234.'
          : 'Use demo employee ID RG-1001 and PIN 1234.'
      );
      return;
    }

    setError('');
    navigate('/home');
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
                value={id}
                onChange={(event) => setId(event.target.value)}
                disabled={role === 'driver'}
              />
            </div>
          </div>

          <div className="field">
            <label>Access PIN</label>

            <div className="input-wrap">
              <LockKeyhole size={17} />

              <input
                value={pin}
                onChange={(event) =>
                  setPin(
                    event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )
                }
                type="password"
                inputMode="numeric"
              />
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button className="login-btn">
            <ShieldCheck size={18} />
            Enter Operations Console
          </button>
        </form>

        <p className="login-note">
          Demo login only. Production railway deployment would
          require real authentication, permissions and audit logs.
        </p>
      </div>
    </div>
  );
}
