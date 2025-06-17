'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './Input';
import { Skeleton } from '../atoms/skeleton';

export interface SearchResult {
  id: string;
  name: string;
}

export interface SearchInputProps {
  results: SearchResult[];
  isLoading?: boolean;
  onResultSelect: (staff: { id: string; name: string }) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hasSearched?: boolean;
}

const SearchInput = ({
  results,
  isLoading = false,
  onResultSelect,
  onChange,
  value = '',
  label,
  placeholder = 'Search...',
  className,
  disabled = false,
  hasSearched = false,
  ...props
}: SearchInputProps) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Only show dropdown when there are results
  React.useEffect(() => {
    setShowDropdown(results.length > 0);
  }, [results]);

  const handleSelectItem = (staff: { id: string; name: string }) => {
    onResultSelect(staff);
    setShowDropdown(false);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        label={label}
        type="search"
        value={value}
        onChange={onChange}
        onFocus={() => setShowDropdown(results.length > 0)}
        placeholder={placeholder}
        leftIcon={<Search className="h-5 w-5 text-gray-400" />}
        disabled={disabled}
        {...props}
      />
      {!isLoading &&
        !results.length &&
        value &&
        value.length > 0 &&
        !hasSearched && (
          <p className="mt-1 text-xs text-[#667185]">
            Press Enter or click Search to find results
          </p>
        )}
      {!isLoading &&
        !results.length &&
        hasSearched &&
        value &&
        value.length > 0 && (
          <div className="absolute mt-1 p-3 text-sm text-[#667185] bg-gray-50 rounded-md border border-gray-200">
            No results found for &quot;{value}&quot;. Try a different search term.
          </div>
        )}

      {isLoading && <Skeleton className="absolute mt-1 h-20 w-full"></Skeleton>}

      {!isLoading && showDropdown && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {results.map((result) => (
              <li
                key={result.id}
                className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => handleSelectItem(result)}
              >
                <div className="flex items-center gap-2 text-base">
                  <span className="font-medium">{result.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

SearchInput.displayName = 'SearchInput';

export { SearchInput };
