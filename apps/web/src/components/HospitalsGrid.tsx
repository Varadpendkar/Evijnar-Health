"use client";

import { useHospitals } from "@/lib/hooks";
import type { SearchFilters } from "@/lib/types";
import { MapPin, DollarSign, Check, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface HospitalsGridProps {
  filters?: SearchFilters;
  isLoading?: boolean;
}

export function HospitalsGrid({ filters }: HospitalsGridProps) {
  const { data, loading, error } = useHospitals(filters);

  if (!filters?.procedure_code) {
    return (
      <div className="text-center py-8 text-gray-medium">
        <p>Select a procedure to search for hospitals</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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
          <div>
            <p className="font-semibold text-red-alert">
              Error Loading Hospitals
            </p>
            <p className="text-sm text-gray-medium">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.hospitals.length) {
    return (
      <div className="text-center py-8 text-gray-medium">
        <p>No hospitals found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.hospitals.map((hospital) => (
        <div key={hospital.hospital_id} className="card p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-navy">{hospital.hospital_name}</h3>
              <p className="text-caption text-gray-medium flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {hospital.location}
                {hospital.distance_km &&
                  ` (${hospital.distance_km.toFixed(1)} km)`}
              </p>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-caption text-gray-medium">Procedure Cost</p>
            <p className="text-2xl font-bold text-navy">
              {hospital.currency} {hospital.price_estimate.toLocaleString()}
            </p>
          </div>

          {/* Savings Badge */}
          {hospital.estimated_savings > 0 && (
            <div className="bg-emerald-light p-3 rounded-lg">
              <p className="text-sm font-semibold text-emerald">
                Save {hospital.currency}{" "}
                {hospital.estimated_savings.toLocaleString()} (
                {hospital.savings_percentage}%)
              </p>
            </div>
          )}

          {/* Accreditation & Success Rate */}
          <div className="flex gap-2 flex-wrap">
            {hospital.jci_accredited && (
              <span className="badge badge-success flex items-center gap-1 text-xs">
                <Check className="w-3 h-3" />
                JCI Accredited
              </span>
            )}
            <span
              className={clsx(
                "badge text-xs font-semibold",
                hospital.success_rate >= 95 ? "badge-success" : "badge-navy",
              )}
            >
              ✓ {hospital.success_rate}% Success
            </span>
          </div>

          {/* Action */}
          <button className="w-full btn-primary btn-sm mt-4">
            View Details & Book
          </button>
        </div>
      ))}
    </div>
  );
}
