import React, { useState } from 'react';
import {
  Bell,
  Camera,
  ShieldCheck,
  TrainFront,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import IncidentCard from '../components/IncidentCard';
import PageHeader from '../components/PageHeader';
import { useIncidents } from '../context/IncidentContext';

export default function DriverMode() {
  const navigate = useNavigate();
  const { incidents, addIncident } = useIncidents();

  const [tripActive, setTripActive] = useState(false);

  const active = incidents.find(
    (item) => item.status === 'Open'
  );

  const risk = active?.severity || 'safe';

  const runDrill = () => {
    addIncident({
      object: 'Cow',
      objectName: 'Cow',
      title: 'Animal on Track',
      category: 'Driver Drill',
      track: 'Track 04',
      location: 'Training Yard • Track 04',
      confidence: 94,
      severity: 'critical',
      camera: 'Driver Drill',
      source: 'Training Simulation',
      details:
        'Synthetic driver-mode alert for the hackathon demo.',
    });
  };

  return (
    <>
      <PageHeader
        title="Driver Cab Mode"
        subtitle="Minimal high-visibility safety information for the train-driver demo."
      >
        <div className="action-row">
          <button
            className="secondary-btn"
            onClick={runDrill}
          >
            Run Drill Alert
          </button>

          <button
            className="primary-btn"
            onClick={() => navigate('/camera')}
          >
            <Camera size={16} />
            Open Camera
          </button>
        </div>
      </PageHeader>

      <div className={`cab-alert ${risk}`}>
        <div className="cab-status">
          {risk === 'critical'
            ? '⚠'
            : risk === 'high'
              ? '!'
              : '✓'}
        </div>

        <div>
          <span>DRIVER SAFETY STATUS</span>

          <h2>
            {risk === 'critical'
              ? 'CAUTION — REVIEW TRACK AHEAD'
              : risk === 'high'
                ? 'CAUTION — OBJECT DETECTED'
                : 'TRACK AHEAD CLEAR'}
          </h2>

          <p>
            Training Yard • Track 04 •{' '}
            {incidents.length} saved event(s)
          </p>
        </div>

        <div className="cab-mode">
          <span className="green-dot" />
          {tripActive ? 'TRIP ACTIVE' : 'STANDBY'}
        </div>
      </div>

      <div className="driver-grid">
        <div className="panel driver-card">
          <div className="panel-head">
            <div>
              <h3>
                <TrainFront size={18} />
                Trip Monitor
              </h3>

              <small>
                Demo-only cab telemetry
              </small>
            </div>
          </div>

          <div className="trip-controls">
            <button
              className={
                tripActive
                  ? 'danger-btn'
                  : 'primary-btn'
              }
              onClick={() =>
                setTripActive((value) => !value)
              }
            >
              {tripActive
                ? 'End Demo Trip'
                : 'Start Demo Trip'}
            </button>
          </div>

          <div className="telemetry">
            <div>
              <span>Speed</span>
              <strong>
                {tripActive ? '62' : '0'}{' '}
                <small>km/h</small>
              </strong>
            </div>

            <div>
              <span>Track</span>
              <strong>04</strong>
            </div>

            <div>
              <span>Next Marker</span>
              <strong>128/4</strong>
            </div>

            <div>
              <span>AI State</span>
              <strong>
                {risk === 'critical'
                  ? 'ALERT'
                  : 'CLEAR'}
              </strong>
            </div>
          </div>
        </div>

        <div className="panel driver-card">
          <div className="panel-head">
            <div>
              <h3>
                <Bell size={18} />
                Driver Alerts
              </h3>

              <small>
                Only safety-relevant events
              </small>
            </div>
          </div>

          {active ? (
            <IncidentCard incident={active} />
          ) : (
            <div className="empty-state">
              <ShieldCheck size={28} />
              <span>No active driver alerts.</span>
            </div>
          )}
        </div>
      </div>

      <div className="driver-note">
        <ShieldCheck size={18} />
        <span>
          This is a student interface prototype. It must
          not control train speed, braking, signaling or
          dispatch decisions.
        </span>
      </div>
    </>
  );
}
