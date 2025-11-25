// API client for LLM integration
import { AnalyzeResponse } from '@/types';

/**
 * Analyze a product image using OpenAI GPT-4 Vision API
 * @param imageBase64 - Base64 encoded image string (with or without data URI prefix)
 * @param barcode - Optional barcode number detected from the image
 * @returns Analysis response with product sustainability information
 */
export async function analyzeProduct(
  imageBase64: string,
  barcode?: string
): Promise<AnalyzeResponse> {
  try {
    // Ensure image has proper base64 prefix
    const formattedImage = imageBase64.startsWith('data:image')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: formattedImage,
        barcode: barcode || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `API request failed: ${response.status}`
      );
    }

    const result: AnalyzeResponse = await response.json();
    return result;
  } catch (error: any) {
    console.error('API Client Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect to analysis service',
    };
  }
}

/**
 * Check if OpenAI API key is configured
 */
export async function checkApiKey(): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('/api/check-key');
    const data = await response.json();
    return data;
  } catch (error) {
    return { valid: false, error: 'Failed to check API key' };
  }
}

/**
 * Compress image to reduce API payload size
 * @param base64Image - Base64 encoded image
 * @param maxWidth - Maximum width in pixels
 * @param quality - JPEG quality (0-1)
 * @returns Compressed base64 image
 */
export function compressImage(
  base64Image: string,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64Image;
  });
}


