"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Mic,
  Globe,
  MapPin,
  Check,
  AlertCircle,
  MoreVertical,
  Heart,
  Thermometer,
  Shield,
  DollarSign,
  CreditCard,
  ArrowRight,
  Settings,
  Menu,
  Search as SearchIcon,
  Plane,
  Building2,
  PiggyBank,
  HeartPulse,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import clsx from "clsx";
import { SearchBar } from "@/components/SearchBar";
import { HospitalsGrid } from "@/components/HospitalsGrid";
import { ProceduresList } from "@/components/ProceduresList";
import {
  HealthTourismPackages,
  HealthTourismDestinations,
} from "@/components/HealthTourismSection";

type SearchMode = "local" | "global";
type SortBy = "price" | "accreditation" | "savings";
interface SearchFilters {
  procedure_code?: string;
  location?: string;
  priceRange?: { min: number; max: number };
  [key: string]: any;
}
interface Hospital {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  jciAccredited: boolean;
  successRate: number;
  estimatedSavings: number;
  savingsPercentage: number;
  type: "local" | "global";
  country?: string;
  specialization?: string;
}

type VitalStats = {
  heartRate: number;
  temperature: number;
  isStable: boolean;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("local");
  const [sortBy, setSortBy] = useState<SortBy>("price");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showRecoveryBridge, setShowRecoveryBridge] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(
    null,
  );
  const [vitalStats, setVitalStats] = useState<VitalStats>({
    heartRate: 72,
    temperature: 37.2,
    isStable: true,
  });
  const micRef = useRef<HTMLButtonElement>(null);
  const [currentView, setCurrentView] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mockHospitals: Hospital[] = [
    {
      id: "local-1",
      name: "City General Hospital",
      location: "New York, USA",
      price: 45000,
      currency: "USD",
      jciAccredited: true,
      successRate: 97,
      estimatedSavings: 0,
      savingsPercentage: 0,
      type: "local",
    },
    {
      id: "global-1",
      name: "Apollo Hospitals",
      location: "Delhi, India",
      price: 8500,
      currency: "USD",
      jciAccredited: true,
      successRate: 98.5,
      estimatedSavings: 36500,
      savingsPercentage: 81,
      type: "global",
      country: "India",
      specialization: "Center of Excellence",
    },
    {
      id: "global-2",
      name: "Medanta Orthopedic Hospital",
      location: "Gurgaon, India",
      price: 7200,
      currency: "USD",
      jciAccredited: true,
      successRate: 99,
      estimatedSavings: 37800,
      savingsPercentage: 84,
      type: "global",
      country: "India",
      specialization: "Center of Excellence",
    },
  ];

  useEffect(() => {
    // Simulate real-time vitals update
    const interval = setInterval(() => {
      setVitalStats((prev) => ({
        heartRate: Math.max(
          60,
          Math.min(100, prev.heartRate + (Math.random() - 0.5) * 10),
        ),
        temperature: Math.max(
          36.5,
          Math.min(38.5, prev.temperature + (Math.random() - 0.5) * 0.2),
        ),
        isStable: Math.random() > 0.1,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setCurrentView("search");
  };

  const handleProcedureSelect = (procedureCode: string) => {
    setSearchFilters({ procedure_code: procedureCode });
    setCurrentView("search");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-navy sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-2xl">Evijnar</h1>
              <p className="text-emerald text-xs font-semibold hidden md:inline">
                Global Health Arbitrage
              </p>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {(
                [
                  "home",
                  "search",
                  "procedures",
                  "tourism",
                  "recovery",
                  "bookings",
                ] as const
              ).map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={clsx(
                    "text-sm font-semibold transition-colors",
                    currentView === view
                      ? "text-emerald"
                      : "text-white hover:text-emerald-light",
                  )}
                >
                  {view === "home" && "Home"}
                  {view === "search" && "Search"}
                  {view === "procedures" && "Procedures"}
                  {view === "tourism" && "Tourism"}
                  {view === "recovery" && "Recovery"}
                  {view === "bookings" && "Bookings"}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-navy-light rounded-lg hidden md:block">
                <Settings className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-navy-light rounded-lg"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2 border-t border-navy-light pt-4">
              {(
                [
                  "home",
                  "search",
                  "procedures",
                  "tourism",
                  "recovery",
                  "bookings",
                ] as const
              ).map((view) => (
                <button
                  key={view}
                  onClick={() => {
                    setCurrentView(view);
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "w-full text-left px-4 py-2 rounded transition-colors",
                    currentView === view
                      ? "bg-emerald text-white"
                      : "text-white hover:bg-navy-light",
                  )}
                >
                  {view === "home" && "Home"}
                  {view === "search" && "Search"}
                  {view === "procedures" && "Procedures"}
                  {view === "tourism" && "Tourism"}
                  {view === "recovery" && "Recovery"}
                  {view === "bookings" && "Bookings"}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "home" && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h1 className="text-h1">Global Health at Your Fingertips</h1>
              <p className="text-body text-gray-medium">
                Access world-class healthcare. Save up to 80% on procedures from
                JCI-certified hospitals.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => setCurrentView("search")}
                  className="btn-primary flex items-center gap-2 justify-center"
                >
                  <SearchIcon className="w-5 h-5" /> Start Search
                </button>
                <button
                  onClick={() => setCurrentView("tourism")}
                  className="btn-secondary flex items-center gap-2 justify-center"
                >
                  <Plane className="w-5 h-5" /> Explore Tourism
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-h2">Why Choose Evijnar?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: Building2,
                    title: "World-Class Hospitals",
                    desc: "JCI-accredited facilities",
                  },
                  {
                    icon: PiggyBank,
                    title: "Up to 80% Savings",
                    desc: "Same quality, lower cost",
                  },
                  {
                    icon: HeartPulse,
                    title: "24/7 Support",
                    desc: "Global doctor team",
                  },
                  {
                    icon: Plane,
                    title: "All-Inclusive",
                    desc: "Travel included",
                  },
                  {
                    icon: ShieldCheck,
                    title: "HIPAA Safe",
                    desc: "Encrypted data",
                  },
                  {
                    icon: Smartphone,
                    title: "Easy Financing",
                    desc: "0% EMI options",
                  },
                ].map((f, i) => (
                  <div key={i} className="card p-6 space-y-3 hover:shadow-lg">
                    <f.icon className="w-8 h-8 text-emerald" />
                    <h3 className="font-bold text-navy">{f.title}</h3>
                    <p className="text-sm text-gray-medium">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-navy p-8">
              <h2 className="text-h2 text-white mb-6">By The Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { num: "500+", label: "Hospitals" },
                  { num: "50+", label: "Countries" },
                  { num: "100K+", label: "Patients" },
                  { num: "$2B+", label: "Savings" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-emerald">
                      {s.num}
                    </p>
                    <p className="text-sm text-white/80 mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === "search" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-h1 mb-2">Find Your Treatment</h1>
              <p className="text-gray-medium">
                Search hospitals and compare prices globally
              </p>
            </div>
            <SearchBar
              onSearch={handleSearch}
              onProcedureSelect={handleProcedureSelect}
            />
            {searchFilters && (
              <div className="space-y-6">
                <h2 className="text-h2">Hospitals & Clinics</h2>
                <HospitalsGrid filters={searchFilters} />
              </div>
            )}
          </div>
        )}

        {currentView === "procedures" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-h1 mb-2">Browse Procedures</h1>
              <p className="text-gray-medium">
                Explore available procedures, costs, and outcomes
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <h3 className="font-bold text-navy">Filter</h3>
                  <div className="card p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-dark mb-2">
                        Category
                      </label>
                      <select className="input-base text-sm w-full">
                        <option>All Categories</option>
                        <option>Orthopedics</option>
                        <option>Cardiology</option>
                        <option>Oncology</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <ProceduresList onSelectProcedure={handleProcedureSelect} />
              </div>
            </div>
          </div>
        )}

        {currentView === "tourism" && (
          <div className="space-y-12">
            <div>
              <h1 className="text-h1 mb-2">Health Tourism Packages</h1>
              <p className="text-gray-medium">
                Treatment combined with travel experiences
              </p>
            </div>
            <section className="space-y-4">
              <h2 className="text-h2">Featured Packages</h2>
              <HealthTourismPackages />
            </section>
            <section className="space-y-4">
              <h2 className="text-h2">Popular Destinations</h2>
              <HealthTourismDestinations />
            </section>
          </div>
        )}

        {currentView === "recovery" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-h1 mb-2">Recovery Bridge Portal</h1>
              <p className="text-gray-medium">
                Real-time monitoring with your surgical team
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="card-navy p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-emerald rounded-full" />
                      <div>
                        <p className="font-bold text-white">
                          Active Monitoring
                        </p>
                        <p className="text-sm text-white/80">
                          Dr. Rajesh Kumar
                        </p>
                      </div>
                    </div>
                    <span className="badge bg-emerald text-white">SAFE</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-h3">Live Vitals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card p-6 space-y-3">
                      <div className="flex items-center gap-2 text-red-alert">
                        <Heart className="w-5 h-5" />
                        <p className="text-sm font-semibold">Heart Rate</p>
                      </div>
                      <p className="text-4xl font-bold text-red-alert">
                        {Math.round(vitalStats.heartRate)}
                      </p>
                      <p className="text-xs text-gray-medium">bpm • 60-100</p>
                    </div>
                    <div className="card p-6 space-y-3">
                      <div className="flex items-center gap-2 text-orange-600">
                        <Thermometer className="w-5 h-5" />
                        <p className="text-sm font-semibold">Temperature</p>
                      </div>
                      <p className="text-4xl font-bold text-orange-600">
                        {vitalStats.temperature.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-medium">°C • 36.5-37.5</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="card p-4">
                  <h4 className="font-bold text-navy mb-3">Quick Actions</h4>
                  <button className="w-full btn-primary btn-sm mb-2">
                    Contact Doctor
                  </button>
                  <button className="w-full btn-secondary btn-sm">
                    Video Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "bookings" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-h1 mb-2">My Bookings</h1>
              <p className="text-gray-medium">Manage your appointments</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  status: "Confirmed",
                  proc: "Knee Replacement",
                  hosp: "Apollo Hospitals",
                  date: "May 15, 2026",
                  doc: "Dr. Kumar",
                },
                {
                  status: "Inquiry",
                  proc: "CABG Surgery",
                  hosp: "Medanta Hospital",
                  date: "May 25, 2026",
                  doc: "Dr. Sharma",
                },
              ].map((b, i) => (
                <div key={i} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-navy text-lg">
                          {b.proc}
                        </h3>
                        <span
                          className={clsx(
                            "text-xs font-semibold px-3 py-1 rounded-full",
                            b.status === "Confirmed"
                              ? "bg-emerald text-white"
                              : "bg-yellow-100",
                          )}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-medium">{b.hosp}</p>
                      <p className="text-sm text-gray-medium">Dr: {b.doc}</p>
                    </div>
                    <p className="text-sm font-semibold">{b.date}</p>
                  </div>
                  <div className="flex gap-3 border-t border-gray-light pt-4">
                    <button className="flex-1 btn-primary btn-sm">
                      Details
                    </button>
                    <button className="flex-1 btn-secondary btn-sm">
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-navy text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Evijnar</h4>
              <p className="text-sm text-white/80">
                Global healthcare access for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-emerald">
                    Search Hospitals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald">
                    Browse Procedures
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald">
                    Health Tourism
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-emerald">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-emerald">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald">
                    HIPAA
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-light pt-8 text-center text-sm text-white/60">
            <p>&copy; 2026 Evijnar Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
