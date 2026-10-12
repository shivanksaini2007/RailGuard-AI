import React, { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import IncidentCard from '../components/IncidentCard';
import { useIncidents } from '../context/IncidentContext';

export default function Alerts() {
  const {
    incidents,
    acknowledgeIncident,
  } = useIncidents();

  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('all');

  const filtered = useMemo(() => {
    return incidents.filter((item) => {
      const text =
        `${item.id} ${item.title} ${item.location} ${item.track}`
          .toLowerCase();

      return (
        text.includes(query.toLowerCase()) &&
        (severity === 'all' ||
          item.severity === severity)
      );
    });
  }, [incidents, query, severity]);

  return (
    <>
      <PageHeader
        title="Incident Center"
        subtitle="Search, filter and acknowledge railway safety events."
      />

      <div className="filters">
        <input
          placeholder="Search incident / track / location"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
        />

        {['all', 'critical', 'high', 'medium'].map(
          (item) => (
            <button
              key={item}
              className={
                severity === item
                  ? 'filter active'
                  : 'filter'
              }
              onClick={() => setSeverity(item)}
            >
              {item === 'all'
                ? 'All'
                : item.charAt(0).toUpperCase() +
                  item.slice(1)}
            </button>
          )
        )}
      </div>

      <section className="grid">
        {filtered.length ? (
          filtered.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onAcknowledge={acknowledgeIncident}
            />
          ))
        ) : (
          <div className="panel empty-state">
            No matching incidents found.
          </div>
        )}
      </section>
    </>
  );
}
