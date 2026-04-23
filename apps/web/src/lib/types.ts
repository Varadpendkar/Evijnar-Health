/**
 * Type Definitions for Evijnar Health Platform
 */

// ============================================================================
// HOSPITALS & PROCEDURES
// ============================================================================

export interface Pricing {
  total_cost: number;
  base_procedure: number;
  facility_charges: number;
  anesthesia: number;
  surgeon_fee: number;
  currency: string;
}

export interface Outcomes {
  success_rate: number;
  complication_rate: number;
  average_los_days: number;
}

export interface Service {
  service_name: string;
  description: string;
  department: string;
  department_code: string;
  uhi_code: string;
  pricing: Pricing;
  outcomes: Outcomes;
}

export interface Hospital {
  facility_id: string;
  facility_name: string;
  facility_type: string;
  state: string;
  state_code: string;
  district: string;
  city: string;
  postal_code: string;
  nabh_accredited: boolean;
  jci_accredited: boolean;
  phone: string;
  email: string;
  website: string;
  description: string;
  services: Service[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface HospitalSearchResult {
  hospital_id: string;
  hospital_name: string;
  location: string;
  distance_km?: number;
  price_estimate: number;
  currency: string;
  jci_accredited: boolean;
  success_rate: number;
  estimated_savings: number;
  savings_percentage: number;
}

export interface Procedure {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  typical_cost_usd: number;
  recovery_time_days: number;
  complexity: "low" | "medium" | "high";
  success_rate: number;
}

// ============================================================================
// HEALTH TOURISM
// ============================================================================

export interface Package {
  id: string;
  name: string;
  destination: string;
  country: string;
  duration_days: number;
  included_procedures: string[];
  accommodation: "standard" | "comfort" | "luxury";
  price_usd: number;
  savings_percentage: number;
  highlights: string[];
  image_url?: string;
}

export interface HealthTourismDestination {
  country: string;
  city: string;
  hospitals_count: number;
  avg_price_savings: number;
  popular_procedures: string[];
  visa_requirements: string;
  travel_time_hours: number;
  best_time_to_visit: string;
}

// ============================================================================
// BOOKING & RECOVERY
// ============================================================================

export interface Booking {
  id: string;
  patient_id: string;
  hospital_id: string;
  procedure_id: string;
  scheduled_date: string;
  estimated_cost: number;
  status: "inquiry" | "estimated" | "confirmed" | "completed" | "cancelled";
  travel_details?: {
    arrival_date: string;
    departure_date: string;
    accommodation_required: boolean;
  };
}

export interface RecoveryBridge {
  id: string;
  booking_id: string;
  status: "active" | "paused" | "completed" | "escalated";
  vital_stats: {
    heart_rate: number;
    blood_pressure: string;
    temperature: number;
    oxygen_saturation: number;
  };
  recovery_progress_percentage: number;
  alerts: Alert[];
  next_checkup: string;
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

export interface SearchFilters {
  procedure_code?: string;
  country?: string;
  state?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  accreditation?: "jci" | "nabh" | "both";
  min_success_rate?: number;
  radius_km?: number;
  sort_by?: "price" | "savings" | "success_rate" | "distance";
}

export interface SearchResult {
  hospitals: HospitalSearchResult[];
  total_count: number;
  filters_applied: SearchFilters;
}

// ============================================================================
// FINANCING
// ============================================================================

export interface FinancingOption {
  id: string;
  type: "upi_micro_loan" | "health_emi" | "subsidy_grant" | "insurance_claim";
  amount: number;
  tenure_months: number;
  interest_rate?: number;
  monthly_payment?: number;
  eligibility_criteria: string[];
  approval_time_days: number;
}

// ============================================================================
// USER
// ============================================================================

export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: "patient" | "provider" | "surgeon" | "admin";
  profile_picture_url?: string;
  health_records_url?: string;
}

export interface UserProfile extends User {
  medical_history: string[];
  current_medications: string[];
  allergies: string[];
  insurance_details?: {
    provider: string;
    policy_number: string;
  };
}
