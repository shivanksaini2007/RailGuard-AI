import React, { useEffect, useMemo, useState } from 'react';
import { Camera, MapPin, ShieldCheck, TrainFront, Search, SlidersHorizontal, AlertTriangle, CheckCircle2, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const LOCATION_KEY = 'railguard_selected_location_v1';
const locations = [
  { id: 'C-01', name: 'North Junction', type: 'camera', status: 'safe', track: 'Track 01', km: 'Km 101/2', x: 17, y: 27, detail: 'Camera point · Ready for monitoring' },
  { id: 'INC-1004', name: 'Central Crossing', type: 'incident', status: 'critical', track: 'Track 04', km: 'Km 128/4', x: 53, y: 39, detail: 'Track section · Monitor for hazards' },
  { id: 'C-07', name: 'East Track Camera', type: 'camera', status: 'warning', track: 'Track 07', km: 'Km 156/2', x: 77, y: 28, detail: 'Camera point · Ready for monitoring' },
  { id: 'TR-12957', name: 'South Yard', type: 'train', status: 'safe', track: 'Track 03', km: 'Km 134/6', x: 36, y: 70, detail: 'Railway section · Ready for monitoring' },
  { id: 'INC-1003', name: 'Platform Approach', type: 'incident', status: 'high', track: 'Track 02', km: 'Km 105/2', x: 72, y: 73, detail: 'Track section · Monitor for hazards' },
];
const fallback = locations[1];
function readSelection() {
  try { return JSON.parse(localStorage.getItem(LOCATION_KEY)) || fallback; } catch { return fallback; }
}

export default function RailwayMap() {
  const [selected, setSelected] = useState(readSelection);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [customName, setCustomName] = useState('');
  const [customTrack, setCustomTrack] = useState('Track 04');
  const [saved, setSaved] = useState(false);
  useEffect(() => { try { localStorage.setItem(LOCATION_KEY, JSON.stringify(selected)); } catch {} }, [selected]);
  const choose = (point) => { setSelected(point); setCustomName(''); setSaved(false); };
  const visible = useMemo(() => locations.filter((point) => {
    const matchesText = `${point.name} ${point.id} ${point.km} ${point.track}`.toLowerCase().includes(query.toLowerCase());
    const matchesType = filter === 'all' || point.type === filter || point.status === filter;
    return matchesText && matchesType;
  }), [query, filter]);
  const saveCustom = (event) => {
    event.preventDefault();
    const name = customName.trim();
    if (!name) return;
    setSelected({ id: `CUSTOM-${Date.now()}`, name, type: 'camera', status: 'warning', track: customTrack, km: 'User-selected section', x: 50, y: 50, detail: 'Custom demo location selected by employee' });
    setSaved(true);
  };

  return <>
    <PageHeader title="Railway Map & Track Selection" subtitle="Select a map point or enter a custom demo location. Your selection is shared with the camera and driver alert screens in this browser.">
      <span className="system-chip"><ShieldCheck size={14} /> LOCATION SYNC</span>
    </PageHeader>
    <section className="map-toolbar panel">
      <label className="map-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location, track or kilometre…" /></label>
      <label className="map-filter"><SlidersHorizontal size={15}/><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All locations</option><option value="camera">Camera points</option><option value="train">Rail sections</option><option value="incident">Incident sections</option></select></label>
      <span className="map-live"><i/> Selection saved locally</span>
    </section>
    <div className="interactive-map-layout">
      <section className="panel interactive-map" aria-label="Illustrative railway map">
        <div className="map-top-label"><span><MapPin size={14}/> RAIL NETWORK OVERVIEW</span><small>Illustrative demo map · not live GIS</small></div>
        <div className="map-landscape">
          <div className="map-river"/><div className="map-road road-a"/><div className="map-road road-b"/><div className="map-road road-c"/>
          <svg className="rail-lines" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 390 C130 320 190 360 290 245 S500 140 820 80"/><path d="M-20 410 C130 340 210 380 310 265 S520 160 820 100"/><path d="M80 -20 C150 100 230 170 330 245 S510 360 690 520"/><path className="rail-dash" d="M-20 400 C130 330 200 370 300 255 S510 150 820 90"/></svg>
          {visible.map((point) => { const Icon = point.type === 'camera' ? Camera : point.type === 'train' ? TrainFront : AlertTriangle; return <button key={point.id} type="button" className={`map-pin ${point.status} ${selected.id === point.id ? 'selected' : ''}`} style={{left:`${point.x}%`,top:`${point.y}%`}} onClick={() => choose(point)} aria-label={`Select ${point.name}`}><Icon size={16}/><span>{point.track.replace('Track ','T')}</span></button>; })}
          <div className="map-compass">N <span>↑</span></div><div className="map-legend"><span><i className="legend-blue"/> Camera</span><span><i className="legend-green"/> Rail section</span><span><i className="legend-amber"/> Monitor</span><span><i className="legend-red"/> Incident section</span></div>
        </div>
        <div className="map-bottom-note"><ShieldCheck size={15}/> This is a demo map. Selecting a location synchronizes its name and track to the camera and driver views.</div>
      </section>
      <aside className="map-details-column">
        <section className="panel map-detail-card">
          <div className="map-detail-head"><span className={`map-detail-icon ${selected.status}`}>{selected.type === 'camera' ? <Camera size={19}/> : selected.type === 'train' ? <TrainFront size={19}/> : <AlertTriangle size={19}/>}</span><span className={`map-status ${selected.status}`}>{selected.status.toUpperCase()}</span></div>
          <span className="section-eyebrow">CURRENTLY SELECTED</span><h2>{selected.name}</h2><p>{selected.detail}</p>
          <div className="map-detail-row"><span>Track</span><strong>{selected.track}</strong></div><div className="map-detail-row"><span>Track position</span><strong>{selected.km}</strong></div><div className="map-detail-row"><span>Reference ID</span><strong>{selected.id}</strong></div>
          <div className="map-bottom-note"><CheckCircle2 size={15}/> This selection is active for the camera.</div>
        </section>
        <section className="panel map-location-list"><div className="map-list-title"><strong>Available track sections</strong><span>{visible.length} shown</span></div>
          {visible.map((point) => <button key={point.id} className={`map-location-item ${selected.id === point.id ? 'active' : ''}`} onClick={() => choose(point)}><span className={`location-mini ${point.status}`}>{point.type === 'camera' ? <Camera size={15}/> : point.type === 'train' ? <TrainFront size={15}/> : <AlertTriangle size={15}/>}</span><span><strong>{point.name}</strong><small>{point.track} · {point.km}</small></span>{selected.id === point.id ? <Check size={15}/> : <span className={`location-status ${point.status}`}><i/></span>}</button>)}
        </section>
        <section className="panel map-detail-card">
          <span className="section-eyebrow">CUSTOM DEMO LOCATION</span><h3 style={{margin:'7px 0'}}>Set a location manually</h3><form onSubmit={saveCustom} style={{display:'grid',gap:10}}><input className="full-input" value={customName} onChange={(event)=>setCustomName(event.target.value)} placeholder="e.g. Alwar Yard North"/><select className="full-input" value={customTrack} onChange={(event)=>setCustomTrack(event.target.value)}>{Array.from({length:12},(_,i)=>`Track ${String(i+1).padStart(2,'0')}`).map(track=><option key={track}>{track}</option>)}</select><button className="primary-btn" type="submit"><MapPin size={15}/> Use this location</button>{saved && <small style={{color:'#35ddb4'}}>Location saved. Open Camera to detect at this selected track.</small>}</form>
        </section>
      </aside>
    </div>
  </>;
}
