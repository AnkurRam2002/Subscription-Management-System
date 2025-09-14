'use client';

import { useState } from 'react';
import Icon from './Icon';

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Convert selectedCategory to array if it's not already
  const selectedCategories = Array.isArray(selectedCategory) ? selectedCategory : 
    (selectedCategory === 'all' ? [] : [selectedCategory]);

  const handleCategoryToggle = (categoryId) => {
    if (categoryId === 'all') {
      onCategoryChange([]);
    } else {
      const newSelection = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      onCategoryChange(newSelection);
    }
    setIsDropdownOpen(false);
  };

  const removeCategory = (categoryId) => {
    const newSelection = selectedCategories.filter(id => id !== categoryId);
    onCategoryChange(newSelection);
  };

  const selectedCategoryData = selectedCategories.map(id => 
    categories.find(cat => cat._id === id)
  ).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {/* Dropdown and selected categories */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px] hover:bg-gray-50"
          >
            <Icon name="filter" className="w-5 h-5 text-slate-600" />
            <span className="text-sm">Select Categories</span>
            <Icon name="chevron-down" className="w-4 h-4 text-slate-400" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <button
                onClick={() => handleCategoryToggle('all')}
                className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-gray-50 flex items-center gap-2"
              >
                <Icon name="more" className="w-4 h-4" />
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryToggle(category._id)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Icon name={category.icon} className="w-4 h-4" color={category.color} />
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Selected category chips */}
        {selectedCategoryData.map(category => (
          <div
            key={category._id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{ 
              backgroundColor: `${category.color}20`,
              borderColor: category.color
            }}
          >
            <Icon name={category.icon} className="w-4 h-4" color={category.color} />
            <span className="text-sm font-medium text-slate-700">{category.name}</span>
            <button
              onClick={() => removeCategory(category._id)}
              className="ml-1 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Icon name="close" className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
