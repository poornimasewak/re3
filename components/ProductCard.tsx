'use client';

import { ProductAnalysis } from '@/types';
import { 
  Recycle, 
  Leaf, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Award,
  Lightbulb,
  ShoppingBag
} from 'lucide-react';

interface ProductCardProps {
  analysis: ProductAnalysis;
  imageUrl?: string;
  onSave?: () => void;
  onClose?: () => void;
}

/**
 * Product card component to display sustainability analysis results
 */
export default function ProductCard({ 
  analysis, 
  imageUrl, 
  onSave, 
  onClose 
}: ProductCardProps) {
  
  // Get color based on sustainability score
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score >= 50) return <AlertCircle className="w-8 h-8 text-yellow-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      {/* Product Image */}
      {imageUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={analysis.product_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {analysis.product_name}
            </h2>
            <p className="text-white/90 text-sm">{analysis.brand}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        <div className="inline-block px-3 py-1 bg-[#e0f7f4] text-[#2E8B57] rounded-full text-sm font-medium mb-4">
          {analysis.category}
        </div>

        {/* Sustainability Score */}
        <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getScoreColor(analysis.sustainability_score)} mb-6`}>
          {getScoreIcon(analysis.sustainability_score)}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Sustainability Score</h3>
            <p className="text-3xl font-bold">{analysis.sustainability_score}/100</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-3 rounded-lg ${analysis.recyclable ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Recycle className={`w-5 h-5 ${analysis.recyclable ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="font-medium text-sm">Recyclable</span>
            </div>
            <p className="text-xs text-gray-600">
              {analysis.recyclable ? 'Yes' : 'No'}
            </p>
          </div>

          <div className={`p-3 rounded-lg ${analysis.biodegradable ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Leaf className={`w-5 h-5 ${analysis.biodegradable ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="font-medium text-sm">Biodegradable</span>
            </div>
            <p className="text-xs text-gray-600">
              {analysis.biodegradable ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Material Composition */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-lg">🔬</span>
            Material Composition
          </h4>
          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
            {analysis.material_composition}
          </p>
        </div>

        {/* Recycling Instructions */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Recycle className="w-5 h-5 text-[#20B2AA]" />
            Recycling Instructions
          </h4>
          <p className="text-gray-700 text-sm bg-[#e0f7f4] p-3 rounded-lg">
            {analysis.recycling_instructions}
          </p>
        </div>

        {/* Environmental Impact */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-lg">🌍</span>
            Environmental Impact
          </h4>
          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
            {analysis.environmental_impact}
          </p>
        </div>

        {/* Reuse Suggestions */}
        {analysis.reuse_suggestions && analysis.reuse_suggestions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#FFD700]" />
              Reuse Ideas
            </h4>
            <ul className="space-y-2">
              {analysis.reuse_suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-[#20B2AA] mt-0.5">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Eco Alternatives */}
        {analysis.eco_alternatives && analysis.eco_alternatives.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2E8B57]" />
              Eco-Friendly Alternatives
            </h4>
            <ul className="space-y-2">
              {analysis.eco_alternatives.map((alternative, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-gray-700">{alternative}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {analysis.certifications && analysis.certifications.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFD700]" />
              Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-[#20B2AA] to-[#2E8B57] text-white text-xs rounded-full"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onSave && (
            <button
              onClick={onSave}
              className="flex-1 py-3 bg-gradient-to-r from-[#20B2AA] to-[#2E8B57] text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Save to History
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


