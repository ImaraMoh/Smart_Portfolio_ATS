import React from 'react';

const TextArea = ({ label, error, className = '', rows = 4, ...props }) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <textarea className="input-field resize-none" rows={rows} {...props} />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default TextArea;
