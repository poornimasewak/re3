// TypeScript interfaces for Re3 app

export interface ProductAnalysis {
  product_name: string;
  brand: string;
  category: string;
  sustainability_score: number;
  recycling_instructions: string;
  material_composition: string;
  environmental_impact: string;
  reuse_suggestions: string[];
  eco_alternatives: string[];
  recyclable: boolean;
  biodegradable: boolean;
  certifications: string[];
}

export interface AnalyzeResponse {
  success: boolean;
  data?: ProductAnalysis;
  error?: string;
  timestamp?: string;
}

export interface ScanHistoryItem {
  id: string;
  analysis: ProductAnalysis;
  imageBase64: string;
  barcode?: string;
  timestamp: string;
}

export interface BarcodeResult {
  text: string;
  format: string;
}

export interface CameraSettings {
  facingMode: 'user' | 'environment';
  resolution: {
    width: number;
    height: number;
  };
}


