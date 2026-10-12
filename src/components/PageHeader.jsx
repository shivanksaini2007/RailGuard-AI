import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
