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
import useLocalStorage from '../hooks/useLocalStorage';
import { enableAlertAudio } from '../utils/alertSound';

export default function Camera() {
  const { addIncident } = useIncidents();

  const [simulation, setSimulation] = useState(false);
  const [sound, setSound] = useLocalStorage('railguard_sound', true);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try { return JSON.parse(localStorage.getItem('railguard_selected_location_v1')) || { name: 'Training Yard', track: 'Track 04', km: 'Km 128/4' }; } catch { return { name: 'Training Yard', track: 'Track 04', km: 'Km 128/4' }; }
  });
  const [location, setLocation] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('railguard_selected_location_v1')); return saved ? `${saved.name} • ${saved.track}${saved.km ? ` • ${saved.km}` : ''}` : 'Training Yard • Track 04'; } catch { return 'Training Yard • Track 04'; }
  });
  const [track, setTrack] = useState(() => { try { return JSON.parse(localStorage.getItem('railguard_selected_location_v1'))?.track || 'Track 04'; } catch { return 'Track 04'; } });

  React.useEffect(() => {
    const syncLocation = (event) => {
      if (event.key !== 'railguard_selected_location_v1' || !event.newValue) return;
      try { const next = JSON.parse(event.newValue); setSelectedLocation(next); setTrack(next.track || 'Track 04'); setLocation(`${next.name} • ${next.track || 'Track 04'}${next.km ? ` • ${next.km}` : ''}`); } catch {}
    };
    window.addEventListener('storage', syncLocation);
    return () => window.removeEventListener('storage', syncLocation);
  }, []);

  const displayObjectName = (name) => ({ person: 'Human', 'cell phone': 'Phone', cow: 'Cow', dog: 'Dog', cat: 'Cat', horse: 'Horse', sheep: 'Sheep', backpack: 'Backpack', suitcase: 'Suitcase', bicycle: 'Bicycle', motorcycle: 'Motorcycle', car: 'Car', truck: 'Truck', bus: 'Bus', bottle: 'Bottle', chair: 'Chair', handbag: 'Handbag', laptop: 'Laptop', book: 'Book', umbrella: 'Umbrella' }[String(name || '').toLowerCase()] || String(name || 'Object').replace(/^./, (c) => c.toUpperCase()));
  const [snapshotUrl, setSnapshotUrl] = useState('');

  const lastTestRef = useRef(0);

  const onDetection = useCallback(
    (item) => {
      const now = Date.now();

      if (now - lastTestRef.current < 7000) {
        return;
      }

      lastTestRef.current = now;

      addIncident({
        object: displayObjectName(item.class),
        objectName: displayObjectName(item.class),
        title: `${displayObjectName(item.class)} Detected`,
        category: 'AI Camera Detection',
        track,
        track_name: track,
        location,
        confidence: item.confidence,
        severity: item.severity,
        camera: 'Laptop Webcam',
        source: 'Browser AI',
        details: `${displayObjectName(item.class)} detected at ${new Date().toLocaleTimeString()} at ${location}. AI confidence: ${item.confidence}%. Please verify the track visually.`,
      });
    },
    [addIncident, location, track, sound]
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
    enableAlertAudio();
    addIncident({
      object: 'Cow',
      objectName: 'Cow',
      title: 'Animal on Track',
      category: 'Track Obstruction',
      track,
      track_name: track,
      location,
      confidence: 94,
      severity: 'critical',
      camera: 'Training Scenario',
      source: 'Manual Safety Test',
      details: `Human/animal safety drill at ${new Date().toLocaleTimeString()} for ${location}. This is a synthetic test, not a real detection.`,
    });
  };

  const handleStartCamera = () => {
    enableAlertAudio();
    startCamera();
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
        subtitle="Real-time webcam detection with TensorFlow.js and COCO-SSD"
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
              onClick={handleStartCamera}
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
                  ? 'Camera active • COCO-SSD is checking each frame'
                  : cameraState === 'starting'
                    ? 'Requesting camera and loading AI model…'
                    : 'Start the camera to detect people, animals and common objects'}
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
              // Keep the overlay unmirrored: useCamera mirrors box positions
              // while drawing labels normally, so 'person' stays readable.
            />

            {cameraState !== 'live' && (
              <div className="camera-placeholder">
                <div className="camera-placeholder-icon">
                  <CameraIcon size={38} />
                </div>

                <strong>
                  {cameraState === 'error'
                    ? 'Camera could not start'
                    : cameraState === 'starting'
                      ? 'Starting camera and AI…'
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
                <small>COCO-SSD • TensorFlow.js • common object detection</small>
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
                  <strong>{displayObjectName(item.class)}</strong>
                </div>

                <span>{item.confidence}%</span>
              </div>
            ))}

            {!detections.length && (
              <div className="empty-state">
                <CameraIcon size={28} />
                <span>
                  {cameraState === 'live'
                    ? 'No objects detected in the current frame. Try moving closer or improving the lighting.'
                    : 'Start the camera to see live object detections here.'}
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
              <span>Track</span>
              <select value={track} onChange={(event) => { setTrack(event.target.value); const next = { ...selectedLocation, track: event.target.value }; setSelectedLocation(next); try { localStorage.setItem('railguard_selected_location_v1', JSON.stringify(next)); } catch {} setLocation(`${next.name || 'Selected Location'} • ${event.target.value}${next.km ? ` • ${next.km}` : ''}`); }} className="full-input" style={{maxWidth:180,padding:7}}>{Array.from({length:12},(_,i)=>`Track ${String(i+1).padStart(2,'0')}`).map((item) => <option key={item}>{item}</option>)}</select>
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
            Browser camera → TensorFlow.js → COCO-SSD object model →
            confidence filtering → bounding boxes → safety rules → incident report.
            The model can detect common COCO classes (such as people, dogs, cows,
            cars and bicycles). It is a prototype object detector, not a certified
            railway-track intrusion detector.
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
