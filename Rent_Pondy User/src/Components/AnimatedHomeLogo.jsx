import React, { useState, useEffect } from "react";
import "./AnimatedHomeLogo.css";
import homesIcon from "../Assets/Rent Property-01.png";

const AnimatedHomeLogo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const animationCycle = () => {
      // Trigger animation
      setIsAnimating(true);

      // Show text after 0.3s
      setTimeout(() => {
        setShowText(true);
      }, 300);

      // Hide text and reset after 3 seconds
      setTimeout(() => {
        setShowText(false);
        setIsAnimating(false);
      }, 3000);
    };

    // Start first animation after 3 seconds
    const initialTimer = setTimeout(animationCycle, 3000);

    // Set up recurring animation every 6 seconds (3s wait + 3s animation)
    const interval = setInterval(animationCycle, 6000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="animated-home-logo-container">
      {/* White circular background */}
      <div className={`home-circle ${isAnimating ? "move-up" : ""}`}>
        {/* Home icon (default) */}
        <img
          src={homesIcon}
          alt="Home"
          className={`home-icon ${showText ? "hide-icon" : "show-icon"}`}
        />

        {/* Add Property text (during animation) */}
        <span className={`add-text ${showText ? "show-text" : "hide-text"}`}>
          <span className="add-label">ADD</span>
          <span className="property-label">PROPERTY</span>
        </span>
      </div>
    </div>
  );
};

export default AnimatedHomeLogo;



