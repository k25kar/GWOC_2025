// components/SearchBar.tsx
import { useState, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';
import Typewriter from 'typewriter-effect';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

// Sample data structure
const servicesData = [
  {
    category: 'Bathroom & kitchen cleaning',
    services: ['Kitchen cleaning', 'Bathroom cleaning', 'Grouting', 'Mini services'],
    count: 4,
  },
  {
    category: 'Plumbers',
    services: ['Pipe repair', 'Faucet installation'],
    count: 2,
  },
];

// Sample services for the typewriter effect
const rotatingServices = [
  'Kitchen Cleaning',
  'AC Service',
  'Plumbing',
  'Electrical Repair',
  'Carpentry',
  'Painting',
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ category: string; services: string[]; count: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Configure Fuse.js options
  const fuseOptions = {
    keys: ['services', 'category'],
    threshold: 0.3,
    includeMatches: true,
    minMatchCharLength: 2,
  };

  // Create Fuse instance for fuzzy search
  const fuse = useMemo(() => new Fuse(servicesData, fuseOptions), []);

  // Debounced search handler
  const searchHandler = debounce((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(searchQuery);
    setResults(searchResults.map((result) => result.item));
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    searchHandler(e.target.value);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent placeholder-transparent"
        />

        {/* Typewriter Effect Placeholder - Shows only when query is empty */}
        {query === '' && (
          <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
            <span className="text-gray-400">Search for </span>
            <span className="text-gray-700 font-medium ml-1">
              <Typewriter
                options={{
                  strings: rotatingServices,
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  cursor: '',
                }}
              />
            </span>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {results.map((category, index) => (
            <div
              key={category.category}
              className={`p-4 ${index !== 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">{category.category}</h3>
                <span className="text-sm text-gray-500">{category.count} services</span>
              </div>
              <ul className="space-y-1">
                {category.services.map((service: string) => (
                  <li
                    key={service}
                    className="p-2 hover:bg-blue-50 rounded-md cursor-pointer text-gray-700 hover:text-blue-600"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
