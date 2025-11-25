'use client';

import { useEffect, useState, useCallback } from 'react';
import { Scan, CheckCircle } from 'lucide-react';
import { scanBarcodeFromVideo, scanBarcodeFromImage } from '@/lib/barcode-scanner';
import { BarcodeResult } from '@/types';

interface BarcodeScannerProps {
  videoElement?: HTMLVideoElement | null;
  imageSrc?: string;
  onDetect: (barcode: BarcodeResult) => void;
  continuous?: boolean;
}

/**
 * Barcode scanner component using @zxing/browser
 * Can scan from live video feed or static images
 */
export default function BarcodeScanner({
  videoElement,
  imageSrc,
  onDetect,
  continuous = true,
}: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(false);
  const [error, setError] = useState<string>('');

  // Scan from static image
  useEffect(() => {
    if (imageSrc && !videoElement) {
      setScanning(true);
      setError('');
      
      scanBarcodeFromImage(imageSrc)
        .then((result) => {
          setScanning(false);
          if (result) {
            setDetected(true);
            onDetect(result);
            setTimeout(() => setDetected(false), 2000);
          } else {
            setError('No barcode detected in image');
          }
        })
        .catch((err) => {
          setScanning(false);
          setError('Failed to scan barcode');
          console.error(err);
        });
    }
  }, [imageSrc, videoElement, onDetect]);

  // Scan from live video
  useEffect(() => {
    if (!videoElement || !continuous) return;

    let isActive = true;
    let lastDetectedCode = '';
    let detectionTimeout: NodeJS.Timeout;

    const scanLoop = async () => {
      if (!isActive) return;

      try {
        setScanning(true);
        setError('');

        const result = await scanBarcodeFromVideo(videoElement);

        if (result && isActive) {
          // Only trigger onDetect if it's a different code
          if (result.text !== lastDetectedCode) {
            lastDetectedCode = result.text;
            setDetected(true);
            onDetect(result);

            // Reset detection state after 2 seconds
            clearTimeout(detectionTimeout);
            detectionTimeout = setTimeout(() => {
              setDetected(false);
              lastDetectedCode = '';
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Scanning error:', err);
      }

      // Continue scanning
      if (isActive) {
        setTimeout(scanLoop, 300); // Scan every 300ms
      }
    };

    scanLoop();

    return () => {
      isActive = false;
      clearTimeout(detectionTimeout);
      setScanning(false);
    };
  }, [videoElement, continuous, onDetect]);

  // Don't render anything if not actively scanning
  if (!scanning && !detected && !error) {
    return null;
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
        {detected ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Barcode Detected!</span>
          </>
        ) : scanning ? (
          <>
            <Scan className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Scanning...</span>
          </>
        ) : error ? (
          <span className="text-sm font-medium text-yellow-400">{error}</span>
        ) : null}
      </div>
    </div>
  );
}


