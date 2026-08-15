// Utility helpers extracted from AddProperty.jsx
// Keep these small, pure, and well-documented so other components can reuse them.

import { toWords } from 'number-to-words';

export function convertToIndianRupees(num) {
  const number = parseInt(num, 10);
  if (isNaN(number)) return "";

  if (number >= 10000000) {
    return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
  } else if (number >= 100000) {
    return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
  } else {
    return toWords(number).replace(/\b\w/g, l => l.toUpperCase()) + " rupees";
  }
}

export function convertToWords(num) {
  const number = parseInt(num, 10);
  if (isNaN(number)) return "";

  if (number >= 10000000) {
    return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
  } else if (number >= 100000) {
    return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
  } else {
    return toWords(number).replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Parse coordinate input like "11.7540° N, 79.7619° E" into { lat, lng }
export function parseLatLngString(input) {
  if (!input || typeof input !== 'string') return null;
  const match = input.match(/([\-\d.]+)[^\dNS]*([NS]),\s*([\-\d.]+)[^\dEW]*([EW])/i);
  if (!match) return null;

  let lat = parseFloat(match[1]);
  const latDir = match[2].toUpperCase();
  let lng = parseFloat(match[3]);
  const lngDir = match[4].toUpperCase();

  if (latDir === 'S') lat = -lat;
  if (lngDir === 'W') lng = -lng;

  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

// Compress image intelligently to target size (<30KB by default)
export function compressImage(file, targetSizeKB = 30) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          let quality = 0.8;
          const targetBytes = targetSizeKB * 1024;

          // Progressive quality reduction
          const attemptCompress = (currentQuality) => {
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            return new Promise((resolveBlob) => {
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    reject(new Error('Failed to create blob'));
                    return;
                  }

                  if (blob.size <= targetBytes || currentQuality <= 0.1) {
                    // Compression successful or reached minimum quality
                    const compressedFile = new File([blob], file.name, {
                      type: 'image/jpeg',
                    });
                    resolve(compressedFile);
                    resolveBlob();
                  } else if (currentQuality > 0.1) {
                    // Try lower quality
                    attemptCompress(currentQuality - 0.05).then(resolveBlob);
                  } else {
                    // If still too large, reduce dimensions
                    width = Math.floor(width * 0.8);
                    height = Math.floor(height * 0.8);
                    attemptCompress(0.8).then(resolveBlob);
                  }
                },
                'image/jpeg',
                currentQuality
              );
            });
          };

          attemptCompress(quality);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Apply a centered watermark text to an image File and return a new File (Promise)
export function applyImageWatermark(file, watermarkText = 'Rent Pondy') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const fontSize = Math.max(24, Math.floor(canvas.width / 15));
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          // Outline then fill for readability
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 4;
          ctx.strokeText(watermarkText, centerX, centerY);

          ctx.fillStyle = 'rgba(224, 223, 223, 0.9)';
          ctx.fillText(watermarkText, centerX, centerY);

          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Failed to create blob from canvas'));
            const watermarkedFile = new File([blob], file.name, { type: file.type });
            resolve(watermarkedFile);
          }, file.type);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Compress video to ~200KB using aggressive canvas-based compression
// This function is reusable across AddProperty and EditProperty components
// Returns a Promise that resolves with a compressed File object
export function compressVideo(file, onProgressCallback = null, targetSizeKB = 200) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration;
        
        // Get original dimensions
        const originalWidth = video.videoWidth;
        const originalHeight = video.videoHeight;
        
        // For 2.3MB video, we need extreme compression:
        // Scale down to 160px width (mobile phone display)
        let targetWidth = 160;
        let targetHeight = Math.round((targetWidth / originalWidth) * originalHeight);
        
        // Ensure even dimensions
        targetWidth = Math.floor(targetWidth / 2) * 2;
        targetHeight = Math.floor(targetHeight / 2) * 2;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Determine MIME type with very low bitrate
        let mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/mp4';
        }

        // Use EXTREMELY low bitrate for small file size (32 kbps = 4 KB/sec)
        const stream = canvas.captureStream(5); // Only 5 FPS for massive compression
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: mimeType,
          videoBitsPerSecond: 32000 // 32 kbps = extremely aggressive compression
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const compressedSize = blob.size;
          const targetBytes = targetSizeKB * 1024;
          
          // Create compressed file
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, '') + '_compressed.webm',
            { type: mimeType }
          );
          
          if (onProgressCallback) onProgressCallback(100);
          resolve(compressedFile);
        };

        mediaRecorder.onerror = (e) => reject(e);

        // Start recording
        mediaRecorder.start();
        video.play();

        let lastProgress = 0;
        const startTime = Date.now();

        const drawFrame = () => {
          if (video.ended) {
            mediaRecorder.stop();
            return;
          }

          try {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
          } catch (e) {
            // Canvas error, continue
          }
          
          // Update progress
          const currentProgress = Math.round((video.currentTime / duration) * 100);
          if (currentProgress !== lastProgress) {
            lastProgress = currentProgress;
            if (onProgressCallback) onProgressCallback(currentProgress);
          }

          requestAnimationFrame(drawFrame);
        };

        video.onended = () => {
          mediaRecorder.stop();
        };

        video.currentTime = 0;
        drawFrame();

      } catch (err) {
        reject(err);
      }
    };

    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = URL.createObjectURL(file);
  });
}
