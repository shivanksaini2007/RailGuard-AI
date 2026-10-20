import React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isAlertSoundEnabled, playAlertSound } from '../utils/alertSound';
import { initialIncidents } from '../data/incidents';

const IncidentContext = createContext(null);
const STORAGE_KEY = 'railguard_shared_incidents_v1';

const normalize = (row) => ({
  ...row,
  id: row.incident_code || row.id,
  title: row.title || row.objectName || 'Safety incident',
  objectName: row.object_name || row.objectName || row.object || '',
  severity: String(row.severity || 'medium').toLowerCase(),
  status: row.status || 'Open',
  location: row.location || '',
  track: row.track_name || row.track || '',
  description: row.description || row.details || '',
  confidence: row.confidence == null ? null : Number(row.confidence),
  createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  imageUrl: row.image_url || row.imageUrl || null,
});

function readIncidents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).map(normalize);
  } catch {
    // Recover with the sample incidents if local browser data is unavailable.
  }
  return initialIncidents.map(normalize);
}

function saveIncidents(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* Browser storage may be disabled. */ }
}

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(readIncidents);
  const [incidentsLoading] = useState(false);
  const [incidentsError, setIncidentsError] = useState('');

  useEffect(() => {
    saveIncidents(incidents);
  }, [incidents]);

  // Keep employee and driver tabs in sync using browser storage events.
  useEffect(() => {
    const syncFromOtherTab = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try { setIncidents(JSON.parse(event.newValue).map(normalize)); } catch { /* Ignore malformed local data. */ }
    };
    window.addEventListener('storage', syncFromOtherTab);
    return () => window.removeEventListener('storage', syncFromOtherTab);
  }, []);

  const refreshIncidents = useCallback(async () => {
    setIncidents(readIncidents());
    setIncidentsError('');
  }, []);

  const addIncident = useCallback(async (data) => {
    const incident = normalize({
      ...data,
      id: `INC-${Date.now().toString().slice(-7)}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
    });
    if (['critical', 'high'].includes(incident.severity) && isAlertSoundEnabled()) {
      playAlertSound(`Warning. ${incident.title}. ${incident.location ? `Location ${incident.location}.` : ''} Please check the railway track.`);
    }
    setIncidents((current) => [incident, ...current.filter((item) => item.id !== incident.id)]);
    return incident;
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    let updated;
    setIncidents((current) => current.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, status, acknowledged: status === 'Acknowledged' };
      return updated;
    }));
    return updated;
  }, []);

  const acknowledgeIncident = useCallback((id) => updateStatus(id, 'Acknowledged'), [updateStatus]);
  const acknowledgeAll = useCallback(async () => {
    setIncidents((current) => current.map((item) => (
      ['Acknowledged', 'Resolved', 'Closed'].includes(item.status)
        ? item
        : { ...item, status: 'Acknowledged', acknowledged: true }
    )));
  }, []);
  const clearIncidents = useCallback(() => {
    setIncidents([]);
    setIncidentsError('Demo incidents cleared from this browser.');
  }, []);

  const value = useMemo(() => ({ incidents, incidentsLoading, incidentsError, refreshIncidents, addIncident, acknowledgeIncident, acknowledgeAll, clearIncidents }), [incidents, incidentsLoading, incidentsError, refreshIncidents, addIncident, acknowledgeIncident, acknowledgeAll, clearIncidents]);
  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>;
}

export const useIncidents = () => useContext(IncidentContext);
