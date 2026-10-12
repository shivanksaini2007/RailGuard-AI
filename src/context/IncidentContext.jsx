import React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { initialIncidents } from '../data/incidents';
import { isAlertSoundEnabled, playAlertSound } from '../utils/alertSound';

const IncidentContext = createContext(null);

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem('railguard_incidents');
      return saved ? JSON.parse(saved) : initialIncidents;
    } catch {
      return initialIncidents;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'railguard_incidents',
      JSON.stringify(incidents.slice(0, 50))
    );
  }, [incidents]);

  const addIncident = useCallback((data) => {
    if (['critical', 'high'].includes(data.severity) && isAlertSoundEnabled()) {
      playAlertSound(`Warning. ${data.title || data.objectName || 'Safety incident'} detected. ${data.location ? `Location ${data.location}.` : ''} Please check the railway track.`);
    }

    const incident = {
      id: `INC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
      acknowledged: false,
      ...data,
    };

    setIncidents((current) => [incident, ...current].slice(0, 50));
    return incident;
  }, []);

  const acknowledgeIncident = useCallback((id) => {
    setIncidents((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: 'Acknowledged', acknowledged: true }
          : item
      )
    );
  }, []);

  const acknowledgeAll = useCallback(() => {
    setIncidents((current) =>
      current.map((item) => ({
        ...item,
        status: 'Acknowledged',
        acknowledged: true,
      }))
    );
  }, []);

  const clearIncidents = useCallback(() => {
    setIncidents([]);
  }, []);

  const value = useMemo(
    () => ({
      incidents,
      addIncident,
      acknowledgeIncident,
      acknowledgeAll,
      clearIncidents,
    }),
    [
      incidents,
      addIncident,
      acknowledgeIncident,
      acknowledgeAll,
      clearIncidents,
    ]
  );

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export const useIncidents = () => useContext(IncidentContext);
