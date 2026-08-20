import React from 'react';

const Spinner = ({ size = 22 }) => (
  <div
    className="animate-spin rounded-full border-2 border-gray-200 border-t-ink"
    style={{ width: size, height: size }}
  />
);

export default Spinner;
