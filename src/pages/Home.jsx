import React, { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  MapPin,
  Radio,
  ShieldCheck,
  Siren,
  TimerReset,
  TrainFront,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import IncidentCard from '../components/IncidentCard';
import PageHeader from '../components/PageHeader';
import { useIncidents } from '../context/IncidentContext';

export default function Home() {
  const navigate = useNavigate();
  const {
    incidents,
    addIncident,
    acknowledgeAll,
  } = useIncidents();

  const stats = useMemo(() => {
    const open = incidents.filter(
      (item) => item.status === 'Open'
    );

    const critical = incidents.filter(
      (item) => item.severity === 'critical'
    );

    const average = incidents.length
      ? Math.round(
          incidents.reduce(
            (sum, item) => sum + item.confidence,
            0
          ) / incidents.length
        )
      : 0;

    return {
      open: open.length,
      critical: critical.length,
      average,
    };
  }, [incidents]);

  const safetyTest = () => {
    const incident = addIncident({
      object: 'Cow',
      objectName: 'Cow',
      title: 'Animal on Track',
      category: 'Track Obstruction',
      track: 'Track 04',
      location: 'Training Yard • Track 04',
      confidence: 94,
      severity: 'critical',
      camera: 'Training Scenario',
      source: 'Manual Safety Test',
      details:
        'Synthetic safety alert created for the hackathon demo.',
    });

    navigate(`/alerts/${incident.id}`);
  };

  return (
    <>
      <PageHeader
        title="Operations Overview"
        subtitle="Live railway safety status for authorized personnel"
      >
        <button
          className="primary-btn"
          onClick={() => navigate('/camera')}
        >
          <Camera size={17} />
          Open AI Camera
        </button>
      </PageHeader>

      <div className="overview-grid">
        <div className="ops-strip">
          <span>
            <span className="green-dot" />
            Morning Shift
          </span>

          <span>
            <MapPin size={15} />
            Zone 04 • Track 04
          </span>

          <span>
            <TimerReset size={15} />
            Shift monitoring active
          </span>

          <span>
            <ShieldCheck size={15} />
            Control room profile
          </span>
        </div>

        <div
          className={`status-hero ${
            stats.critical > 0 ? 'critical' : ''
          }`}
        >
          <div className="hero-top">
            <div className="hero-icon">
              <ShieldCheck size={30} />
            </div>

            <div>
              <span className="eyebrow">
                RAILGUARD SAFETY MONITOR
              </span>

              <h2>
                {stats.critical > 0
                  ? 'Review active safety alerts'
                  : 'Monitoring clear'}
              </h2>

              <p>
                Open the AI Camera to test browser-based
                object detection or use the Safety Test.
              </p>
            </div>
          </div>

          <div className="hero-metrics">
            <div>
              <span>AI model</span>
              <strong>COCO-SSD</strong>
            </div>

            <div>
              <span>Open alerts</span>
              <strong>{stats.open}</strong>
            </div>

            <div>
              <span>Average confidence</span>
              <strong>{stats.average}%</strong>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <Stat
            label="Active Alerts"
            value={stats.open}
            hint="Awaiting review"
            icon={AlertTriangle}
            tone="red"
          />

          <Stat
            label="Incidents"
            value={incidents.length}
            hint="Saved locally"
            icon={Radio}
            tone="blue"
          />

          <Stat
            label="System Health"
            value="Ready"
            hint="Browser prototype"
            icon={ShieldCheck}
            tone="green"
          />

          <Stat
            label="Track Zone"
            value="04"
            hint="Training Yard"
            icon={MapPin}
            tone="violet"
          />
        </div>
      </div>

      <div className="section-row">
        <div>
          <h3>Control Room Actions</h3>
          <p>
            Simple controls for a railway safety demonstration.
          </p>
        </div>

        <div className="action-row">
          <button
            className="secondary-btn"
            onClick={safetyTest}
          >
            <Siren size={17} />
            Run Safety Test
          </button>

          <button
            className="secondary-btn"
            onClick={acknowledgeAll}
          >
            <CheckCircle2 size={17} />
            Acknowledge Alerts
          </button>
        </div>
      </div>

      <div className="lower-grid">
        <div className="panel live-summary">
          <div className="panel-head">
            <div>
              <h3>
                <Activity size={18} />
                Live Safety Summary
              </h3>

              <small>
                React state + Context API incident stream
              </small>
            </div>

            <span className="live-dot">READY</span>
          </div>

          <div className="detection-list">
            {incidents.length ? (
              incidents.slice(0, 4).map((incident) => (
                <div
                  className={`detection-row ${incident.severity}`}
                  key={incident.id}
                >
                  <div className="detection-name">
                    <span className="det-dot" />
                    <strong>{incident.title}</strong>
                  </div>

                  <span>{incident.confidence}%</span>

                  <small>{incident.track}</small>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <TrainFront size={28} />
                <span>No incidents yet.</span>
              </div>
            )}
          </div>
        </div>

        <div className="panel report-preview">
          <div className="panel-head">
            <div>
              <h3>
                <FileTextIcon />
                Latest Incident
              </h3>
              <small>
                Dynamic data from IncidentContext
              </small>
            </div>
          </div>

          {incidents[0] ? (
            <IncidentCard incident={incidents[0]} />
          ) : (
            <div className="empty-state">
              <CheckCircle2 size={28} />
              <span>No incident available.</span>
            </div>
          )}
        </div>
      </div>

      <div className="camera-note">
        <Zap size={17} />

        <div>
          <strong>Why this project is useful for a hackathon</strong>
          <span>
            It connects camera input, object detection, safety
            rules, incident CRUD, routing, browser storage and
            a railway-style operations interface in one project.
          </span>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, hint, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
    </div>
  );
}

function FileTextIcon() {
  return <Activity size={18} />;
}
