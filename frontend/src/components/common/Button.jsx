import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const cls = variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-secondary';
  return (
    <button className={`${cls} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
