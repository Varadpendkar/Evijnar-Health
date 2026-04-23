"use client";

import { useState, useCallback } from "react";
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  DollarSign,
  Award,
} from "lucide-react";
import clsx from "clsx";
import type { SearchFilters } from "@/lib/types";

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  onProcedureSelect?: (procedure: string) => void;
}

export function SearchBar({ onSearch, onProcedureSelect }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = useCallback(() => {
    onSearch?.({ ...filters, procedure_code: searchQuery });
    onProcedureSelect?.(searchQuery);
  }, [searchQuery, filters, onSearch, onProcedureSelect]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (searchQuery) {
      onSearch?.({ ...newFilters, procedure_code: searchQuery });
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search procedures, symptoms, or hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="input-base pl-4"
          />
          <SearchIcon className="absolute right-3 top-3 text-gray-medium w-5 h-5" />
        </div>
        <button
          onClick={handleSearch}
          className="btn-primary flex items-center gap-2"
        >
          <SearchIcon className="w-5 h-5" />
          Search
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={clsx(
            "px-4 py-2 rounded-lg transition-all flex items-center gap-2",
            showAdvanced
              ? "bg-navy text-white"
              : "bg-gray-light text-gray-dark hover:bg-gray-200",
          )}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="card p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Country/City
              </label>
              <input
                type="text"
                placeholder="e.g., India, Delhi"
                className="input-base text-sm"
                onChange={(e) =>
                  handleFilterChange("country", e.target.value || undefined)
                }
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Max Price (USD)
              </label>
              <input
                type="number"
                placeholder="e.g., 50000"
                className="input-base text-sm"
                onChange={(e) =>
                  handleFilterChange(
                    "max_price",
                    e.target.value ? parseInt(e.target.value) : undefined,
                  )
                }
              />
            </div>

            {/* Accreditation */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                Accreditation
              </label>
              <select
                className="input-base text-sm"
                onChange={(e) =>
                  handleFilterChange(
                    "accreditation",
                    e.target.value || undefined,
                  )
                }
              >
                <option value="">Any</option>
                <option value="jci">JCI Accredited</option>
                <option value="nabh">NABH Accredited</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Success Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2">
                Min Success Rate
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 95"
                className="input-base text-sm"
                onChange={(e) =>
                  handleFilterChange(
                    "min_success_rate",
                    e.target.value ? parseInt(e.target.value) : undefined,
                  )
                }
              />
            </div>

            {/* Sort By */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-dark mb-2">
                Sort By
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["price", "savings", "success_rate", "distance"].map(
                  (sort) => (
                    <button
                      key={sort}
                      onClick={() => handleFilterChange("sort_by", sort)}
                      className={clsx(
                        "px-3 py-2 rounded text-sm font-medium transition-all",
                        filters.sort_by === sort
                          ? "bg-navy text-white"
                          : "bg-white border border-gray-light text-gray-dark hover:border-navy",
                      )}
                    >
                      {sort === "price" && "Price"}
                      {sort === "savings" && "Savings"}
                      {sort === "success_rate" && "Quality"}
                      {sort === "distance" && "Distance"}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setFilters({});
              setShowAdvanced(false);
            }}
            className="w-full px-3 py-2 text-sm font-medium text-navy border border-navy rounded hover:bg-navy hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
