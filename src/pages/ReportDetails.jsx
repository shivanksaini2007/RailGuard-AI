import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  ShieldAlert,
} from 'lucide-react';

import PageHeader from '../components/PageHeader';
import { useIncidents } from '../context/IncidentContext';

export default function ReportDetails() {
  const { id } = useParams();
  const {
    incidents,
    acknowledgeIncident,
  } = useIncidents();

  const incident = incidents.find(
    (item) => item.id === id
  );

  if (!incident) {
    return (
      <div className="empty-state">
        <h2>Incident not found</h2>
        <Link to="/alerts">Back to Incident Center</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Incident ${incident.id}`}
        subtitle="Dynamic route using React Router useParams()."
      >
        <Link
          className="secondary-btn"
          to="/alerts"
        >
          Back
        </Link>
      </PageHeader>

      <article className="panel learning-card">
        <div
          className={`severity-badge ${incident.severity}`}
        >
          <ShieldAlert size={14} />{' '}
          {incident.severity.toUpperCase()}
        </div>

        <h2>{incident.title}</h2>

        <p>{incident.details}</p>

        <div className="concept-grid">
          <Info label="Object" value={incident.objectName} />
          <Info label="Confidence" value={`${incident.confidence}%`} />
          <Info label="Location" value={incident.location} />
          <Info label="Track" value={incident.track} />
          <Info label="Source" value={incident.source} />
          <Info label="Status" value={incident.status} />
        </div>

        {incident.status === 'Open' && (
          <button
            className="primary-btn"
            onClick={() =>
              acknowledgeIncident(incident.id)
            }
            style={{ marginTop: 18 }}
          >
            <CheckCircle2 size={15} />
            Acknowledge Incident
          </button>
        )}

        <div
          className="camera-note"
          style={{ marginTop: 18 }}
        >
          <MapPin size={17} />
          <div>
            <strong>Demo note</strong>
            <span>
              Incident information is stored in localStorage
              for this student project.
            </span>
          </div>
        </div>
      </article>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="concept-item">
      <strong>{label}</strong>
      <small>{value}</small>
    </div>
  );
}
