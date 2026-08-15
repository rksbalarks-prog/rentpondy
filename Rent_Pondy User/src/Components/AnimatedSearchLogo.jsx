import React, { useState, useEffect } from "react";
import "./AnimatedSearchLogo.css";
import { BiSearchAlt } from "react-icons/bi";

const AnimatedSearchLogo = () => {
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
    <div className="animated-search-logo-container">
      {/* Circle background */}
      <div className={`search-circle ${isAnimating ? "move-up" : ""}`}>
        {/* Search icon (default) */}
        <BiSearchAlt
          className={`search-icon ${showText ? "hide-icon" : "show-icon"}`}
          size={24}
        />

        {/* Search text (during animation) */}
        <span className={`search-text ${showText ? "show-text" : "hide-text"}`}>
          <span className="search-label">SEARCH</span>
        </span>
      </div>
    </div>
  );
};

export default AnimatedSearchLogo;
