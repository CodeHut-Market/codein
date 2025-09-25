"use client";
import React from 'react';

/**
 * ElectricBorderCard
 * Encapsulates the animated metallic / electric border effect.
 * Children (e.g., login form) can be passed and absolutely positioned content layers are preserved.
 */
export function ElectricBorderCard({
  title = 'Welcome Back',
  label = 'Login',
  description,
  children,
}: {
  title?: string;
  label?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="electric-wrapper">
      <svg className="electric-svg" aria-hidden="true">
        <defs>
          <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves={10} result="noise1" seed={1} />
            <feOffset in="noise1" dx={0} dy={0} result="offsetNoise1">
              <animate attributeName="dy" values="700;0" dur="6s" repeatCount="indefinite" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves={10} result="noise2" seed={1} />
            <feOffset in="noise2" dx={0} dy={0} result="offsetNoise2">
              <animate attributeName="dy" values="0;-700" dur="6s" repeatCount="indefinite" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves={10} result="noise3" seed={2} />
            <feOffset in="noise3" dx={0} dy={0} result="offsetNoise3">
              <animate attributeName="dx" values="490;0" dur="6s" repeatCount="indefinite" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves={10} result="noise4" seed={2} />
            <feOffset in="noise4" dx={0} dy={0} result="offsetNoise4">
              <animate attributeName="dx" values="0;-490" dur="6s" repeatCount="indefinite" />
            </feOffset>
            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale={30} xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>
      <div className="electric-card-container">
        <div className="inner-container">
          <div className="border-outer">
            <div className="main-card" />
          </div>
          <div className="glow-layer-1" />
          <div className="glow-layer-2" />
        </div>
        <div className="overlay-1" />
        <div className="overlay-2" />
        <div className="background-glow" />
        <div className="content-container">
          <div className="content-top">
            <div className="scrollbar-glass">{label}</div>
            <h1 className="title text-foreground">{title}</h1>
          </div>
          <hr className="divider" />
          <div className="content-bottom space-y-4">
            {description && <p className="description text-sm text-muted-foreground">{description}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectricBorderCard;
