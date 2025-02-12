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
    <div className="relative w-[180px] lg:w-[240px]"> {/* Increased mobile width from 140px to 180px */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-3 w-3 text-gray-400" /> {/* Smaller icon */}
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          title="Search"
          placeholder="Search for services"
          className="w-full pl-6 pr-2 py-1.5 text-xs rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-transparent placeholder-transparent text-gray-200" /* Updated sizing */
        />

        {/* Typewriter Effect Placeholder */}
        {query === '' && (
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xs">Search for </span> {/* Smaller text */}
            <span className="text-gray-500 font-medium ml-1 text-xs"> {/* Smaller text */}
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

      {/* Results Dropdown - Updated positioning and sizing */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#161617] rounded-md shadow-lg border border-gray-700 z-50">
          {results.map((category, index) => (
            <div
              key={category.category}
              className={`p-2 ${index !== 0 ? 'border-t border-gray-700' : ''}`} /* Smaller padding */
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-200 text-xs">{category.category}</h3>
                <span className="text-xs text-gray-400">{category.count} services</span>
              </div>
              <ul className="space-y-0.5">
                {category.services.map((service: string) => (
                  <li
                    key={service}
                    className="px-2 py-1 hover:bg-gray-800 rounded text-xs cursor-pointer text-gray-300 hover:text-white"
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
