import React, { useState, useEffect } from "react";
import "./AnimatedLogo.css";

const AnimatedLogo = ({ logoImage, brandColor = "#28a745", textColor = "#fff" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const animationCycle = () => {
      // Trigger slash animation
      setIsAnimating(true);

      // Show text after 0.8s (when slash is in the middle)
      setTimeout(() => {
        setShowText(true);
      }, 800);

      // Hide text and reset after 3 seconds
      setTimeout(() => {
        setShowText(false);
        setIsAnimating(false);
      }, 3000);
    };

    // Start first animation after 5 seconds
    const initialTimer = setTimeout(animationCycle, 5000);

    // Set up recurring animation every 8 seconds (5s wait + 3s animation)
    const interval = setInterval(animationCycle, 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="animated-logo-container">
      {/* Logo Background */}
      <div
        className={`logo-background ${isAnimating ? "glow" : ""}`}
        style={{
          "--brand-color": brandColor,
        }}
      >
        {/* Diagonal Slash Overlay */}
        {isAnimating && <div className="slash-sweep"></div>}

        {/* Logo or Text */}
        <div className={`logo-content ${showText ? "hide" : "show"}`}>
          <img src={logoImage} alt="Logo" className="logo-image" />
        </div>

        <div className={`text-content ${showText ? "show" : "hide"}`}>
          <span className="add-property-text">ADD PROPERTY</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogo;
