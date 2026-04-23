/**
 * Custom React Hooks for API Integration
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "./api-client";
import type {
  Hospital,
  HospitalSearchResult,
  Procedure,
  Booking,
  RecoveryBridge,
  Package,
  SearchFilters,
  SearchResult,
  FinancingOption,
  HealthTourismDestination,
} from "./types";

interface UseQueryOptions {
  skip?: boolean;
  params?: Record<string, unknown>;
}

interface UseQueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface MockHospitalRecord extends HospitalSearchResult {
  country_code: string;
  city_name: string;
  search_terms: string[];
}

const MOCK_HOSPITALS: MockHospitalRecord[] = [
  {
    hospital_id: "hosp-apollo-delhi",
    hospital_name: "Apollo Hospitals Delhi",
    location: "Delhi, India",
    distance_km: 42.5,
    price_estimate: 18000,
    currency: "USD",
    jci_accredited: true,
    success_rate: 96,
    estimated_savings: 22000,
    savings_percentage: 55,
    country_code: "IN",
    city_name: "Delhi",
    search_terms: ["knee", "knee replacement", "orthopedic", "cardiac"],
  },
  {
    hospital_id: "hosp-medanta-gurgaon",
    hospital_name: "Medanta The Medicity",
    location: "Gurgaon, India",
    distance_km: 51.2,
    price_estimate: 24000,
    currency: "USD",
    jci_accredited: true,
    success_rate: 95,
    estimated_savings: 16000,
    savings_percentage: 40,
    country_code: "IN",
    city_name: "Gurgaon",
    search_terms: ["cardiac", "cabg", "heart", "oncology"],
  },
  {
    hospital_id: "hosp-bumrungrad-bangkok",
    hospital_name: "Bumrungrad International Hospital",
    location: "Bangkok, Thailand",
    distance_km: 2100,
    price_estimate: 27000,
    currency: "USD",
    jci_accredited: true,
    success_rate: 97,
    estimated_savings: 13000,
    savings_percentage: 33,
    country_code: "TH",
    city_name: "Bangkok",
    search_terms: ["spine", "orthopedic", "cancer", "robotic surgery"],
  },
];

const MOCK_PROCEDURES: Procedure[] = [
  {
    id: "proc-knee-001",
    name: "Total Knee Replacement",
    code: "27447",
    category: "Orthopedics",
    description: "Complete replacement of knee joint with prosthesis",
    typical_cost_usd: 22000,
    recovery_time_days: 45,
    complexity: "high",
    success_rate: 95,
  },
  {
    id: "proc-cabg-001",
    name: "Coronary Artery Bypass (CABG)",
    code: "33533",
    category: "Cardiology",
    description: "Surgical bypass of blocked coronary arteries",
    typical_cost_usd: 28000,
    recovery_time_days: 60,
    complexity: "high",
    success_rate: 93,
  },
  {
    id: "proc-hip-001",
    name: "Total Hip Replacement",
    code: "27130",
    category: "Orthopedics",
    description: "Replacement of hip joint with artificial implant",
    typical_cost_usd: 20000,
    recovery_time_days: 50,
    complexity: "high",
    success_rate: 94,
  },
];

const MOCK_PACKAGES: Package[] = [
  {
    id: "pkg-ortho-india",
    name: "Ortho Recovery Package",
    destination: "Delhi",
    country: "India",
    duration_days: 14,
    included_procedures: ["Knee Replacement", "Physiotherapy"],
    accommodation: "comfort",
    price_usd: 24500,
    savings_percentage: 48,
    highlights: [
      "Airport transfer and concierge",
      "Dedicated physiotherapy sessions",
      "Post-op teleconsultation",
    ],
  },
  {
    id: "pkg-cardiac-thailand",
    name: "Cardiac Care Package",
    destination: "Bangkok",
    country: "Thailand",
    duration_days: 18,
    included_procedures: ["CABG", "Cardiac rehab"],
    accommodation: "luxury",
    price_usd: 33500,
    savings_percentage: 35,
    highlights: [
      "JCI-accredited care network",
      "Dedicated multilingual care manager",
      "Rehabilitation support",
    ],
  },
];

const MOCK_DESTINATIONS: HealthTourismDestination[] = [
  {
    country: "India",
    city: "Delhi",
    hospitals_count: 120,
    avg_price_savings: 52,
    popular_procedures: ["Orthopedics", "Cardiac Surgery", "Oncology"],
    visa_requirements: "Medical visa recommended with invitation letter",
    travel_time_hours: 8,
    best_time_to_visit: "October to March",
  },
  {
    country: "Thailand",
    city: "Bangkok",
    hospitals_count: 70,
    avg_price_savings: 38,
    popular_procedures: ["Cosmetic Surgery", "Spine Surgery", "Dental"],
    visa_requirements: "Visa-on-arrival available for many countries",
    travel_time_hours: 6,
    best_time_to_visit: "November to February",
  },
];

function buildHospitalFallback(filters?: SearchFilters): SearchResult {
  const query = filters?.procedure_code?.toLowerCase().trim() ?? "";

  const hospitals = MOCK_HOSPITALS.filter((hospital) => {
    const matchesProcedure =
      !query ||
      hospital.search_terms.some((term) => term.includes(query)) ||
      hospital.hospital_name.toLowerCase().includes(query);

    const matchesCountry =
      !filters?.country ||
      hospital.country_code
        .toLowerCase()
        .includes(filters.country.toLowerCase()) ||
      hospital.location.toLowerCase().includes(filters.country.toLowerCase());

    const matchesCity =
      !filters?.city ||
      hospital.city_name.toLowerCase().includes(filters.city.toLowerCase());

    const matchesPrice =
      !filters?.max_price || hospital.price_estimate <= filters.max_price;

    const matchesSuccessRate =
      !filters?.min_success_rate ||
      hospital.success_rate >= filters.min_success_rate;

    return (
      matchesProcedure &&
      matchesCountry &&
      matchesCity &&
      matchesPrice &&
      matchesSuccessRate
    );
  }).map(({ search_terms, country_code, city_name, ...hospital }) => hospital);

  return {
    hospitals,
    total_count: hospitals.length,
    filters_applied: filters ?? {},
  };
}

// Generic fetch hook
export function useFetch<T>(
  endpoint: string,
  options: UseQueryOptions = {},
): UseQueryState<T> {
  const [state, setState] = useState<UseQueryState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (options.skip) return;

    const serializedParams = JSON.stringify(options.params ?? {});

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const params = JSON.parse(serializedParams) as Record<string, unknown>;
        const data = await apiClient.get<T>(endpoint, params);
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    fetchData();
  }, [endpoint, options.skip, JSON.stringify(options.params ?? {})]);

  return state;
}

// ============================================================================
// HOSPITAL HOOKS
// ============================================================================

export function useHospitals(filters?: SearchFilters) {
  const params = filters
    ? {
        procedure_code: filters.procedure_code,
        country: filters.country,
        state: filters.state,
        city: filters.city,
        min_price: filters.min_price,
        max_price: filters.max_price,
        radius_km: filters.radius_km,
      }
    : {};

  const state = useFetch<SearchResult>("/hospitals/search", {
    skip: !filters?.procedure_code,
    params,
  });

  if (state.error && filters?.procedure_code) {
    return {
      data: buildHospitalFallback(filters),
      loading: false,
      error: null,
    } as UseQueryState<SearchResult>;
  }

  return state;
}

export function useHospitalDetails(hospitalId: string) {
  return useFetch<Hospital>(`/hospitals/${hospitalId}`, {
    skip: !hospitalId,
  });
}

export function useHospitalProcedures(hospitalId: string) {
  return useFetch<{ procedures: Procedure[] }>(
    `/hospitals/${hospitalId}/procedures`,
    {
      skip: !hospitalId,
    },
  );
}

// ============================================================================
// PROCEDURE HOOKS
// ============================================================================

export function useProcedures() {
  const state = useFetch<Procedure[]>("/procedures");

  if (state.error) {
    return {
      data: MOCK_PROCEDURES,
      loading: false,
      error: null,
    } as UseQueryState<Procedure[]>;
  }

  return state;
}

export function useProcedureSearch(query: string) {
  const [results, setResults] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await apiClient.get<Procedure[]>("/procedures/search", {
        q: searchQuery,
      });
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Search failed"));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  return { results, loading, error };
}

// ============================================================================
// BOOKING HOOKS
// ============================================================================

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBooking = useCallback(async (bookingData: Partial<Booking>) => {
    try {
      setLoading(true);
      const data = await apiClient.post<Booking>("/bookings", bookingData);
      setError(null);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Booking failed");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBooking, loading, error };
}

export function useBooking(bookingId: string) {
  return useFetch<Booking>(`/bookings/${bookingId}`, {
    skip: !bookingId,
  });
}

export function useUserBookings() {
  return useFetch<Booking[]>("/bookings/my-bookings");
}

// ============================================================================
// RECOVERY BRIDGE HOOKS
// ============================================================================

export function useRecoveryBridge(bookingId: string) {
  return useFetch<RecoveryBridge>(`/recovery/${bookingId}`, {
    skip: !bookingId,
  });
}

export function useUpdateVitals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateVitals = useCallback(
    async (bookingId: string, vitals: RecoveryBridge["vital_stats"]) => {
      try {
        setLoading(true);
        const data = await apiClient.patch<RecoveryBridge>(
          `/recovery/${bookingId}/vitals`,
          vitals,
        );
        setError(null);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Update failed");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateVitals, loading, error };
}

// ============================================================================
// HEALTH TOURISM HOOKS
// ============================================================================

export function useHealthTourismPackages() {
  const state = useFetch<Package[]>("/health-tourism/packages");

  if (state.error) {
    return {
      data: MOCK_PACKAGES,
      loading: false,
      error: null,
    } as UseQueryState<Package[]>;
  }

  return state;
}

export function useHealthTourismDestinations() {
  const state = useFetch<HealthTourismDestination[]>(
    "/health-tourism/destinations",
  );

  if (state.error) {
    return {
      data: MOCK_DESTINATIONS,
      loading: false,
      error: null,
    } as UseQueryState<HealthTourismDestination[]>;
  }

  return state;
}

export function usePackageDetails(packageId: string) {
  return useFetch<Package>(`/health-tourism/packages/${packageId}`, {
    skip: !packageId,
  });
}

// ============================================================================
// FINANCING HOOKS
// ============================================================================

export function useFinancingOptions(procedure: string, cost: number) {
  const [options, setOptions] = useState<FinancingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<FinancingOption[]>(
          "/financing/options",
          {
            procedure,
            amount: cost,
          },
        );
        setOptions(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch options"),
        );
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (procedure && cost > 0) {
      fetchOptions();
    }
  }, [procedure, cost]);

  return { options, loading, error };
}

// ============================================================================
// SEARCH HOOKS
// ============================================================================

export function useGlobalSearch(query: string) {
  const [results, setResults] = useState<{
    hospitals: HospitalSearchResult[];
    procedures: Procedure[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get("/search/global", { q: query });
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Search failed"));
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading, error };
}
