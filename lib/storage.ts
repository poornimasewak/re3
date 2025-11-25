// Local storage utility functions for Re3 app
import { ScanHistoryItem } from '@/types';

const STORAGE_KEY = 're3_scan_history';
const MAX_HISTORY_ITEMS = 100; // Limit to prevent storage overflow

/**
 * Get all scan history items from local storage
 */
export function getScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error reading scan history:', error);
    return [];
  }
}

/**
 * Save a new scan to history
 */
export function saveScanToHistory(item: ScanHistoryItem): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const history = getScanHistory();
    
    // Add new item at the beginning
    const updatedHistory = [item, ...history].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error saving to history:', error);
    return false;
  }
}

/**
 * Delete a specific scan from history
 */
export function deleteScanFromHistory(id: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const history = getScanHistory();
    const filtered = history.filter(item => item.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting from history:', error);
    return false;
  }
}

/**
 * Clear all scan history
 */
export function clearAllHistory(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats() {
  if (typeof window === 'undefined') {
    return { count: 0, sizeKB: 0 };
  }
  
  const history = getScanHistory();
  const stored = localStorage.getItem(STORAGE_KEY) || '';
  
  return {
    count: history.length,
    sizeKB: Math.round((stored.length * 2) / 1024), // Rough estimate (UTF-16)
  };
}


