"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import Typewriter from "typewriter-effect";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string; category: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Sample services for the typewriter effect
  const rotatingServices = [
    "Kitchen Cleaning",
    "AC Service",
    "Plumbing",
    "Electrical Repair",
    "Carpentry",
    "Painting",
  ];

  // Fetch search results from API
  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/searchbar/search?query=${searchQuery}`);
      const data = await response.json();
      setResults(data.services || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Debounced search handler
  const debouncedSearch = debounce(fetchResults, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Handle category selection and navigate to Services Page
  const handleCategoryClick = (category: string) => {
    router.push(`/services?page=features&category=${encodeURIComponent(category)}`);
  };


  return (
    <div className="relative w-[180px] lg:w-[240px]">
      {/* Search Box */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-3 w-3 text-gray-400" />
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          title="Search"
          placeholder="Search for services"
          className="w-full pl-6 pr-2 py-1.5 text-xs rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-transparent placeholder-transparent text-gray-200"
        />

        {/* Typewriter Effect Placeholder */}
        {query === "" && (
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xs">Search for </span>
            <span className="text-gray-500 font-medium ml-1 text-xs">
              <Typewriter
                options={{
                  strings: rotatingServices,
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  cursor: "",
                }}
              />
            </span>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#161617] rounded-md shadow-lg border border-gray-700 z-50">
          {results.map((service, index) => (
            <div
              key={service.name}
              className={`p-2 ${index !== 0 ? "border-t border-gray-700" : ""}`}
              onClick={() => handleCategoryClick(service.category)}
            >
              <h3 className="font-semibold text-gray-200 text-xs">{service.name}</h3>
              <span className="text-xs text-gray-400">{service.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
