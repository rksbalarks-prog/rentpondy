import React, { useState, useRef, useEffect } from 'react';
import paymentVideo from '../Assets/payment vdo.mp4';

const VideoPlayer = ({ 
  videoSource = paymentVideo,
  width = '100%'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play video
    const attemptPlay = () => {
      if (video) {
        video.play().catch(() => {
          // Autoplay might be blocked by browser
        });
      }
    };

    // Try playing when metadata is loaded
    video.addEventListener('loadedmetadata', attemptPlay);
    
    // Update loading state
    video.addEventListener('canplay', () => setIsLoading(false));
    video.addEventListener('playing', () => setIsLoading(false));
    video.addEventListener('play', () => setIsLoading(false));
    video.addEventListener('loadstart', () => setIsLoading(true));
    video.addEventListener('error', () => {
      console.error('Video error:', video.error);
      setHasError(true);
    });

    // Retry play on resume
    video.addEventListener('ended', () => {
      setTimeout(() => {
        if (video && !video.paused) {
          attemptPlay();
        }
      }, 100);
    });

    return () => {
      video.removeEventListener('loadedmetadata', attemptPlay);
      video.removeEventListener('canplay', () => setIsLoading(false));
      video.removeEventListener('playing', () => setIsLoading(false));
      video.removeEventListener('play', () => setIsLoading(false));
      video.removeEventListener('loadstart', () => setIsLoading(true));
      video.removeEventListener('error', () => setHasError(true));
      video.removeEventListener('ended', () => {});
    };
  }, []);

  const handleLoadedData = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleOnClick = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play();
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: width,
        maxWidth: '375px',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#000',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
      }}
      onClick={handleOnClick}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Loading Indicator */}
      {isLoading && !hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(1, 153, 136, 0.2)',
              borderTop: '4px solid #019988',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '49.33%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
          }}
        >
          <span>Unable to load video</span>
        </div>
      )}

      {/* Video Container */}
      {!hasError && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '49.33%', // 185/375 aspect ratio
            backgroundColor: '#000',
          }}
        >
          <video
            ref={videoRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={handleLoadedData}
            disablePictureInPicture
          >
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
