"use client";

import { useProcedures } from "@/lib/hooks";
import { AlertCircle, TrendingUp, DollarSign, Clock3 } from "lucide-react";

interface ProceduresListProps {
  onSelectProcedure?: (procedureCode: string) => void;
}

export function ProceduresList({ onSelectProcedure }: ProceduresListProps) {
  const { data: procedures, loading, error } = useProcedures();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-5 bg-gray-light rounded w-1/2 mb-2"></div>
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
              Error Loading Procedures
            </p>
            <p className="text-sm text-gray-medium">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!procedures?.length) {
    return (
      <p className="text-center text-gray-medium py-8">
        No procedures available
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {procedures.map((procedure) => (
        <button
          key={procedure.id}
          onClick={() => onSelectProcedure?.(procedure.code)}
          className="w-full card p-4 text-left hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-navy group-hover:text-emerald transition-colors">
                {procedure.name}
              </h3>
              <p className="text-sm text-gray-medium mt-1">
                {procedure.description}
              </p>
              <div className="flex gap-3 mt-2 text-xs">
                <span className="text-gray-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ~${procedure.typical_cost_usd.toLocaleString()}
                </span>
                <span className="text-emerald flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {procedure.success_rate}% Success
                </span>
                <span className="text-gray-medium flex items-center gap-1">
                  <Clock3 className="w-3 h-3" />
                  {procedure.recovery_time_days} days recovery
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
