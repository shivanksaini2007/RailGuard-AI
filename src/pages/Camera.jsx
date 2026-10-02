import React, { useCallback, useRef, useState } from 'react';
import {
  Camera as CameraIcon,
  RefreshCcw,
  ShieldCheck,
  Siren,
  Square,
  Video,
} from 'lucide-react';

import PageHeader from '../components/PageHeader';
import { useIncidents } from '../context/IncidentContext';
import useCamera from '../hooks/useCamera';

export default function Camera() {
  const { addIncident } = useIncidents();

  const [simulation, setSimulation] = useState(false);
  const [sound, setSound] = useState(true);
  const [location, setLocation] = useState(
    'Training Yard • Track 04'
  );
  const [snapshotUrl, setSnapshotUrl] = useState('');

  const lastTestRef = useRef(0);

  const onDetection = useCallback(
    (item) => {
      if (
        item.severity !== 'critical' &&
        item.severity !== 'high'
      ) {
        return;
      }

      const now = Date.now();

      if (now - lastTestRef.current < 7000) {
        return;
      }

      lastTestRef.current = now;

      addIncident({
        object: item.class,
        objectName: item.class,
        title: item.label,
        category: 'AI Camera Detection',
        track: 'Track 04',
        location,
        confidence: item.confidence,
        severity: item.severity,
        camera: 'Laptop Webcam',
        source: 'Browser AI',
        details:
          'Object detected by the browser COCO-SSD model.',
      });
    },
    [addIncident, location]
  );

  const {
    videoRef,
    canvasRef,
    cameraState,
    modelState,
    cameraError,
    detections,
    risk,
    fps,
    facingMode,
    startCamera,
    stopCamera,
    switchCamera,
    captureSnapshot,
  } = useCamera({ onDetection });

  const runSafetyTest = () => {
    addIncident({
      object: 'Cow',
      objectName: 'Cow',
      title: 'Animal on Track',
      category: 'Track Obstruction',
      track: 'Track 04',
      location,
      confidence: 94,
      severity: 'critical',
      camera: 'Training Scenario',
      source: 'Manual Safety Test',
      details:
        'Synthetic training event generated for the hackathon demo.',
    });
  };

  const snapshot = () => {
    const image = captureSnapshot();

    if (image) {
      setSnapshotUrl(image);
    }
  };

  const highestRisk =
    risk === 'critical'
      ? 'CRITICAL'
      : risk === 'high'
        ? 'HIGH'
        : risk === 'medium'
          ? 'MEDIUM'
          : 'SAFE';

  return (
    <>
      <PageHeader
        title="AI Camera"
        subtitle="Laptop/webcam testing with browser-based object detection"
      >
        <div className="action-row">
          <button
            className="secondary-btn"
            onClick={switchCamera}
          >
            <RefreshCcw size={16} />
            Flip Camera
          </button>

          {cameraState === 'live' ? (
            <button
              className="danger-btn"
              onClick={stopCamera}
            >
              <Square size={15} />
              Stop Camera
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={startCamera}
            >
              <Video size={17} />
              Start Camera
            </button>
          )}
        </div>
      </PageHeader>

      <div className="camera-layout">
        <div className="camera-panel panel">
          <div className="panel-head camera-head">
            <div>
              <h3>
                <CameraIcon size={18} />
                Laptop Webcam
              </h3>

              <small>
                {cameraState === 'live'
                  ? 'Camera active • local AI inference'
                  : 'Camera is not active'}
              </small>
            </div>

            <div
              className={`camera-state ${
                cameraState === 'live'
                  ? 'live'
                  : cameraState === 'error'
                    ? 'error'
                    : ''
              }`}
            >
              <span />
              {cameraState === 'live'
                ? 'LIVE'
                : cameraState === 'starting'
                  ? 'STARTING'
                  : 'OFFLINE'}
            </div>
          </div>

          <div className="video-wrap">
            <video
              ref={videoRef}
              className="camera-video"
              muted
              playsInline
              autoPlay
              style={{
                transform:
                  facingMode === 'user'
                    ? 'scaleX(-1)'
                    : 'none',
              }}
            />

            <canvas
              ref={canvasRef}
              className="overlay"
            />

            {cameraState !== 'live' && (
              <div className="camera-placeholder">
                <div className="camera-placeholder-icon">
                  <CameraIcon size={38} />
                </div>

                <strong>
                  {cameraState === 'error'
                    ? 'Camera could not start'
                    : 'Ready for laptop camera'}
                </strong>

                <span>
                  {cameraError ||
                    'Click Start Camera and allow browser camera permission.'}
                </span>
              </div>
            )}

            <div className="video-status">
              <span>
                <span className="green-dot" />
                {modelState === 'ready'
                  ? 'AI READY'
                  : 'AI STANDBY'}
              </span>

              <span>{fps} FPS</span>

              <span>
                {cameraState === 'live'
                  ? 'REAL-TIME'
                  : 'STANDBY'}
              </span>
            </div>
          </div>

          <div className="camera-controls">
            <button
              className="secondary-btn"
              onClick={runSafetyTest}
            >
              <Siren size={16} />
              Safety Test
            </button>

            <button
              className="secondary-btn"
              onClick={snapshot}
            >
              <CameraIcon size={16} />
              Snapshot
            </button>

            <label className="toggle">
              <input
                type="checkbox"
                checked={simulation}
                onChange={(event) =>
                  setSimulation(event.target.checked)
                }
              />
              <span />
              Training Simulation
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={sound}
                onChange={(event) =>
                  setSound(event.target.checked)
                }
              />
              <span />
              Alert Sound
            </label>
          </div>
        </div>

        <div className="camera-side">
          <div className={`risk-panel ${risk}`}>
            <div className="risk-kicker">
              CURRENT SAFETY STATUS
            </div>

            <div className="risk-value">
              {highestRisk}
            </div>

            <p>
              {risk === 'critical'
                ? 'Immediate review required.'
                : risk === 'high'
                  ? 'High-priority event detected.'
                  : risk === 'medium'
                    ? 'Monitor the detected object.'
                    : 'No high-risk object currently detected.'}
            </p>
          </div>

          <div className="panel detection-panel">
            <div className="panel-head">
              <div>
                <h3>Live Detections</h3>
                <small>COCO-SSD browser model</small>
              </div>

              <span className="count-chip">
                {detections.length}
              </span>
            </div>

            {detections.map((item, index) => (
              <div
                className={`detection-row ${item.severity}`}
                key={`${item.class}-${index}`}
              >
                <div className="detection-name">
                  <span className="det-dot" />
                  <strong>{item.class}</strong>
                </div>

                <span>{item.confidence}%</span>
              </div>
            ))}

            {!detections.length && (
              <div className="empty-state">
                <CameraIcon size={28} />
                <span>
                  No objects detected yet.
                </span>
              </div>
            )}
          </div>

          <div className="panel config-panel">
            <div className="panel-head">
              <div>
                <h3>Test Configuration</h3>
                <small>Safe demo controls</small>
              </div>
            </div>

            <div className="config-row">
              <span>Location</span>

              <input
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />
            </div>

            <div className="config-row">
              <span>Processing</span>
              <strong>Local Browser AI</strong>
            </div>

            <div className="config-row">
              <span>Mode</span>
              <strong>
                {simulation ? 'Training' : 'Camera'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="camera-note">
        <ShieldCheck size={17} />

        <div>
          <strong>How the demo works</strong>

          <span>
            Browser camera → TensorFlow.js → COCO-SSD →
            safety rules → React state → incident report.
            Camera processing happens in the browser for this
            prototype.
          </span>
        </div>
      </div>

      {snapshotUrl && (
        <div
          className="modal-backdrop"
          onClick={() => setSnapshotUrl('')}
        >
          <div
            className="snapshot-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <strong>Captured frame</strong>

              <button
                className="icon-only"
                onClick={() => setSnapshotUrl('')}
              >
                ×
              </button>
            </div>

            <img
              src={snapshotUrl}
              alt="Captured camera frame"
            />

            <a
              className="download-btn"
              href={snapshotUrl}
              download={`railguard-${Date.now()}.jpg`}
            >
              Save Snapshot
            </a>
          </div>
        </div>
      )}
    </>
  );
}
