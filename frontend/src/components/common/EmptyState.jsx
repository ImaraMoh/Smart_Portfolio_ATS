import React from 'react';

const EmptyState = ({ title, description, action }) => (
  <div className="text-center py-14 px-6 border border-dashed border-gray-300 rounded-xl2">
    <h3 className="text-base font-semibold font-display mb-1">{title}</h3>
    {description && <p className="text-sm text-muted mb-4 max-w-sm mx-auto">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
