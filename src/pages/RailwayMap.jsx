import React from 'react';
import { Camera, MapPin, ShieldCheck, TrainFront } from 'lucide-react';

import PageHeader from '../components/PageHeader';

const points = [
  ['Track 01', 'safe', '20%', '28%'],
  ['Camera 04', 'danger', '56%', '52%'],
  ['Track 07', 'warning', '75%', '74%'],
];

export default function RailwayMap() {
  return (
    <>
      <PageHeader
        title="Railway Map"
        subtitle="Simple visual railway zone for the hackathon demonstration."
      >
        <span className="system-chip">
          <ShieldCheck size={14} />
          GIS READY
        </span>
      </PageHeader>

      <div className="panel map-card">
        <div className="map-track one" />
        <div className="map-track two" />
        <div className="map-track three" />

        {points.map(([name, type, left, top]) => (
          <div
            className={`map-point ${type}`}
            key={name}
            style={{ left, top }}
          >
            <MapPin size={18} />
            <span>{name}</span>
          </div>
        ))}

        <div
          className="map-point safe"
          style={{ left: '42%', top: '43%' }}
        >
          <Camera size={18} />
          <span>Camera Network</span>
        </div>

        <div
          className="map-point warning"
          style={{ left: '33%', top: '70%' }}
        >
          <TrainFront size={18} />
          <span>Train 12957</span>
        </div>

        <div className="map-legend">
          <span>
            <i className="safe-dot" /> Track clear
          </span>
          <span>
            <i className="warning-dot" /> Monitor
          </span>
          <span>
            <i className="danger-dot" /> Alert
          </span>
        </div>
      </div>

      <div className="camera-note">
        <MapPin size={17} />

        <div>
          <strong>Map concept</strong>
          <span>
            This is a frontend demo map. A real system could
            connect it to GIS/railway infrastructure data.
          </span>
        </div>
      </div>
    </>
  );
}
