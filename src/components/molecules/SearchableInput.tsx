'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './Input';
 interface Staff {
  id: string;
  name: string;
}

export interface SearchableInputProps {
  data: Staff[];
  searchKeys: (keyof Staff)[];
  onResults: (results: Staff[]) => void;
  onSelectItem: (item: Staff) => void;
  initialValue?: string;
  debounceTime?: number;
  label?: string;
  placeholder?: string;
  renderResultItem?: (item: Staff) => React.ReactNode;
  className?: string;
  leftIcon: React.ReactNode;
}

const SearchableInput = ({
  data,
  searchKeys,
  onResults,
  onSelectItem,
  initialValue = '',
  debounceTime = 300,
  label,
  placeholder = 'Search...',
  className,
  leftIcon = <Search className="h-5 w-5 text-gray-400" />,
  renderResultItem,
  ...props
}: SearchableInputProps) => {
  const [searchTerm, setSearchTerm] = React.useState(initialValue);
  const [filteredResults, setFilteredResults] = React.useState<Staff[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialValue) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredResults([]);
        onResults([]);
        setShowDropdown(false);
        return;
      }

      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = data.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return (
            typeof value === 'string' &&
            value.toLowerCase().includes(lowercasedSearchTerm)
          );
        })
      );
      setFilteredResults(results);
      onResults(results);
      setShowDropdown(results.length > 0);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, data, searchKeys, onResults, debounceTime]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectItem = (item: Staff) => {
    onSelectItem(item);
    // Combine firstName and lastName when available, fallback to first search key
    const displayName = [item.name || '']
      .filter(Boolean)
      .join(' ')
      .trim();
    setSearchTerm(displayName || String(item[searchKeys[0]] || ''));
    setShowDropdown(false);
  };

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

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        label={label}
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() =>
          setShowDropdown(filteredResults.length > 0 && searchTerm.length > 0)
        }
        placeholder={placeholder}
        leftIcon={leftIcon}
        {...props}
      />
      {showDropdown && filteredResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {filteredResults.map((item, index) => (
              <li
                key={index} // Consider using a unique ID from the item if available
                className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => handleSelectItem(item)}
              >
                {renderResultItem
                  ? renderResultItem(item)
                  : String(item[searchKeys[0]])}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

SearchableInput.displayName = 'SearchableInput';

export { SearchableInput };
