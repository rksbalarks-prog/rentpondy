
import { useEffect, useRef } from "react";
import CarAds from '../Assets/car_Ads.jpeg'
import flatLandAd from '../Assets/flatLandAd.jpeg'
import pondymatriAds from '../Assets/pondy_matriAds.jpeg'
import pondymartiAds1 from '../Assets/pondymatri_Ads.jpeg'
import rentpondyad from '../Assets/rentpondyad.jpeg'
import tamilmatri from '../Assets/tamilmatri.jpeg'
import usedcard from '../Assets/usedcar_ad.jpeg'
const images = [
  CarAds,
  flatLandAd,
  pondymatriAds,
  pondymartiAds1,
  rentpondyad,
  tamilmatri,
  usedcard,
];

function VerticalAutoScrollCarousel() {
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          top: 1,
          behavior: "smooth",
        });

        // Loop back to top when scroll reaches the end
        if (
          containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight
        ) {
          containerRef.current.scrollTop = 0;
        }
      }
    }, 20); // Adjust speed here

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-2 d-flex flex-column align-items-center "
      ref={containerRef}
      style={{
        height: "2500px",
        overflowY: "hidden",
        scrollBehavior: "smooth",
      }}
    >
      {[...images, ...images].map((src, index) => (
        <div key={index} className="mb-1">
          <img
            src={src}
            alt={`Slide ${index}`}
            style={{
              width: "450px",
              height: "450px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default VerticalAutoScrollCarousel;
