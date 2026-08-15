


import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";

const TopBar = ({ items, setActive, activeItem }) => {
  const topBarRef = useRef(null);
  const isScrollingRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const topBarElement = topBarRef.current;
    if (!topBarElement) return;

    // 🖱️ Mouse wheel for horizontal scrolling
    const handleWheel = (e) => {
      if (topBarElement) {
        if (e.deltaY !== 0) {
          topBarElement.scrollLeft += e.deltaY; // Scroll horizontally
          e.preventDefault(); // Prevent page scroll
        }
      }
    };

    // Infinite loop scroll handler - seamless looping without jumps
    const handleScroll = () => {
      if (!topBarElement || isScrollingRef.current) return;

      const scrollWidth = topBarElement.scrollWidth;
      const clientWidth = topBarElement.clientWidth;
      const scrollLeft = topBarElement.scrollLeft;
      
      // Calculate the threshold for looping (at the halfway point)
      const halfScrollWidth = scrollWidth / 2;
      const resetThreshold = halfScrollWidth * 0.95; // 95% of halfway

      // When user scrolls past the original items, seamlessly loop back
      if (scrollLeft >= resetThreshold - 100) {
        isScrollingRef.current = true;
        topBarElement.scrollLeft = 100; // Reset to near start of duplicated items
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }
      // When user scrolls backward past the start, loop to end
      else if (scrollLeft <= 100) {
        isScrollingRef.current = true;
        topBarElement.scrollLeft = resetThreshold - 200; // Reset to near end
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }
    };

    // Enable smooth scrolling on touch devices
    topBarElement.style.scrollBehavior = "auto"; // Use auto instead of smooth for instant reset
    
    // Scroll to center position initially for better UX
    setTimeout(() => {
      const scrollWidth = topBarElement.scrollWidth;
      const clientWidth = topBarElement.clientWidth;
      topBarElement.scrollLeft = (scrollWidth - clientWidth) / 2;
    }, 100);

    // Add event listeners
    topBarElement.addEventListener("wheel", handleWheel, { passive: false });
    topBarElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      topBarElement.removeEventListener("wheel", handleWheel);
      topBarElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="mb-1"
      ref={topBarRef}
      style={{
        width: "100%",
        overflowX: "auto",
        whiteSpace: "nowrap",
        scrollbarWidth: "none", // Hide scrollbar for Firefox
        msOverflowStyle: "none", // Hide scrollbar for IE & Edge
        WebkitOverflowScrolling: "touch", // Smooth scrolling for iOS
        touchAction: "pan-x", // Allow horizontal scrolling
        // background:"#016F66",
                background:"#ffffff ",
            boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.1)", // subtle bottom shadow

      }}
    >
      <ul  className="list-unstyled d-flex mb-0"
        style={{
          display: "flex",
          gap: "8px",
          padding: "8px 10px",
          paddingRight: "18px", // Ensures the last item has breathing room
          margin: "0",
          listStyle: "none",
          paddingBottom:"0px",

        }}
      >
        {/* Original items + duplicated items for seamless looping */}
        {[...items, ...items].map((item, index) => (
          <li
          className={`text-center px-2 ${activeItem === item.content ? "text-primary" : "text-secondary"}`}

            key={`${item.content}-${index}`}
            style={{
              cursor: "pointer",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0, // Prevents shrinking
            }}
            onClick={() => {
              if (item.route) {
                navigate(item.route);
              } else {
                setActive(item.content);
              }
            }}
          >
            {item.iconNode ? (
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.iconNode}
              </span>
            ) : item.isAnimated ? (
              <AnimatedLogo logoImage={item.icon} brandColor="#28a745" />
            ) : (
              <img
                src={item.icon}
                alt={item.text}
                style={{ width: "24px", height: "24px", objectFit: "cover" }}
              />
            )}
            <span
               style={{
                marginTop: "4px",
                color: activeItem === item.content ? "#2F4F4F" : "grey", // 👈 Text color changes if active
                fontSize: "10px",
                paddingBottom: "3px",
                borderBottom: activeItem === item.content ? "2px solid #383838" : "2px solid transparent",
                width: "100%", // Optional, depending on desired width
                display: "inline-block",
                fontWeight: activeItem === item.content ? 600 : 500, // 👈 semibold text

              }}
>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopBar;




