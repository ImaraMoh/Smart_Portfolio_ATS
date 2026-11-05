import React from 'react';
import { Link } from 'react-router-dom';
import { Layers3 } from 'lucide-react';

export default function FolioBrand({ className = 'lp-brand', iconSize = 17 }) {
  return (
    <Link to="/" className={className} aria-label="Folio home">
      <span className="lp-brand-mark"><Layers3 size={iconSize} /></span>
      <span>folio<span className="lp-brand-dot">.</span></span>
      <span className="lp-brand-divider" />
      <span className="lp-brand-caption">CAREER STUDIO</span>
    </Link>
  );
}
