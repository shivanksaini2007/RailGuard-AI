import React from 'react';

export default function StatCard({ label, value, hint, icon: Icon, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>
        {Icon && <Icon size={19} />}
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </article>
  );
}
