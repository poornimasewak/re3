// Barcode scanning utility using @zxing/browser
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeResult } from '@/types';

/**
 * Initialize barcode scanner instance
 */
let reader: BrowserMultiFormatReader | null = null;

export function getBarcodeReader(): BrowserMultiFormatReader {
  if (!reader) {
    reader = new BrowserMultiFormatReader();
  }
  return reader;
}

/**
 * Scan barcode from a video element (live camera feed)
 * @param videoElement - HTML video element with active camera stream
 * @returns Promise resolving to barcode result or null if not found
 */
export async function scanBarcodeFromVideo(
  videoElement: HTMLVideoElement
): Promise<BarcodeResult | null> {
  try {
    // Create a canvas to capture the current video frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and decode
    const blob = await new Promise<Blob | null>((resolve) => 
      canvas.toBlob(resolve, 'image/png')
    );
    
    if (!blob) return null;
    
    const url = URL.createObjectURL(blob);
    const reader = getBarcodeReader();
    const result = await reader.decodeFromImageUrl(url);
    URL.revokeObjectURL(url);
    
    if (result) {
      return {
        text: result.getText(),
        format: result.getBarcodeFormat().toString(),
      };
    }
    
    return null;
  } catch (error: any) {
    // No barcode found - this is normal, not an error
    if (error?.message?.includes('No MultiFormat Readers were able to detect the code')) {
      return null;
    }
    console.error('Barcode scanning error:', error);
    return null;
  }
}

/**
 * Scan barcode from a static image (base64 or URL)
 * @param imageSrc - Image source (base64 or URL)
 * @returns Promise resolving to barcode result or null if not found
 */
export async function scanBarcodeFromImage(
  imageSrc: string
): Promise<BarcodeResult | null> {
  try {
    const reader = getBarcodeReader();
    const result = await reader.decodeFromImageUrl(imageSrc);
    
    if (result) {
      return {
        text: result.getText(),
        format: result.getBarcodeFormat().toString(),
      };
    }
    
    return null;
  } catch (error: any) {
    // No barcode found is a common case
    if (error?.message?.includes('No MultiFormat Readers were able to detect the code')) {
      return null;
    }
    console.error('Barcode scanning error:', error);
    return null;
  }
}

/**
 * Start continuous barcode scanning from video stream
 * @param videoElement - HTML video element
 * @param onDetect - Callback when barcode is detected
 * @param onError - Callback for errors
 */
export function startContinuousScanning(
  videoElement: HTMLVideoElement,
  onDetect: (result: BarcodeResult) => void,
  onError?: (error: Error) => void
): () => void {
  const reader = getBarcodeReader();
  let isScanning = true;

  const scanLoop = async () => {
    if (!isScanning) return;

    try {
      const result = await scanBarcodeFromVideo(videoElement);
      if (result && isScanning) {
        onDetect(result);
      }
    } catch (error: any) {
      if (onError && !error?.message?.includes('No MultiFormat Readers')) {
        onError(error as Error);
      }
    }

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanLoop);
    }
  };

  // Start scanning loop
  scanLoop();

  // Return cleanup function
  return () => {
    isScanning = false;
  };
}

/**
 * Reset the barcode reader
 */
export function resetBarcodeReader(): void {
  // Reset reader instance to allow for fresh initialization
  reader = null;
}

