import React from 'react';
import { Camera, Gauge, MapPin, TrainFront } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IncidentCard({
  incident,
  onAcknowledge,
}) {
  const severity = incident.severity || 'medium';

  return (
    <div className={`incident-card ${severity}`}>
      <div className="incident-top">
        <span className={`severity-badge ${severity}`}>
          {severity.toUpperCase()}
        </span>

        <span>
          {new Date(
            incident.createdAt || Date.now()
          ).toLocaleString()}
        </span>
      </div>

      <h4>{incident.title}</h4>
      <p><strong style={{color:'#c9d9e7'}}>Object:</strong> {incident.objectName || incident.object || incident.title} · <strong style={{color:'#c9d9e7'}}>Track:</strong> {incident.track || 'Track not set'}</p>
      <p style={{marginTop:6}}>{incident.details}</p>

      <div className="incident-meta">
        <span>
          <MapPin size={14} />
          {incident.location}
        </span>

        <span>
          <Camera size={14} />
          {incident.camera}
        </span>

        <span>
          <TrainFront size={14} />
          {incident.track || 'Track not set'}
        </span>

        <span>
          <Gauge size={14} />
          {incident.confidence}%
        </span>
      </div>

      <div className="action-row" style={{ marginTop: 12 }}>
        <Link className="mini-btn" to={`/alerts/${incident.id}`}>
          Details
        </Link>

        {incident.status === 'Open' && onAcknowledge && (
          <button
            className="mini-btn"
            onClick={() => onAcknowledge(incident.id)}
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}
