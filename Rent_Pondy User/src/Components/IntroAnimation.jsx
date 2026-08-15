import React from 'react';
import './IntroAnimation.css';

const IntroAnimation = () => {
  return (
    <div className="intro-container">
      {/* Roof Line Animation */}
      <div className="roof-line"></div>

      {/* Text Animation */}
      <div className="text-wrapper">
        <span className="text-slide-left">RENT</span>
        <span className="text-slide-right">PONDY</span>
      </div>
    </div>
  );
};

export default IntroAnimation;
