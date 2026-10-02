import React from 'react';
import { Camera, MapPin, Moon, ShieldCheck, Sun, TimerReset, Zap } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user } = useAuth();
  const { isDark, setTheme } = useTheme();

  const [shift, setShift] = useLocalStorage(
    'railguard_shift',
    'Morning Shift'
  );

  const [location, setLocation] = useLocalStorage(
    'railguard_location',
    'Training Yard • Track 04'
  );

  const [simulation, setSimulation] =
    useLocalStorage(
      'railguard_simulation',
      true
    );

  const [sound, setSound] = useLocalStorage(
    'railguard_sound',
    true
  );

  return (
    <>
      <PageHeader
        title="System Settings"
        subtitle="Simple configuration saved in localStorage."
      />

      <div className="settings-grid">
        <div className="panel settings-card">
          <div className="panel-head">
            <div>
              <h3>
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                Appearance
              </h3>

              <small>Choose the console theme</small>
            </div>
          </div>

          <div className="theme-options">
            <button
              className={isDark ? 'theme-option active' : 'theme-option'}
              onClick={() => setTheme('dark')}
            >
              <Moon size={16} />
              <span>
                <strong>Dark Mode</strong>
                <small>Control-room theme</small>
              </span>
            </button>

            <button
              className={!isDark ? 'theme-option active' : 'theme-option'}
              onClick={() => setTheme('light')}
            >
              <Sun size={16} />
              <span>
                <strong>Light Mode</strong>
                <small>Clean daytime theme</small>
              </span>
            </button>
          </div>
        </div>

        <div className="panel settings-card">
          <div className="panel-head">
            <div>
              <h3>
                <TimerReset size={18} />
                Duty Shift
              </h3>

              <small>
                Used on the operations dashboard
              </small>
            </div>
          </div>

          <select
            className="full-input"
            value={shift}
            onChange={(event) =>
              setShift(event.target.value)
            }
          >
            <option>Morning Shift</option>
            <option>Afternoon Shift</option>
            <option>Night Shift</option>
            <option>Emergency Drill</option>
          </select>
        </div>

        <div className="panel settings-card">
          <div className="panel-head">
            <div>
              <h3>
                <MapPin size={18} />
                Operating Zone
              </h3>

              <small>
                Added to new incident reports
              </small>
            </div>
          </div>

          <input
            className="full-input"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
          />
        </div>

        <div className="panel settings-card">
          <div className="panel-head">
            <div>
              <h3>
                <Camera size={18} />
                Camera
              </h3>

              <small>Browser camera module</small>
            </div>
          </div>

          <div className="setting-line">
            <span>Processing</span>
            <strong>Local browser AI</strong>
          </div>

          <div className="setting-line">
            <span>Model</span>
            <strong>COCO-SSD</strong>
          </div>
        </div>

        <div className="panel settings-card">
          <div className="panel-head">
            <div>
              <h3>
                <Zap size={18} />
                Training Options
              </h3>

              <small>
                For classroom and hackathon demos
              </small>
            </div>
          </div>

          <label className="toggle large">
            <input
              type="checkbox"
              checked={simulation}
              onChange={(event) =>
                setSimulation(event.target.checked)
              }
            />
            <span />
            Enable training simulation
          </label>

          <label className="toggle large">
            <input
              type="checkbox"
              checked={sound}
              onChange={(event) =>
                setSound(event.target.checked)
              }
            />
            Play alert sound
          </label>
        </div>

        <div className="panel settings-card">
          <div className="panel-head">
            <div>
              <h3>
                <ShieldCheck size={18} />
                Current Session
              </h3>

              <small>React Context API</small>
            </div>
          </div>

          <div className="setting-value">
            {user.name}
          </div>

          <p>
            Role:{' '}
            {user.role === 'driver'
              ? 'Train Driver'
              : 'Railway Employee'}
          </p>
        </div>
      </div>

      <div className="production-note">
        <ShieldCheck size={20} />

        <div>
          <strong>Production reminder</strong>

          <span>
            Real railway deployment would need secure
            authentication, audit logs, railway-approved
            computer vision, backend services and validated
            safety integration.
          </span>
        </div>
      </div>
    </>
  );
}
