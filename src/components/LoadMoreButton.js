'use client';

import { useData } from '@/contexts/DataContext';
import Icon from './Icon';

export default function LoadMoreButton() {
  const { pagination, loading, loadMoreData } = useData();

  // Don't show if no more data or loading
  if (!pagination.hasNext || loading) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={loadMoreData}
        disabled={loading}
        className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        
        {/* Button content */}
        <div className="relative flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
            <Icon name="plus" className="w-4 h-4" />
          </div>
          <span className="text-sm">
            {loading ? 'Loading...' : `Load More (${pagination.total - pagination.page * pagination.limit} remaining)`}
          </span>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  );
}
