import { useState, useCallback } from '@lynx-js/react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search for movies, TV shows...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  const handleInputChange = useCallback((e: any) => {
    'background only'
    setQuery(e.target.value);
  }, []);
  
  const handleSearch = useCallback(() => {
    'background only'
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);
  
  const handleKeyPress = useCallback((e: any) => {
    'background only'
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);
  
  const handleClear = useCallback(() => {
    'background only'
    setQuery('');
  }, []);
  
  return (
    <view className="search-bar">
      <view className="search-input-container">
        <input
          type="text"
          className="search-input"
          value={query}
          onInput={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
        />
        
        {query && (
          <view className="search-clear" bindtap={handleClear}>
            <text className="search-clear-icon">×</text>
          </view>
        )}
      </view>
      
      <view className="search-button" bindtap={handleSearch}>
        <text className="search-button-text">Search</text>
      </view>
    </view>
  );
} 