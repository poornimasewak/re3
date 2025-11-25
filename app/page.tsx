'use client';

import { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import CameraView from '@/components/CameraView';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductCard from '@/components/ProductCard';
import { analyzeProduct, compressImage } from '@/lib/api-client';
import { saveScanToHistory } from '@/lib/storage';
import { BarcodeResult, ProductAnalysis } from '@/types';

export default function Home() {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [error, setError] = useState<string>('');
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  // Get video element from global
  useEffect(() => {
    const interval = setInterval(() => {
      const video = (window as any).__re3CameraVideo;
      if (video && video !== videoElement) {
        setVideoElement(video);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [videoElement]);

  // Handle starting camera
  const handleStartCamera = () => {
    setCameraActive(true);
    setCapturedImage(null);
    setAnalysis(null);
    setError('');
  };

  // Handle image capture
  const handleCapture = async (imageSrc: string) => {
    try {
      // Compress image before processing
      const compressed = await compressImage(imageSrc, 1200, 0.8);
      setCapturedImage(compressed);
      setCameraActive(false);
      
      // Start analysis immediately
      handleAnalyze(compressed, detectedBarcode || undefined);
    } catch (err) {
      console.error('Error compressing image:', err);
      setCapturedImage(imageSrc);
      setCameraActive(false);
      handleAnalyze(imageSrc, detectedBarcode || undefined);
    }
  };

  // Handle barcode detection
  const handleBarcodeDetect = (barcode: BarcodeResult) => {
    console.log('Barcode detected:', barcode.text, barcode.format);
    setDetectedBarcode(barcode.text);
  };

  // Handle product analysis
  const handleAnalyze = async (imageBase64: string, barcode?: string) => {
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await analyzeProduct(imageBase64, barcode);

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setError(result.error || 'Failed to analyze product. Please try again.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle saving to history
  const handleSaveToHistory = () => {
    if (!analysis || !capturedImage) return;

    const success = saveScanToHistory({
      id: Date.now().toString(),
      analysis,
      imageBase64: capturedImage,
      barcode: detectedBarcode || undefined,
      timestamp: new Date().toISOString(),
    });

    if (success) {
      alert('✓ Saved to history!');
    } else {
      alert('Failed to save to history. Storage might be full.');
    }
  };

  // Handle scanning another product
  const handleScanAnother = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setDetectedBarcode(null);
    setError('');
    setCameraActive(true);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Camera View */}
      {cameraActive && (
        <div className="fixed inset-0 z-40 bg-black">
          <CameraView
            onCapture={handleCapture}
            onClose={() => setCameraActive(false)}
            showScanning={true}
          />
          
          {/* Barcode Scanner Overlay */}
          {videoElement && (
            <BarcodeScanner
              videoElement={videoElement}
              onDetect={handleBarcodeDetect}
              continuous={true}
            />
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Welcome Screen */}
        {!cameraActive && !capturedImage && !analysis && (
          <div className="text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#20B2AA] to-[#2E8B57] rounded-full flex items-center justify-center shadow-xl">
              <Camera className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Re3</h1>
            <p className="text-lg text-[#2E8B57] mb-8 font-medium">Reduce Reuse Recycle</p>
            
            <p className="text-gray-600 mb-8">
              Scan product barcodes to discover sustainability information, recycling instructions, and eco-friendly alternatives.
            </p>

            <button
              onClick={handleStartCamera}
              className="w-full py-4 bg-gradient-to-r from-[#20B2AA] to-[#2E8B57] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
            >
              <Camera className="w-6 h-6" />
              Start Scanning
            </button>

            {/* Features */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">📸</div>
                <h3 className="font-semibold text-sm text-gray-800">Capture Photo</h3>
                <p className="text-xs text-gray-500 mt-1">Take a picture of any product</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-sm text-gray-800">Scan Barcode</h3>
                <p className="text-xs text-gray-500 mt-1">Auto-detect product codes</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">🌱</div>
                <h3 className="font-semibold text-sm text-gray-800">Get Insights</h3>
                <p className="text-xs text-gray-500 mt-1">AI-powered sustainability analysis</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">♻️</div>
                <h3 className="font-semibold text-sm text-gray-800">Learn to Recycle</h3>
                <p className="text-xs text-gray-500 mt-1">Step-by-step instructions</p>
              </div>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-[#20B2AA] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Analyzing Product...
            </h2>
            <p className="text-gray-600">
              Our AI is examining the product for sustainability insights
            </p>
            {detectedBarcode && (
              <p className="text-sm text-[#2E8B57] mt-2">
                Barcode: {detectedBarcode}
              </p>
            )}
          </div>
        )}

        {/* Error State */}
        {error && !isAnalyzing && (
          <div className="max-w-md w-full">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Analysis Failed
              </h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <button
                onClick={handleScanAnother}
                className="w-full py-3 bg-gradient-to-r from-[#20B2AA] to-[#2E8B57] text-white font-semibold rounded-full"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && !isAnalyzing && (
          <div className="w-full max-w-2xl animate-in fade-in duration-500">
            <ProductCard
              analysis={analysis}
              imageUrl={capturedImage || undefined}
              onSave={handleSaveToHistory}
              onClose={handleScanAnother}
            />
            
            <button
              onClick={handleScanAnother}
              className="w-full mt-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Scan Another Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
