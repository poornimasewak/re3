'use client';

import { useState, useEffect } from 'react';
import { Trash2, Calendar, Package, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getScanHistory, deleteScanFromHistory, clearAllHistory } from '@/lib/storage';
import { ScanHistoryItem } from '@/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = getScanHistory();
    setHistory(items);
  };

  const handleDelete = (id: string) => {
    const success = deleteScanFromHistory(id);
    if (success) {
      loadHistory();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAll = () => {
    const success = clearAllHistory();
    if (success) {
      setHistory([]);
      setSelectedItem(null);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Scan History</h1>
            <p className="text-gray-600">
              {history.length} {history.length === 1 ? 'scan' : 'scans'} saved
            </p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Scans Yet</h2>
            <p className="text-gray-600 mb-6">
              Start scanning products to build your sustainability history
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#20B2AA] to-[#2E8B57] text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Start Scanning
            </a>
          </div>
        )}

        {/* History List */}
        {history.length > 0 && !selectedItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                {item.imageBase64 && (
                  <div className="relative h-32 overflow-hidden bg-gray-100">
                    <img
                      src={item.imageBase64}
                      alt={item.analysis.product_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`w-12 h-12 ${getScoreBadgeColor(item.analysis.sustainability_score)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {item.analysis.sustainability_score}
                      </div>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">
                    {item.analysis.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {item.analysis.brand}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-1 hover:bg-red-50 rounded-full text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail View */}
        {selectedItem && (
          <div className="animate-in fade-in duration-300">
            <button
              onClick={() => setSelectedItem(null)}
              className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              ← Back to History
            </button>
            
            <ProductCard
              analysis={selectedItem.analysis}
              imageUrl={selectedItem.imageBase64}
              onClose={() => setSelectedItem(null)}
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleDelete(selectedItem.id)}
                className="flex-1 py-3 bg-red-50 text-red-600 font-semibold rounded-full hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete from History
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                Clear All History?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This will permanently delete all {history.length} saved scans. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


