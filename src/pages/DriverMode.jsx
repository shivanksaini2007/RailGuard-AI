import React, { useMemo, useState } from 'react';
import { Bell, Camera, ShieldCheck, TrainFront, MapPin, Clock3, Gauge, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IncidentCard from '../components/IncidentCard';
import PageHeader from '../components/PageHeader';
import { useIncidents } from '../context/IncidentContext';

const TRACKS = Array.from({ length: 12 }, (_, index) => `Track ${String(index + 1).padStart(2, '0')}`);
function readLocation() { try { return JSON.parse(localStorage.getItem('railguard_selected_location_v1')) || { name: 'Central Crossing', track: 'Track 04', km: 'Km 128/4' }; } catch { return { name: 'Central Crossing', track: 'Track 04', km: 'Km 128/4' }; } }

export default function DriverMode() {
  const navigate = useNavigate();
  const { incidents, acknowledgeIncident, acknowledgeAll } = useIncidents();
  const [tripActive, setTripActive] = useState(false);
  const [track, setTrack] = useState(() => readLocation().track || 'Track 04');
  const [locationInfo, setLocationInfo] = useState(readLocation);
  React.useEffect(() => {
    const syncLocation = (event) => { if (event.key !== 'railguard_selected_location_v1' || !event.newValue) return; try { const next = JSON.parse(event.newValue); setLocationInfo(next); setTrack(next.track || 'Track 04'); } catch {} };
    window.addEventListener('storage', syncLocation);
    return () => window.removeEventListener('storage', syncLocation);
  }, []);
  const trackIncidents = useMemo(() => incidents.filter((item) => (item.track || item.track_name || '') === track).sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)), [incidents, track]);
  const active = trackIncidents.find((item) => !['Acknowledged', 'Resolved', 'Closed'].includes(item.status));
  const risk = active?.severity || 'safe';
  const setSelectedTrack = (nextTrack) => {
    setTrack(nextTrack);
    const next = { ...locationInfo, track: nextTrack };
    setLocationInfo(next);
    try { localStorage.setItem('railguard_selected_location_v1', JSON.stringify(next)); } catch {}
  };
  const labelFor = (item) => item.objectName || item.object || item.title || 'Object';

  return <>
    <PageHeader title="Driver Safety Console" subtitle="A dedicated cab view for track-specific incidents sent by the employee camera console.">
      <div className="action-row"><button className="secondary-btn" onClick={() => navigate('/map')}><MapPin size={16}/> Select Track</button><button className="primary-btn" onClick={() => navigate('/alerts')}><Bell size={16}/> All Alerts</button></div>
    </PageHeader>
    <div className={`cab-alert ${risk}`}>
      <div className="cab-status">{risk === 'critical' ? '⚠' : risk === 'high' ? '!' : '✓'}</div>
      <div><span>TRACK-SPECIFIC DRIVER WARNING</span><h2>{active ? `${labelFor(active).toUpperCase()} DETECTED` : 'NO ACTIVE ALERT ON SELECTED TRACK'}</h2><p>{locationInfo.name || 'Selected railway section'} · {track} · {locationInfo.km || 'Location set by employee'}</p>{active && <p style={{marginTop:6}}>Confidence {active.confidence ?? 'N/A'}% · Detected {new Date(active.createdAt || Date.now()).toLocaleTimeString()}</p>}</div>
      <div className="cab-mode"><span className="green-dot"/>{tripActive ? 'TRIP ACTIVE' : 'STANDBY'}</div>
    </div>
    <div className="panel driver-card" style={{marginBottom:18}}>
      <div className="panel-head"><div><h3><TrainFront size={18}/> Track Monitoring</h3><small>Select the same track where the camera incident was reported.</small></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14,padding:16}}>
        <label style={{display:'grid',gap:7,color:'#91a8ba',fontSize:11}}>Selected track<select className="full-input" value={track} onChange={(event)=>setSelectedTrack(event.target.value)}>{TRACKS.map((item)=><option key={item}>{item}</option>)}</select></label>
        <div className="telemetry" style={{margin:0,gridColumn:'span 2'}}><div><span>Track alerts</span><strong>{trackIncidents.length}</strong></div><div><span>Open alerts</span><strong>{trackIncidents.filter((item)=>!['Acknowledged','Resolved','Closed'].includes(item.status)).length}</strong></div><div><span>Track</span><strong>{track.replace('Track ','')}</strong></div><div><span>Trip status</span><strong>{tripActive ? 'ACTIVE' : 'STANDBY'}</strong></div></div>
      </div>
      <div className="trip-controls"><button className={tripActive ? 'danger-btn' : 'primary-btn'} onClick={() => setTripActive((value)=>!value)}>{tripActive ? 'End Demo Trip' : 'Start Demo Trip'}</button><button className="secondary-btn" onClick={()=>navigate('/map')}><MapPin size={15}/> View selected location</button></div>
    </div>
    <div className="driver-grid">
      <div className="panel driver-card"><div className="panel-head"><div><h3><Gauge size={18}/> Cab Status</h3><small>Prototype-only trip monitor</small></div></div><div className="telemetry"><div><span>Speed</span><strong>{tripActive ? '62' : '0'} <small>km/h</small></strong></div><div><span>Track</span><strong>{track.replace('Track ','')}</strong></div><div><span>Location</span><strong style={{fontSize:12}}>{locationInfo.km || 'Demo'}</strong></div><div><span>AI Status</span><strong>{active ? 'ALERT' : 'CLEAR'}</strong></div></div><div className="driver-note" style={{margin:'0 16px'}}><ShieldCheck size={18}/><span>Demo only. This screen does not control real train braking, speed, signals or dispatch.</span></div></div>
      <div className="panel driver-card"><div className="panel-head"><div><h3><Bell size={18}/> Alerts for {track}</h3><small>Shared from employee-side camera detection</small></div><button className="mini-btn" onClick={acknowledgeAll}>Acknowledge all</button></div>{trackIncidents.length ? trackIncidents.map((incident)=><IncidentCard key={incident.id} incident={incident} onAcknowledge={acknowledgeIncident}/>) : <div className="empty-state"><CheckCircle2 size={28}/><span>No incidents recorded for {track} yet.</span><small>Select this track in the map and run the employee camera or Safety Test.</small></div>}</div>
    </div>
    <div className="driver-note"><ShieldCheck size={18}/><span>Alerts include object label, confidence, event time, location and track. Without a backend, synchronization is limited to the same browser profile and same-origin tabs.</span></div>
  </>;
}
