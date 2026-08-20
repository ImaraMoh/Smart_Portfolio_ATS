import React from 'react';

const Input = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <input className="input-field" {...props} />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default Input;
