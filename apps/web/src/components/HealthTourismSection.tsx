"use client";

import {
  useHealthTourismPackages,
  useHealthTourismDestinations,
} from "@/lib/hooks";
import { MapPin, Heart, Plane, AlertCircle } from "lucide-react";

export function HealthTourismPackages() {
  const { data: packages, loading, error } = useHealthTourismPackages();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-40 bg-gray-light rounded mb-4"></div>
            <div className="h-6 bg-gray-light rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-light rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 border-l-4 border-red-alert">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-alert flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-alert">
              Error Loading Packages
            </p>
            <p className="text-sm text-gray-medium">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!packages?.length) {
    return (
      <p className="text-center text-gray-medium py-8">No packages available</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="card overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Image Placeholder */}
          <div className="h-40 bg-gradient-to-br from-emerald-light to-navy-light flex items-center justify-center">
            <Plane className="w-12 h-12 text-white opacity-30" />
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-navy text-lg">{pkg.name}</h3>
              <p className="text-sm text-emerald flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {pkg.city}, {pkg.country}
              </p>
            </div>

            {/* Duration */}
            <p className="text-sm text-gray-medium">
              Duration: {pkg.duration_days} days | Procedures:{" "}
              {pkg.included_procedures.length}
            </p>

            {/* Accommodation */}
            <div className="text-xs">
              <span className="inline-block px-2 py-1 bg-gray-light text-gray-dark rounded capitalize">
                {pkg.accommodation} Accommodation
              </span>
            </div>

            {/* Highlights */}
            <div className="space-y-1">
              {pkg.highlights.slice(0, 2).map((highlight, idx) => (
                <p
                  key={idx}
                  className="text-xs text-gray-medium flex items-start gap-2"
                >
                  <span className="text-emerald mt-0.5">✓</span>
                  {highlight}
                </p>
              ))}
            </div>

            {/* Price & Savings */}
            <div className="bg-emerald-light p-3 rounded-lg space-y-1">
              <p className="text-xs text-gray-medium">Total Package</p>
              <p className="text-2xl font-bold text-emerald">
                ${pkg.price_usd.toLocaleString()}
              </p>
              <p className="text-xs text-emerald font-semibold">
                Save {pkg.savings_percentage}% vs local pricing
              </p>
            </div>

            {/* CTA */}
            <button className="w-full btn-primary btn-sm flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HealthTourismDestinations() {
  const { data: destinations, loading, error } = useHealthTourismDestinations();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-6 bg-gray-light rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-light rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 border-l-4 border-red-alert">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-alert flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-medium">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!destinations?.length) {
    return (
      <p className="text-center text-gray-medium py-8">
        No destinations available
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {destinations.map((dest) => (
        <div
          key={`${dest.country}-${dest.city}`}
          className="card p-4 space-y-3"
        >
          <div>
            <h3 className="font-bold text-navy text-lg">
              {dest.city}, {dest.country}
            </h3>
            <p className="text-sm text-emerald flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {dest.hospitals_count} hospitals
            </p>
          </div>

          {/* Key Stats */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <p className="text-gray-dark">
              <span className="font-semibold">Average Savings:</span>{" "}
              {dest.avg_price_savings}%
            </p>
            <p className="text-gray-dark">
              <span className="font-semibold">Travel Time:</span> ~
              {dest.travel_time_hours}h
            </p>
            <p className="text-gray-dark">
              <span className="font-semibold">Best Time:</span>{" "}
              {dest.best_time_to_visit}
            </p>
          </div>

          {/* Popular Procedures */}
          <div>
            <p className="text-xs font-semibold text-gray-medium mb-2">
              Popular Procedures:
            </p>
            <div className="flex flex-wrap gap-2">
              {dest.popular_procedures.slice(0, 3).map((proc) => (
                <span
                  key={proc}
                  className="text-xs bg-emerald-light text-emerald px-2 py-1 rounded"
                >
                  {proc}
                </span>
              ))}
            </div>
          </div>

          {/* Visa Info */}
          <p className="text-xs text-gray-medium italic">
            {dest.visa_requirements}
          </p>

          <button className="w-full btn-secondary btn-sm">
            Explore Destination
          </button>
        </div>
      ))}
    </div>
  );
}
