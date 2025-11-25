'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, SwitchCamera, X } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onClose?: () => void;
  showScanning?: boolean;
}

/**
 * Camera view component using react-webcam
 * Features:
 * - Live camera feed
 * - Capture photos
 * - Toggle front/back camera
 * - Scanning overlay animation
 */
export default function CameraView({ onCapture, onClose, showScanning = false }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (error: any) {
        console.error('Camera permission error:', error);
        setHasPermission(false);
        if (error.name === 'NotAllowedError') {
          setErrorMessage('Camera access denied. Please allow camera access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('No camera found. Please connect a camera and try again.');
        } else {
          setErrorMessage('Unable to access camera. Please check your device settings.');
        }
      }
    };

    checkPermissions();
  }, []);

  // Capture image from webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  // Toggle camera (front/back)
  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  // Get video element for barcode scanning
  const getVideoElement = (): HTMLVideoElement | null => {
    return webcamRef.current?.video || null;
  };

  // Expose video element to parent (for barcode scanning)
  useEffect(() => {
    if (webcamRef.current?.video) {
      (window as any).__re3CameraVideo = webcamRef.current.video;
    }
    return () => {
      delete (window as any).__re3CameraVideo;
    };
  }, []);

  // Permission denied
  if (hasPermission === false) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="text-center">
          <Camera className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
          <p className="text-gray-400 mb-4">{errorMessage}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#20B2AA] text-white rounded-full hover:bg-[#2E8B57] transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (hasPermission === null) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p>Initializing camera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Webcam */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.9}
        videoConstraints={{
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }}
        className="w-full h-full object-cover"
        onUserMediaError={(error) => {
          console.error('Webcam error:', error);
          setHasPermission(false);
          setErrorMessage('Failed to initialize camera');
        }}
      />

      {/* Scanning Overlay */}
      {showScanning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Scanning Frame */}
            <div className="w-64 h-64 border-4 border-dashed border-white/30 rounded-lg">
              {/* Animated Corners */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#FFD700] rounded-tl-lg scanning-corner" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#FFD700] rounded-tr-lg scanning-corner" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#FFD700] rounded-bl-lg scanning-corner" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#FFD700] rounded-br-lg scanning-corner" />
            </div>
            
            {/* Instructions */}
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                Position barcode in frame
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-6 px-6">
        {/* Toggle Camera */}
        <button
          onClick={toggleCamera}
          className="p-3 bg-gray-800/70 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Switch camera"
        >
          <SwitchCamera className="w-6 h-6" />
        </button>

        {/* Capture Button */}
        <button
          onClick={capture}
          className="w-16 h-16 bg-white rounded-full border-4 border-[#20B2AA] hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center"
          aria-label="Capture photo"
        >
          <Camera className="w-8 h-8 text-[#20B2AA]" />
        </button>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-3 bg-gray-800/70 text-white rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close camera"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}


