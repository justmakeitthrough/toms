import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ProposalStatus = "NEW" | "CONFIRMED" | "CANCELLED";
export type VoucherStatus = "PENDING_PAYMENT" | "PAID" | "COMPLETED" | "CANCELLED";

// Company/Organization Types
export interface CompanyInfo {
  id: string;
  name: string;
  logo?: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  licenseNumber?: string;
  currency: string;
}

// Master Data Types
export interface Destination {
  id: string;
  code: string;
  name: string;
  country: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  address: string;
  starRating: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  roomTypes?: string[]; // e.g., ["Single", "Double", "Triple"]
  boardTypes?: string[]; // e.g., ["BB", "HB", "FB"]
  currencies?: string[]; // e.g., ["USD", "EUR", "TRY"]
  isActive: boolean;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  country: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  commissionRate: string;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface GlobalLookup {
  id: string;
  category: "vehicleTypes" | "flightTypes" | "carTypes" | "serviceTypes";
  name: string;
  description?: string;
  createdAt: string;
}

export interface Source {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Service Entry Types
export interface HotelEntry {
  id: number;
  destinationId: string;
  hotelId: string;
  checkin: string;
  checkout: string;
  nights: number;
  roomType: string;
  boardType: string;
  numRooms: number;
  currency: string;
  pricePerNight: string;
  totalPrice: number;
}

export interface TransportationEntry {
  id: number;
  destinationId: string;
  date: string;
  description: string;
  vehicleType: string;
  numDays: number;
  numVehicles: number;
  currency: string;
  pricePerDay: string;
  totalPrice: number;
}

export interface FlightEntry {
  id: number;
  date: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightType: string;
  airline: string;
  pax: number;
  currency: string;
  pricePerPax: string;
  totalPrice: number;
}

export interface RentACarEntry {
  id: number;
  destinationId: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  carType: string;
  numDays: number;
  numCars: number;
  currency: string;
  pricePerDay: string;
  totalPrice: number;
}

export interface AdditionalServiceEntry {
  id: number;
  destinationId: string;
  date: string;
  description: string;
  serviceType: string;
  numDays: number;
  numPax: number;
  currency: string;
  pricePerPax: string;
  totalPrice: number;
}

export interface Proposal {
  id: string;
  reference: string;
  source: string;
  agencyId: string;
  salesPersonId: string;
  destinationIds: string[]; // Changed from destinationId to array
  estimatedNights: string;
  status: ProposalStatus;
  createdAt: string;
  hotels: HotelEntry[];
  transportation: TransportationEntry[];
  flights: FlightEntry[];
  rentACar: RentACarEntry[];
  additionalServices: AdditionalServiceEntry[];
  overallMargin: string;
  commission: string;
  pdfLanguage: string;
  displayCurrency: string;
}

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  birthDate: string;
}

export interface Voucher {
  id: string;
  proposalId: string;
  proposalReference: string;
  serviceType: "hotel" | "transportation" | "flight" | "rentacar" | "additional";
  serviceId: number;
  status: VoucherStatus;
  source: string; // Changed from 'channel' to 'source' to match master data
  agencyId: string;
  salesPersonId: string;
  guests: Guest[];
  adults: number;
  children: number;
  totalPax: number;
  notes: string;
  serviceData: any;
}

interface DataContextType {
  // Company Info
  companyInfo: CompanyInfo | null;
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => void;
  
  // Master Data
  destinations: Destination[];
  hotels: Hotel[];
  agencies: Agency[];
  users: User[];
  globalLookups: GlobalLookup[];
  sources: Source[];
  
  // Proposals & Vouchers
  proposals: Proposal[];
  vouchers: Voucher[];
  
  // Destination CRUD
  addDestination: (destination: Destination) => void;
  updateDestination: (id: string, destination: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  getDestination: (id: string) => Destination | undefined;
  
  // Hotel CRUD
  addHotel: (hotel: Hotel) => void;
  updateHotel: (id: string, hotel: Partial<Hotel>) => void;
  deleteHotel: (id: string) => void;
  getHotel: (id: string) => Hotel | undefined;
  getHotelsByDestination: (destinationId: string) => Hotel[];
  
  // Agency CRUD
  addAgency: (agency: Agency) => void;
  updateAgency: (id: string, agency: Partial<Agency>) => void;
  deleteAgency: (id: string) => void;
  getAgency: (id: string) => Agency | undefined;
  
  // User CRUD
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
  
  // Source CRUD
  addSource: (source: Source) => void;
  updateSource: (id: string, source: Partial<Source>) => void;
  deleteSource: (id: string) => void;
  getSource: (id: string) => Source | undefined;
  
  // Proposal CRUD
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, proposal: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  getProposal: (id: string) => Proposal | undefined;
  confirmProposal: (id: string, selectedServices: any) => void;
  
  // Voucher CRUD
  addVoucher: (voucher: Voucher) => void;
  updateVoucher: (id: string, voucher: Partial<Voucher>) => void;
  getVoucher: (id: string) => Voucher | undefined;
  getProposalVouchers: (proposalId: string) => Voucher[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize Company Info
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(() => {
    const stored = localStorage.getItem("toms_companyInfo");
    if (stored) return JSON.parse(stored);
    // Default company data for demo
    return {
      id: "company-001",
      name: "Mediterranean Explorer Tours",
      logo: "",
      address: "Cumhuriyet Caddesi No: 145, Harbiye",
      city: "Istanbul",
      country: "Turkey",
      postalCode: "34367",
      phone: "+90 212 368 4200",
      email: "info@mediterraneanexplorer.com",
      website: "www.mediterraneanexplorer.com",
      taxId: "TR8520147365",
      licenseNumber: "TURSAB-A-8524",
      currency: "USD",
    };
  });

  const updateCompanyInfo = (updates: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => {
      if (!prev) {
        // If no company info exists, create a new one with default id
        return {
          id: "company-001",
          name: "",
          logo: "",
          address: "",
          city: "",
          country: "",
          postalCode: "",
          phone: "",
          email: "",
          website: "",
          taxId: "",
          licenseNumber: "",
          currency: "USD",
          ...updates,
        };
      }
      return { ...prev, ...updates };
    });
  };

  // Initialize Master Data
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const stored = localStorage.getItem("toms_destinations");
    if (stored) return JSON.parse(stored);
    return [
      { 
        id: "1", code: "IST", name: "Istanbul", country: "Turkey", description: "Historic city bridging Europe and Asia with rich Ottoman heritage", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "2", code: "CAP", name: "Cappadocia", country: "Turkey", description: "Famous for hot air balloons, fairy chimneys, and cave hotels", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "3", code: "ANT", name: "Antalya", country: "Turkey", description: "Mediterranean beach resort with ancient ruins and luxury hotels", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "4", code: "BUR", name: "Bursa", country: "Turkey", description: "Green city with Ottoman heritage and thermal spas", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "5", code: "IZM", name: "Izmir", country: "Turkey", description: "Coastal city on the Aegean Sea with ancient Ephesus nearby", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "6", code: "BOD", name: "Bodrum", country: "Turkey", description: "Popular beach resort, marina, and vibrant nightlife destination", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "7", code: "DXB", name: "Dubai", country: "UAE", description: "Luxury shopping, modern architecture, and desert experiences", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "8", code: "AUH", name: "Abu Dhabi", country: "UAE", description: "Capital city with Sheikh Zayed Mosque and cultural attractions", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "9", code: "PAM", name: "Pamukkale", country: "Turkey", description: "White travertine terraces and ancient Hierapolis ruins", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "10", code: "FET", name: "Fethiye", country: "Turkey", description: "Turquoise coast with Blue Lagoon and paragliding", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "11", code: "TRA", name: "Trabzon", country: "Turkey", description: "Black Sea coast with Sumela Monastery and nature", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "12", code: "MAR", name: "Marmaris", country: "Turkey", description: "Beach resort town with marina and water sports", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "13", code: "ALA", name: "Alanya", country: "Turkey", description: "Mediterranean resort with historic castle and beaches", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "14", code: "KON", name: "Konya", country: "Turkey", description: "Historic Seljuk capital and Mevlana Museum", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "15", code: "CES", name: "Cesme", country: "Turkey", description: "Aegean peninsula with pristine beaches and thermal springs", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "16", code: "KAS", name: "Kas", country: "Turkey", description: "Small Mediterranean town with diving and authentic charm", 
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
    ];
  });

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const stored = localStorage.getItem("toms_hotels");
    if (stored) return JSON.parse(stored);
    return [
      { 
        id: "1", name: "Hilton Istanbul Bosphorus", destinationId: "1", address: "Cumhuriyet Cad. No:50, Harbiye", 
        starRating: 5, contactPerson: "Ali Yılmaz", contactEmail: "ali@hilton.com", contactPhone: "+90 212 123 4567", 
        roomTypes: ["Single Room", "Double Room", "Triple Room", "Deluxe Room", "Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)", "AI (All Inclusive)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "2", name: "Marriott Istanbul", destinationId: "1", address: "Abide-i Hürriyet Cad. No:142", 
        starRating: 5, contactPerson: "Mehmet Kaya", contactEmail: "mehmet@marriott.com", contactPhone: "+90 212 234 5678", 
        roomTypes: ["Single Room", "Double Room", "Deluxe Room", "Executive Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "3", name: "Four Seasons Istanbul", destinationId: "1", address: "Tevkifhane Sok. No:1, Sultanahmet", 
        starRating: 5, contactPerson: "Ayşe Yıldız", contactEmail: "ayse@fourseasons.com", contactPhone: "+90 212 345 6789", 
        roomTypes: ["Deluxe Room", "Premier Room", "Suite", "Presidential Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)"],
        currencies: ["USD", "EUR"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "4", name: "Cappadocia Cave Suites", destinationId: "2", address: "Göreme Kasabası", 
        starRating: 4, contactPerson: "Ayşe Demir", contactEmail: "ayse@cappadocia.com", contactPhone: "+90 384 123 4567", 
        roomTypes: ["Standard Cave Room", "Deluxe Cave Room", "Cave Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "5", name: "Museum Hotel Cappadocia", destinationId: "2", address: "Uçhisar", 
        starRating: 5, contactPerson: "Fatma Şahin", contactEmail: "fatma@museum.com", contactPhone: "+90 384 234 5678", 
        roomTypes: ["Deluxe Room", "Premium Suite", "Royal Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "EUR"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "6", name: "Akra Hotel Antalya", destinationId: "3", address: "Sheraton Cd. No:5, Lara", 
        starRating: 5, contactPerson: "Emre Aydın", contactEmail: "emre@akra.com", contactPhone: "+90 242 123 4567", 
        roomTypes: ["Standard Room", "Deluxe Room", "Suite", "Family Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)", "AI (All Inclusive)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "7", name: "Rixos Premium Belek", destinationId: "3", address: "Belek Turizm Merkezi", 
        starRating: 5, contactPerson: "Can Öztürk", contactEmail: "can@rixos.com", contactPhone: "+90 242 234 5678", 
        roomTypes: ["Deluxe Room", "Family Room", "Villa", "Presidential Villa"],
        boardTypes: ["AI (All Inclusive)", "UAI (Ultra All Inclusive)"],
        currencies: ["USD", "EUR"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "8", name: "Burj Al Arab Dubai", destinationId: "7", address: "Jumeirah Beach Road", 
        starRating: 5, contactPerson: "Ahmed Hassan", contactEmail: "ahmed@burjalarab.com", contactPhone: "+971 4 301 7777", 
        roomTypes: ["Deluxe Suite", "Panoramic Suite", "Royal Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "AED"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "9", name: "Atlantis The Palm", destinationId: "7", address: "Crescent Road, The Palm", 
        starRating: 5, contactPerson: "Sara Abdullah", contactEmail: "sara@atlantis.com", contactPhone: "+971 4 426 1000", 
        roomTypes: ["Deluxe Room", "Imperial Club Room", "Suite", "Presidential Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)", "AI (All Inclusive)"],
        currencies: ["USD", "AED"],
        isActive: true, createdAt: "2024-01-15T10:00:00Z" 
      },
      { 
        id: "10", name: "Swissôtel The Bosphorus", destinationId: "1", address: "Visnezade Mahallesi, Besiktas", 
        starRating: 5, contactPerson: "Deniz Kara", contactEmail: "deniz@swissotel.com", contactPhone: "+90 212 326 1100", 
        roomTypes: ["Standard Room", "Deluxe Room", "Executive Suite", "Presidential Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-16T10:00:00Z" 
      },
      { 
        id: "11", name: "Mandarin Oriental Bodrum", destinationId: "6", address: "Cennet Koyu, Golturkbuku", 
        starRating: 5, contactPerson: "Cem Aksoy", contactEmail: "cem@mandarinoriental.com", contactPhone: "+90 252 311 1888", 
        roomTypes: ["Deluxe Room", "Sea View Suite", "Villa", "Private Pool Villa"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "EUR"],
        isActive: true, createdAt: "2024-01-16T10:00:00Z" 
      },
      { 
        id: "12", name: "Dedeman Pamukkale Hotel", destinationId: "9", address: "Kale Mahallesi, Pamukkale", 
        starRating: 4, contactPerson: "Selin Demir", contactEmail: "selin@dedeman.com", contactPhone: "+90 258 272 2024", 
        roomTypes: ["Standard Room", "Deluxe Room", "Family Room", "Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-16T10:00:00Z" 
      },
      { 
        id: "13", name: "D-Resort Gocek", destinationId: "10", address: "Gocek Koyu, Fethiye", 
        starRating: 5, contactPerson: "Murat Yıldırım", contactEmail: "murat@dresort.com", contactPhone: "+90 252 645 2760", 
        roomTypes: ["Standard Room", "Deluxe Room", "Suite", "Villa"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)", "AI (All Inclusive)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-16T10:00:00Z" 
      },
      { 
        id: "14", name: "Zorlu Grand Hotel Trabzon", destinationId: "11", address: "Cevahir Mah, Trabzon Merkez", 
        starRating: 5, contactPerson: "Kemal Özdemir", contactEmail: "kemal@zorlu.com", contactPhone: "+90 462 326 8400", 
        roomTypes: ["Standard Room", "Deluxe Room", "Executive Suite", "Presidential Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-16T10:00:00Z" 
      },
      { 
        id: "15", name: "Marti Resort Marmaris", destinationId: "12", address: "Kenan Evren Blv, Icmeler", 
        starRating: 5, contactPerson: "Elif Aslan", contactEmail: "elif@marti.com", contactPhone: "+90 252 455 3450", 
        roomTypes: ["Standard Room", "Deluxe Room", "Family Room", "Suite"],
        boardTypes: ["BB (Bed & Breakfast)", "HB (Half Board)", "FB (Full Board)", "AI (All Inclusive)"],
        currencies: ["USD", "EUR", "TRY"],
        isActive: true, createdAt: "2024-01-16T10:00:00Z" 
      },
    ];
  });

  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const stored = localStorage.getItem("toms_agencies");
    if (stored) return JSON.parse(stored);
    return [
      { id: "1", name: "Istanbul Travel Agency", country: "Turkey", contactPerson: "Ahmet Özkan", contactEmail: "ahmet@istanbul-travel.com", contactPhone: "+90 212 345 6789", commissionRate: "10", isActive: true, createdAt: "2024-01-10T09:00:00Z" },
      { id: "2", name: "Ankara Tours & Travel", country: "Turkey", contactPerson: "Zeynep Arslan", contactEmail: "zeynep@ankara-tours.com", contactPhone: "+90 312 345 6789", commissionRate: "12", isActive: true, createdAt: "2024-01-10T09:00:00Z" },
      { id: "3", name: "Dubai Express Travel", country: "UAE", contactPerson: "Mohammed Al-Hassan", contactEmail: "mohammed@dubai-express.com", contactPhone: "+971 4 123 4567", commissionRate: "15", isActive: true, createdAt: "2024-01-10T09:00:00Z" },
      { id: "4", name: "European Dream Holidays", country: "Germany", contactPerson: "Hans Mueller", contactEmail: "hans@europeandream.com", contactPhone: "+49 30 123 4567", commissionRate: "18", isActive: true, createdAt: "2024-01-10T09:00:00Z" },
      { id: "5", name: "British Global Tours", country: "United Kingdom", contactPerson: "James Smith", contactEmail: "james@britishglobal.com", contactPhone: "+44 20 7123 4567", commissionRate: "20", isActive: true, createdAt: "2024-01-10T09:00:00Z" },
      { id: "6", name: "America Travel Partners", country: "USA", contactPerson: "Sarah Johnson", contactEmail: "sarah@americatravel.com", contactPhone: "+1 212 555 0123", commissionRate: "15", isActive: true, createdAt: "2024-01-10T09:00:00Z" },
      { id: "7", name: "Asia Pacific Voyages", country: "China", contactPerson: "Wei Zhang", contactEmail: "wei@asiapacific.com", contactPhone: "+86 10 8523 1234", commissionRate: "14", isActive: true, createdAt: "2024-01-11T09:00:00Z" },
      { id: "8", name: "Mediterranean Escapes", country: "Spain", contactPerson: "Carlos Rodriguez", contactEmail: "carlos@medescape.com", contactPhone: "+34 91 234 5678", commissionRate: "16", isActive: true, createdAt: "2024-01-11T09:00:00Z" },
      { id: "9", name: "Scandinavian Adventures", country: "Sweden", contactPerson: "Erik Larsson", contactEmail: "erik@scandadventures.com", contactPhone: "+46 8 123 4567", commissionRate: "17", isActive: true, createdAt: "2024-01-11T09:00:00Z" },
      { id: "10", name: "French Connection Travel", country: "France", contactPerson: "Marie Dubois", contactEmail: "marie@frenchconnection.com", contactPhone: "+33 1 4234 5678", commissionRate: "19", isActive: true, createdAt: "2024-01-11T09:00:00Z" },
      { id: "11", name: "Australian Outback Tours", country: "Australia", contactPerson: "Jack Wilson", contactEmail: "jack@outbacktours.com", contactPhone: "+61 2 9876 5432", commissionRate: "13", isActive: true, createdAt: "2024-01-12T09:00:00Z" },
      { id: "12", name: "Russian Grand Tours", country: "Russia", contactPerson: "Dmitri Volkov", contactEmail: "dmitri@russiagrand.com", contactPhone: "+7 495 123 4567", commissionRate: "11", isActive: true, createdAt: "2024-01-12T09:00:00Z" },
      { id: "13", name: "South American Explorer", country: "Brazil", contactPerson: "Pedro Silva", contactEmail: "pedro@saexplorer.com", contactPhone: "+55 11 3456 7890", commissionRate: "14", isActive: true, createdAt: "2024-01-12T09:00:00Z" },
      { id: "14", name: "Japan Discovery Travel", country: "Japan", contactPerson: "Yuki Tanaka", contactEmail: "yuki@japandiscovery.com", contactPhone: "+81 3 5678 1234", commissionRate: "16", isActive: true, createdAt: "2024-01-12T09:00:00Z" },
    ];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("toms_users");
    if (stored) return JSON.parse(stored);
    return [
      { id: "1", name: "Mehmet Yılmaz", email: "mehmet@mediterraneanexplorer.com", role: "Sales Manager", isActive: true, createdAt: "2024-01-05T08:00:00Z" },
      { id: "2", name: "Ayşe Kaya", email: "ayse@mediterraneanexplorer.com", role: "Reservations Manager", isActive: true, createdAt: "2024-01-05T08:00:00Z" },
      { id: "3", name: "Can Özdemir", email: "can@mediterraneanexplorer.com", role: "Operations Manager", isActive: true, createdAt: "2024-01-05T08:00:00Z" },
      { id: "4", name: "Elif Şahin", email: "elif@mediterraneanexplorer.com", role: "Accounting Manager", isActive: true, createdAt: "2024-01-05T08:00:00Z" },
      { id: "5", name: "Ahmet Demir", email: "ahmet@mediterraneanexplorer.com", role: "Super Admin", isActive: true, createdAt: "2024-01-05T08:00:00Z" },
      { id: "6", name: "Zeynep Arslan", email: "zeynep@mediterraneanexplorer.com", role: "Sales Executive", isActive: true, createdAt: "2024-01-05T08:00:00Z" },
      { id: "7", name: "Emre Aydın", email: "emre@mediterraneanexplorer.com", role: "Reservations Agent", isActive: true, createdAt: "2024-01-05T08:00:00Z" },
      { id: "8", name: "Selin Yıldız", email: "selin@mediterraneanexplorer.com", role: "Tour Coordinator", isActive: true, createdAt: "2024-01-06T08:00:00Z" },
      { id: "9", name: "Burak Koç", email: "burak@mediterraneanexplorer.com", role: "Sales Executive", isActive: true, createdAt: "2024-01-06T08:00:00Z" },
      { id: "10", name: "Deniz Aksoy", email: "deniz@mediterraneanexplorer.com", role: "Operations Coordinator", isActive: true, createdAt: "2024-01-06T08:00:00Z" },
      { id: "11", name: "Fatma Öztürk", email: "fatma@mediterraneanexplorer.com", role: "Accounting Executive", isActive: true, createdAt: "2024-01-06T08:00:00Z" },
      { id: "12", name: "Murat Çelik", email: "murat@mediterraneanexplorer.com", role: "Customer Service", isActive: true, createdAt: "2024-01-07T08:00:00Z" },
      { id: "13", name: "Gizem Yurt", email: "gizem@mediterraneanexplorer.com", role: "Marketing Manager", isActive: true, createdAt: "2024-01-07T08:00:00Z" },
    ];
  });

  const [globalLookups, setGlobalLookups] = useState<GlobalLookup[]>(() => {
    const stored = localStorage.getItem("toms_globalLookups");
    if (stored) return JSON.parse(stored);
    return [
      // Vehicle Types
      { id: "vt1", category: "vehicleTypes", name: "Sedan (4 PAX)", description: "Compact sedan for 4 passengers", createdAt: new Date().toISOString() },
      { id: "vt2", category: "vehicleTypes", name: "Van (7 PAX)", description: "Mini van for 7 passengers", createdAt: new Date().toISOString() },
      { id: "vt3", category: "vehicleTypes", name: "Mini Bus (15 PAX)", description: "Mini bus for 15 passengers", createdAt: new Date().toISOString() },
      { id: "vt4", category: "vehicleTypes", name: "Bus (30 PAX)", description: "Standard bus for 30 passengers", createdAt: new Date().toISOString() },
      { id: "vt5", category: "vehicleTypes", name: "Bus (50 PAX)", description: "Large bus for 50 passengers", createdAt: new Date().toISOString() },
      // Flight Types
      { id: "ft1", category: "flightTypes", name: "Domestic", description: "Within country flights", createdAt: new Date().toISOString() },
      { id: "ft2", category: "flightTypes", name: "International", description: "Between countries", createdAt: new Date().toISOString() },
      { id: "ft3", category: "flightTypes", name: "Regional", description: "Regional flights", createdAt: new Date().toISOString() },
      // Car Types
      { id: "ct1", category: "carTypes", name: "Economy", description: "Compact cars", createdAt: new Date().toISOString() },
      { id: "ct2", category: "carTypes", name: "Standard", description: "Mid-size cars", createdAt: new Date().toISOString() },
      { id: "ct3", category: "carTypes", name: "Luxury", description: "Premium vehicles", createdAt: new Date().toISOString() },
      { id: "ct4", category: "carTypes", name: "SUV", description: "Sport utility vehicles", createdAt: new Date().toISOString() },
      { id: "ct5", category: "carTypes", name: "Van", description: "Multi-passenger vans", createdAt: new Date().toISOString() },
      // Service Types
      { id: "st1", category: "serviceTypes", name: "Tour Guide", description: "Professional tour guide services", createdAt: new Date().toISOString() },
      { id: "st2", category: "serviceTypes", name: "Museum Entry", description: "Museum and attraction tickets", createdAt: new Date().toISOString() },
      { id: "st3", category: "serviceTypes", name: "Activities", description: "Various tourist activities", createdAt: new Date().toISOString() },
      { id: "st4", category: "serviceTypes", name: "Meals", description: "Lunch/dinner arrangements", createdAt: new Date().toISOString() },
      { id: "st5", category: "serviceTypes", name: "Insurance", description: "Travel insurance", createdAt: new Date().toISOString() },
    ];
  });

  const [sources, setSources] = useState<Source[]>(() => {
    const stored = localStorage.getItem("toms_sources");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate that sources have the expected structure
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].name) {
          return parsed;
        }
      } catch (e) {
        console.warn("Failed to parse stored sources, using defaults");
      }
    }
    // Return default sources if none stored or invalid
    const defaultSources = [
      { id: "src1", name: "Direct Client (B2C)", description: "Individual customer booking directly", isActive: true, createdAt: new Date().toISOString() },
      { id: "src2", name: "Travel Agency (B2B)", description: "Booking through partner travel agency", isActive: true, createdAt: new Date().toISOString() },
      { id: "src3", name: "Sales Employee", description: "Business brought by sales team member", isActive: true, createdAt: new Date().toISOString() },
      { id: "src4", name: "Manager", description: "Business brought by manager", isActive: true, createdAt: new Date().toISOString() },
      { id: "src5", name: "Other", description: "Other sources", isActive: true, createdAt: new Date().toISOString() },
    ];
    // Save defaults to localStorage immediately
    localStorage.setItem("toms_sources", JSON.stringify(defaultSources));
    return defaultSources;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const stored = localStorage.getItem("toms_proposals");
    if (stored) return JSON.parse(stored);
    return [
      // Proposal 1: NEW - Istanbul + Cappadocia Tour (Complete with all services)
      {
        id: "P001",
        reference: "PROP-2024-001",
        source: "src2", // Travel Agency (B2B)
        agencyId: "1",
        salesPersonId: "1",
        destinationIds: ["1", "2"],
        estimatedNights: "7",
        status: "NEW" as ProposalStatus,
        createdAt: "2024-02-20T09:30:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "1",
            hotelId: "1",
            checkin: "2024-03-15",
            checkout: "2024-03-19",
            nights: 4,
            roomType: "Double Room",
            boardType: "BB (Bed & Breakfast)",
            numRooms: 2,
            currency: "USD",
            pricePerNight: "150",
            totalPrice: 1200,
          },
          {
            id: 2,
            destinationId: "2",
            hotelId: "4",
            checkin: "2024-03-19",
            checkout: "2024-03-22",
            nights: 3,
            roomType: "Deluxe Cave Room",
            boardType: "HB (Half Board)",
            numRooms: 2,
            currency: "USD",
            pricePerNight: "180",
            totalPrice: 1080,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "1",
            date: "2024-03-15",
            description: "Airport Transfer & City Tour",
            vehicleType: "Van (7 PAX)",
            numDays: 4,
            numVehicles: 1,
            currency: "USD",
            pricePerDay: "80",
            totalPrice: 320,
          },
          {
            id: 2,
            destinationId: "2",
            date: "2024-03-19",
            description: "Cappadocia Transfers",
            vehicleType: "Van (7 PAX)",
            numDays: 3,
            numVehicles: 1,
            currency: "USD",
            pricePerDay: "70",
            totalPrice: 210,
          }
        ],
        flights: [
          {
            id: 1,
            date: "2024-03-15",
            departure: "London (LHR)",
            arrival: "Istanbul (IST)",
            departureTime: "10:00",
            arrivalTime: "16:30",
            flightType: "International",
            airline: "Turkish Airlines",
            pax: 4,
            currency: "USD",
            pricePerPax: "450",
            totalPrice: 1800,
          },
          {
            id: 2,
            date: "2024-03-22",
            departure: "Istanbul (IST)",
            arrival: "London (LHR)",
            departureTime: "18:00",
            arrivalTime: "21:30",
            flightType: "International",
            airline: "Turkish Airlines",
            pax: 4,
            currency: "USD",
            pricePerPax: "480",
            totalPrice: 1920,
          }
        ],
        rentACar: [],
        additionalServices: [
          {
            id: 1,
            destinationId: "2",
            date: "2024-03-20",
            description: "Hot Air Balloon Tour",
            serviceType: "Activities",
            numDays: 1,
            numPax: 4,
            currency: "USD",
            pricePerPax: "180",
            totalPrice: 720,
          },
          {
            id: 2,
            destinationId: "1",
            date: "2024-03-16",
            description: "Tour Guide - Full Day",
            serviceType: "Tour Guide",
            numDays: 1,
            numPax: 4,
            currency: "USD",
            pricePerPax: "40",
            totalPrice: 160,
          }
        ],
        overallMargin: "18",
        commission: "10",
        pdfLanguage: "English",
        displayCurrency: "USD"
      },
      // Proposal 2: CONFIRMED - Antalya Beach Resort
      {
        id: "P002",
        reference: "PROP-2024-002",
        source: "src1", // Direct Client (B2C)
        agencyId: "3",
        salesPersonId: "6",
        destinationIds: ["3"],
        estimatedNights: "10",
        status: "CONFIRMED" as ProposalStatus,
        createdAt: "2024-02-18T14:20:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "3",
            hotelId: "7",
            checkin: "2024-04-10",
            checkout: "2024-04-20",
            nights: 10,
            roomType: "Family Room",
            boardType: "AI (All Inclusive)",
            numRooms: 3,
            currency: "EUR",
            pricePerNight: "200",
            totalPrice: 6000,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "3",
            date: "2024-04-10",
            description: "Airport Transfer",
            vehicleType: "Mini Bus (15 PAX)",
            numDays: 1,
            numVehicles: 1,
            currency: "EUR",
            pricePerDay: "50",
            totalPrice: 50,
          }
        ],
        flights: [
          {
            id: 1,
            date: "2024-04-10",
            departure: "Dubai (DXB)",
            arrival: "Antalya (AYT)",
            departureTime: "08:30",
            arrivalTime: "13:00",
            flightType: "International",
            airline: "Emirates",
            pax: 8,
            currency: "EUR",
            pricePerPax: "320",
            totalPrice: 2560,
          },
          {
            id: 2,
            date: "2024-04-20",
            departure: "Antalya (AYT)",
            arrival: "Dubai (DXB)",
            departureTime: "14:00",
            arrivalTime: "19:30",
            flightType: "International",
            airline: "Emirates",
            pax: 8,
            currency: "EUR",
            pricePerPax: "340",
            totalPrice: 2720,
          }
        ],
        rentACar: [],
        additionalServices: [
          {
            id: 1,
            destinationId: "3",
            date: "2024-04-15",
            description: "Travel Insurance",
            serviceType: "Insurance",
            numDays: 10,
            numPax: 8,
            currency: "EUR",
            pricePerPax: "15",
            totalPrice: 120,
          }
        ],
        overallMargin: "20",
        commission: "15",
        pdfLanguage: "Arabic",
        displayCurrency: "EUR"
      },
      // Proposal 3: NEW - Istanbul Short Business Trip
      {
        id: "P003",
        reference: "PROP-2024-003",
        source: "src3", // Sales Employee
        agencyId: "4",
        salesPersonId: "1",
        destinationIds: ["1"],
        estimatedNights: "3",
        status: "NEW" as ProposalStatus,
        createdAt: "2024-02-22T11:15:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "1",
            hotelId: "3",
            checkin: "2024-03-28",
            checkout: "2024-03-31",
            nights: 3,
            roomType: "Deluxe Room",
            boardType: "BB (Bed & Breakfast)",
            numRooms: 1,
            currency: "EUR",
            pricePerNight: "200",
            totalPrice: 600,
          }
        ],
        transportation: [],
        flights: [],
        rentACar: [
          {
            id: 1,
            destinationId: "1",
            pickupDate: "2024-03-28",
            dropoffDate: "2024-03-31",
            pickupLocation: "Istanbul Airport",
            dropoffLocation: "Istanbul Airport",
            carType: "Luxury",
            numDays: 3,
            numCars: 1,
            currency: "EUR",
            pricePerDay: "60",
            totalPrice: 180,
          }
        ],
        additionalServices: [],
        overallMargin: "17",
        commission: "18",
        pdfLanguage: "English",
        displayCurrency: "EUR"
      },
      // Proposal 4: CONFIRMED - Dubai Luxury Package
      {
        id: "P004",
        reference: "PROP-2024-004",
        source: "src4", // Manager
        agencyId: "5",
        salesPersonId: "6",
        destinationIds: ["7", "8"],
        estimatedNights: "5",
        status: "CONFIRMED" as ProposalStatus,
        createdAt: "2024-02-15T16:45:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "7",
            hotelId: "8",
            checkin: "2024-05-05",
            checkout: "2024-05-08",
            nights: 3,
            roomType: "Panoramic Suite",
            boardType: "HB (Half Board)",
            numRooms: 1,
            currency: "USD",
            pricePerNight: "1200",
            totalPrice: 3600,
          },
          {
            id: 2,
            destinationId: "8",
            hotelId: "9",
            checkin: "2024-05-08",
            checkout: "2024-05-10",
            nights: 2,
            roomType: "Suite",
            boardType: "BB (Bed & Breakfast)",
            numRooms: 1,
            currency: "USD",
            pricePerNight: "500",
            totalPrice: 1000,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "7",
            date: "2024-05-05",
            description: "Private Chauffeur Service",
            vehicleType: "Sedan (4 PAX)",
            numDays: 5,
            numVehicles: 1,
            currency: "USD",
            pricePerDay: "150",
            totalPrice: 750,
          }
        ],
        flights: [
          {
            id: 1,
            date: "2024-05-05",
            departure: "London (LHR)",
            arrival: "Dubai (DXB)",
            departureTime: "14:00",
            arrivalTime: "23:30",
            flightType: "International",
            airline: "Emirates",
            pax: 2,
            currency: "USD",
            pricePerPax: "850",
            totalPrice: 1700,
          },
          {
            id: 2,
            date: "2024-05-10",
            departure: "Dubai (DXB)",
            arrival: "London (LHR)",
            departureTime: "03:00",
            arrivalTime: "07:30",
            flightType: "International",
            airline: "Emirates",
            pax: 2,
            currency: "USD",
            pricePerPax: "900",
            totalPrice: 1800,
          }
        ],
        rentACar: [],
        additionalServices: [
          {
            id: 1,
            destinationId: "7",
            date: "2024-05-06",
            description: "Desert Safari",
            serviceType: "Activities",
            numDays: 1,
            numPax: 2,
            currency: "USD",
            pricePerPax: "120",
            totalPrice: 240,
          },
          {
            id: 2,
            destinationId: "7",
            date: "2024-05-07",
            description: "Burj Khalifa + Dubai Mall Tour",
            serviceType: "Tour Guide",
            numDays: 1,
            numPax: 2,
            currency: "USD",
            pricePerPax: "100",
            totalPrice: 200,
          }
        ],
        overallMargin: "18",
        commission: "20",
        pdfLanguage: "English",
        displayCurrency: "USD"
      },
      // Proposal 5: CANCELLED - Budget Istanbul Tour
      {
        id: "P005",
        reference: "PROP-2024-005",
        source: "src2", // Travel Agency (B2B)
        agencyId: "2",
        salesPersonId: "1",
        destinationIds: ["1"],
        estimatedNights: "4",
        status: "CANCELLED" as ProposalStatus,
        createdAt: "2024-02-12T10:00:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "1",
            hotelId: "2",
            checkin: "2024-03-20",
            checkout: "2024-03-24",
            nights: 4,
            roomType: "Single Room",
            boardType: "BB (Bed & Breakfast)",
            numRooms: 1,
            currency: "TRY",
            pricePerNight: "2000",
            totalPrice: 8000,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "1",
            date: "2024-03-20",
            description: "Airport Transfer Only",
            vehicleType: "Sedan (4 PAX)",
            numDays: 1,
            numVehicles: 1,
            currency: "TRY",
            pricePerDay: "1000",
            totalPrice: 1000,
          }
        ],
        flights: [],
        rentACar: [],
        additionalServices: [],
        overallMargin: "15",
        commission: "12",
        pdfLanguage: "Turkish",
        displayCurrency: "TRY"
      },
      // Proposal 6: NEW - Multi-City Turkey Tour
      {
        id: "P006",
        reference: "PROP-2024-006",
        source: "src1", // Direct Client (B2C)
        agencyId: "6",
        salesPersonId: "6",
        destinationIds: ["1", "2", "3", "5"],
        estimatedNights: "14",
        status: "NEW" as ProposalStatus,
        createdAt: "2024-02-25T13:00:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "1",
            hotelId: "1",
            checkin: "2024-06-01",
            checkout: "2024-06-05",
            nights: 4,
            roomType: "Triple Room",
            boardType: "HB (Half Board)",
            numRooms: 2,
            currency: "USD",
            pricePerNight: "160",
            totalPrice: 1280,
          },
          {
            id: 2,
            destinationId: "2",
            hotelId: "5",
            checkin: "2024-06-05",
            checkout: "2024-06-08",
            nights: 3,
            roomType: "Premium Suite",
            boardType: "FB (Full Board)",
            numRooms: 2,
            currency: "USD",
            pricePerNight: "250",
            totalPrice: 1500,
          },
          {
            id: 3,
            destinationId: "3",
            hotelId: "6",
            checkin: "2024-06-08",
            checkout: "2024-06-12",
            nights: 4,
            roomType: "Deluxe Room",
            boardType: "AI (All Inclusive)",
            numRooms: 2,
            currency: "USD",
            pricePerNight: "180",
            totalPrice: 1440,
          },
          {
            id: 4,
            destinationId: "1",
            hotelId: "2",
            checkin: "2024-06-12",
            checkout: "2024-06-15",
            nights: 3,
            roomType: "Deluxe Room",
            boardType: "BB (Bed & Breakfast)",
            numRooms: 2,
            currency: "USD",
            pricePerNight: "140",
            totalPrice: 840,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "1",
            date: "2024-06-01",
            description: "Istanbul Transportation",
            vehicleType: "Mini Bus (15 PAX)",
            numDays: 4,
            numVehicles: 1,
            currency: "USD",
            pricePerDay: "100",
            totalPrice: 400,
          },
          {
            id: 2,
            destinationId: "2",
            date: "2024-06-05",
            description: "Cappadocia Transportation",
            vehicleType: "Mini Bus (15 PAX)",
            numDays: 3,
            numVehicles: 1,
            currency: "USD",
            pricePerDay: "90",
            totalPrice: 270,
          },
          {
            id: 3,
            destinationId: "3",
            date: "2024-06-08",
            description: "Antalya Transportation",
            vehicleType: "Mini Bus (15 PAX)",
            numDays: 4,
            numVehicles: 1,
            currency: "USD",
            pricePerDay: "85",
            totalPrice: 340,
          }
        ],
        flights: [
          {
            id: 1,
            date: "2024-06-01",
            departure: "New York (JFK)",
            arrival: "Istanbul (IST)",
            departureTime: "20:00",
            arrivalTime: "15:30",
            flightType: "International",
            airline: "Turkish Airlines",
            pax: 6,
            currency: "USD",
            pricePerPax: "750",
            totalPrice: 4500,
          },
          {
            id: 2,
            date: "2024-06-15",
            departure: "Istanbul (IST)",
            arrival: "New York (JFK)",
            departureTime: "11:00",
            arrivalTime: "15:30",
            flightType: "International",
            airline: "Turkish Airlines",
            pax: 6,
            currency: "USD",
            pricePerPax: "800",
            totalPrice: 4800,
          }
        ],
        rentACar: [],
        additionalServices: [
          {
            id: 1,
            destinationId: "2",
            date: "2024-06-06",
            description: "Hot Air Balloon Tour",
            serviceType: "Activities",
            numDays: 1,
            numPax: 6,
            currency: "USD",
            pricePerPax: "180",
            totalPrice: 1080,
          },
          {
            id: 2,
            destinationId: "1",
            date: "2024-06-02",
            description: "Professional Tour Guide - 4 Days",
            serviceType: "Tour Guide",
            numDays: 4,
            numPax: 6,
            currency: "USD",
            pricePerPax: "35",
            totalPrice: 840,
          },
          {
            id: 3,
            destinationId: "1",
            date: "2024-06-03",
            description: "Bosphorus Dinner Cruise",
            serviceType: "Meals",
            numDays: 1,
            numPax: 6,
            currency: "USD",
            pricePerPax: "80",
            totalPrice: 480,
          }
        ],
        overallMargin: "19",
        commission: "15",
        pdfLanguage: "English",
        displayCurrency: "USD"
      },
      // Proposal 7: CONFIRMED - Bodrum Beach Getaway
      {
        id: "P007",
        reference: "PROP-2024-007",
        source: "src3", // Sales Employee
        agencyId: "8",
        salesPersonId: "1",
        destinationIds: ["6"],
        estimatedNights: "7",
        status: "CONFIRMED" as ProposalStatus,
        createdAt: "2024-02-10T11:30:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "6",
            hotelId: "11",
            checkin: "2024-05-01",
            checkout: "2024-05-08",
            nights: 7,
            roomType: "Sea View Suite",
            boardType: "HB (Half Board)",
            numRooms: 2,
            currency: "EUR",
            pricePerNight: "280",
            totalPrice: 3920,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "6",
            date: "2024-05-01",
            description: "Airport Transfer & Local Transportation",
            vehicleType: "Van (7 PAX)",
            numDays: 7,
            numVehicles: 1,
            currency: "EUR",
            pricePerDay: "60",
            totalPrice: 420,
          }
        ],
        flights: [
          {
            id: 1,
            date: "2024-05-01",
            departure: "Madrid (MAD)",
            arrival: "Bodrum (BJV)",
            departureTime: "09:15",
            arrivalTime: "14:45",
            flightType: "International",
            airline: "Pegasus Airlines",
            pax: 4,
            currency: "EUR",
            pricePerPax: "320",
            totalPrice: 1280,
          },
          {
            id: 2,
            date: "2024-05-08",
            departure: "Bodrum (BJV)",
            arrival: "Madrid (MAD)",
            departureTime: "16:00",
            arrivalTime: "19:30",
            flightType: "International",
            airline: "Pegasus Airlines",
            pax: 4,
            currency: "EUR",
            pricePerPax: "340",
            totalPrice: 1360,
          }
        ],
        rentACar: [],
        additionalServices: [
          {
            id: 1,
            destinationId: "6",
            date: "2024-05-03",
            description: "Private Boat Tour",
            serviceType: "Activities",
            numDays: 1,
            numPax: 4,
            currency: "EUR",
            pricePerPax: "90",
            totalPrice: 360,
          }
        ],
        overallMargin: "17",
        commission: "16",
        pdfLanguage: "English",
        displayCurrency: "EUR"
      },
      // Proposal 8: CONFIRMED - Trabzon Nature Tour
      {
        id: "P008",
        reference: "PROP-2024-008",
        source: "src2", // Travel Agency (B2B)
        agencyId: "12",
        salesPersonId: "6",
        destinationIds: ["11"],
        estimatedNights: "5",
        status: "CONFIRMED" as ProposalStatus,
        createdAt: "2024-02-12T09:45:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "11",
            hotelId: "14",
            checkin: "2024-05-10",
            checkout: "2024-05-15",
            nights: 5,
            roomType: "Deluxe Room",
            boardType: "HB (Half Board)",
            numRooms: 4,
            currency: "USD",
            pricePerNight: "110",
            totalPrice: 2200,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "11",
            date: "2024-05-10",
            description: "Trabzon Transportation & Tours",
            vehicleType: "Mini Bus (15 PAX)",
            numDays: 5,
            numVehicles: 1,
            currency: "USD",
            pricePerDay: "120",
            totalPrice: 600,
          }
        ],
        flights: [
          {
            id: 1,
            date: "2024-05-10",
            departure: "Moscow (SVO)",
            arrival: "Trabzon (TZX)",
            departureTime: "08:00",
            arrivalTime: "11:30",
            flightType: "International",
            airline: "Turkish Airlines",
            pax: 8,
            currency: "USD",
            pricePerPax: "380",
            totalPrice: 3040,
          },
          {
            id: 2,
            date: "2024-05-15",
            departure: "Trabzon (TZX)",
            arrival: "Moscow (SVO)",
            departureTime: "12:30",
            arrivalTime: "16:00",
            flightType: "International",
            airline: "Turkish Airlines",
            pax: 8,
            currency: "USD",
            pricePerPax: "400",
            totalPrice: 3200,
          }
        ],
        rentACar: [],
        additionalServices: [
          {
            id: 1,
            destinationId: "11",
            date: "2024-05-11",
            description: "Sumela Monastery Tour with Guide",
            serviceType: "Tour Guide",
            numDays: 1,
            numPax: 8,
            currency: "USD",
            pricePerPax: "50",
            totalPrice: 400,
          },
          {
            id: 2,
            destinationId: "11",
            date: "2024-05-12",
            description: "Uzungol Nature Tour",
            serviceType: "Activities",
            numDays: 1,
            numPax: 8,
            currency: "USD",
            pricePerPax: "65",
            totalPrice: 520,
          }
        ],
        overallMargin: "18",
        commission: "11",
        pdfLanguage: "Russian",
        displayCurrency: "USD"
      },
      // Proposal 9: CONFIRMED - Marmaris Family Holiday
      {
        id: "P009",
        reference: "PROP-2024-009",
        source: "src5", // Other
        agencyId: "4",
        salesPersonId: "9",
        destinationIds: ["12"],
        estimatedNights: "14",
        status: "CONFIRMED" as ProposalStatus,
        createdAt: "2024-02-05T10:15:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "12",
            hotelId: "15",
            checkin: "2024-07-01",
            checkout: "2024-07-15",
            nights: 14,
            roomType: "Family Room",
            boardType: "AI (All Inclusive)",
            numRooms: 4,
            currency: "EUR",
            pricePerNight: "180",
            totalPrice: 10080,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "12",
            date: "2024-07-01",
            description: "Airport Transfer",
            vehicleType: "Mini Bus (15 PAX)",
            numDays: 1,
            numVehicles: 1,
            currency: "EUR",
            pricePerDay: "80",
            totalPrice: 80,
          }
        ],
        flights: [
          {
            id: 1,
            date: "2024-07-01",
            departure: "Berlin (BER)",
            arrival: "Dalaman (DLM)",
            departureTime: "07:30",
            arrivalTime: "12:45",
            flightType: "International",
            airline: "SunExpress",
            pax: 12,
            currency: "EUR",
            pricePerPax: "280",
            totalPrice: 3360,
          },
          {
            id: 2,
            date: "2024-07-15",
            departure: "Dalaman (DLM)",
            arrival: "Berlin (BER)",
            departureTime: "13:45",
            arrivalTime: "17:00",
            flightType: "International",
            airline: "SunExpress",
            pax: 12,
            currency: "EUR",
            pricePerPax: "300",
            totalPrice: 3600,
          }
        ],
        rentACar: [],
        additionalServices: [],
        overallMargin: "16",
        commission: "18",
        pdfLanguage: "German",
        displayCurrency: "EUR"
      },
      // Proposal 10: NEW - Fethiye Blue Cruise
      {
        id: "P010",
        reference: "PROP-2024-010",
        source: "src4", // Manager
        agencyId: "5",
        salesPersonId: "1",
        destinationIds: ["10"],
        estimatedNights: "8",
        status: "NEW" as ProposalStatus,
        createdAt: "2024-02-24T14:20:00Z",
        hotels: [
          {
            id: 1,
            destinationId: "10",
            hotelId: "13",
            checkin: "2024-06-20",
            checkout: "2024-06-28",
            nights: 8,
            roomType: "Deluxe Room",
            boardType: "HB (Half Board)",
            numRooms: 5,
            currency: "GBP",
            pricePerNight: "160",
            totalPrice: 6400,
          }
        ],
        transportation: [
          {
            id: 1,
            destinationId: "10",
            date: "2024-06-20",
            description: "Airport Transfer & Local Transportation",
            vehicleType: "Mini Bus (15 PAX)",
            numDays: 8,
            numVehicles: 1,
            currency: "GBP",
            pricePerDay: "70",
            totalPrice: 560,
          }
        ],
        flights: [],
        rentACar: [],
        additionalServices: [
          {
            id: 1,
            destinationId: "10",
            date: "2024-06-22",
            description: "Blue Lagoon Boat Tour",
            serviceType: "Activities",
            numDays: 1,
            numPax: 10,
            currency: "GBP",
            pricePerPax: "55",
            totalPrice: 550,
          },
          {
            id: 2,
            destinationId: "10",
            date: "2024-06-24",
            description: "Paragliding Experience",
            serviceType: "Activities",
            numDays: 1,
            numPax: 10,
            currency: "GBP",
            pricePerPax: "90",
            totalPrice: 900,
          }
        ],
        overallMargin: "20",
        commission: "20",
        pdfLanguage: "English",
        displayCurrency: "GBP"
      }
    ];
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const stored = localStorage.getItem("toms_vouchers");
    if (stored) return JSON.parse(stored);
    // Generate vouchers for confirmed proposals
    return [
      // Vouchers for P002 (Confirmed Antalya Resort)
      {
        id: "V-P002-H1",
        proposalId: "P002",
        proposalReference: "PROP-2024-002",
        serviceType: "hotel" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src1", // Direct Client (B2C)
        agencyId: "3",
        salesPersonId: "6",
        guests: [
          { id: 1, firstName: "Mohammed", lastName: "Al-Hassan", passportNumber: "UAE123456", nationality: "UAE", birthDate: "1985-05-15" },
          { id: 2, firstName: "Fatima", lastName: "Al-Hassan", passportNumber: "UAE123457", nationality: "UAE", birthDate: "1987-07-20" },
          { id: 3, firstName: "Ahmed", lastName: "Al-Hassan", passportNumber: "UAE123458", nationality: "UAE", birthDate: "1990-09-25" },
          { id: 4, firstName: "Sara", lastName: "Al-Hassan", passportNumber: "UAE123459", nationality: "UAE", birthDate: "1992-11-30" },
          { id: 5, firstName: "Khalid", lastName: "Al-Hassan", passportNumber: "UAE123460", nationality: "UAE", birthDate: "1995-01-05" },
          { id: 6, firstName: "Noura", lastName: "Al-Hassan", passportNumber: "UAE123461", nationality: "UAE", birthDate: "1997-03-10" },
          { id: 7, firstName: "Omar", lastName: "Al-Hassan", passportNumber: "UAE123462", nationality: "UAE", birthDate: "1999-05-15" },
          { id: 8, firstName: "Layla", lastName: "Al-Hassan", passportNumber: "UAE123463", nationality: "UAE", birthDate: "2001-07-20" },
        ],
        adults: 6,
        children: 2,
        totalPax: 8,
        notes: "Early check-in requested. Beach view rooms preferred.",
        serviceData: {
          id: 1,
          destinationId: "3",
          hotelId: "7",
          checkin: "2024-04-10",
          checkout: "2024-04-20",
          nights: 10,
          roomType: "Family Room",
          boardType: "AI (All Inclusive)",
          numRooms: 3,
          currency: "EUR",
          pricePerNight: "200",
          totalPrice: 6000,
        }
      },
      {
        id: "V-P002-T1",
        proposalId: "P002",
        proposalReference: "PROP-2024-002",
        serviceType: "transportation" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src1", // Direct Client (B2C)
        agencyId: "3",
        salesPersonId: "6",
        guests: [],
        adults: 6,
        children: 2,
        totalPax: 8,
        notes: "Flight lands at 13:00, pickup time 14:00",
        serviceData: {
          id: 1,
          destinationId: "3",
          date: "2024-04-10",
          description: "Airport Transfer",
          vehicleType: "Mini Bus (15 PAX)",
          numDays: 1,
          numVehicles: 1,
          currency: "EUR",
          pricePerDay: "50",
          totalPrice: 50,
        }
      },
      {
        id: "V-P002-F1",
        proposalId: "P002",
        proposalReference: "PROP-2024-002",
        serviceType: "flight" as const,
        serviceId: 1,
        status: "COMPLETED" as VoucherStatus,
        source: "src1", // Direct Client (B2C)
        agencyId: "3",
        salesPersonId: "6",
        guests: [
          { id: 1, firstName: "Mohammed", lastName: "Al-Hassan", passportNumber: "UAE123456", nationality: "UAE", birthDate: "1985-05-15" },
          { id: 2, firstName: "Fatima", lastName: "Al-Hassan", passportNumber: "UAE123457", nationality: "UAE", birthDate: "1987-07-20" },
          { id: 3, firstName: "Ahmed", lastName: "Al-Hassan", passportNumber: "UAE123458", nationality: "UAE", birthDate: "1990-09-25" },
          { id: 4, firstName: "Sara", lastName: "Al-Hassan", passportNumber: "UAE123459", nationality: "UAE", birthDate: "1992-11-30" },
          { id: 5, firstName: "Khalid", lastName: "Al-Hassan", passportNumber: "UAE123460", nationality: "UAE", birthDate: "1995-01-05" },
          { id: 6, firstName: "Noura", lastName: "Al-Hassan", passportNumber: "UAE123461", nationality: "UAE", birthDate: "1997-03-10" },
          { id: 7, firstName: "Omar", lastName: "Al-Hassan", passportNumber: "UAE123462", nationality: "UAE", birthDate: "1999-05-15" },
          { id: 8, firstName: "Layla", lastName: "Al-Hassan", passportNumber: "UAE123463", nationality: "UAE", birthDate: "2001-07-20" },
        ],
        adults: 6,
        children: 2,
        totalPax: 8,
        notes: "Completed successfully",
        serviceData: {
          id: 1,
          date: "2024-04-10",
          departure: "Dubai (DXB)",
          arrival: "Antalya (AYT)",
          departureTime: "08:30",
          arrivalTime: "13:00",
          flightType: "International",
          airline: "Emirates",
          pax: 8,
          currency: "EUR",
          pricePerPax: "320",
          totalPrice: 2560,
        }
      },
      // Vouchers for P004 (Confirmed Dubai Luxury)
      {
        id: "V-P004-H1",
        proposalId: "P004",
        proposalReference: "PROP-2024-004",
        serviceType: "hotel" as const,
        serviceId: 1,
        status: "PENDING_PAYMENT" as VoucherStatus,
        source: "src4", // Manager
        agencyId: "5",
        salesPersonId: "6",
        guests: [
          { id: 1, firstName: "James", lastName: "Smith", passportNumber: "GB987654", nationality: "United Kingdom", birthDate: "1975-03-10" },
          { id: 2, firstName: "Emma", lastName: "Smith", passportNumber: "GB987655", nationality: "United Kingdom", birthDate: "1980-05-15" },
        ],
        adults: 2,
        children: 0,
        totalPax: 2,
        notes: "VIP treatment requested. Anniversary celebration.",
        serviceData: {
          id: 1,
          destinationId: "7",
          hotelId: "8",
          checkin: "2024-05-05",
          checkout: "2024-05-08",
          nights: 3,
          roomType: "Panoramic Suite",
          boardType: "HB (Half Board)",
          numRooms: 1,
          currency: "USD",
          pricePerNight: "1200",
          totalPrice: 3600,
        }
      },
      {
        id: "V-P004-H2",
        proposalId: "P004",
        proposalReference: "PROP-2024-004",
        serviceType: "hotel" as const,
        serviceId: 2,
        status: "PENDING_PAYMENT" as VoucherStatus,
        source: "src4", // Manager
        agencyId: "5",
        salesPersonId: "6",
        guests: [
          { id: 1, firstName: "James", lastName: "Smith", passportNumber: "GB987654", nationality: "United Kingdom", birthDate: "1975-03-10" },
          { id: 2, firstName: "Emma", lastName: "Smith", passportNumber: "GB987655", nationality: "United Kingdom", birthDate: "1980-05-15" },
        ],
        adults: 2,
        children: 0,
        totalPax: 2,
        notes: "",
        serviceData: {
          id: 2,
          destinationId: "8",
          hotelId: "9",
          checkin: "2024-05-08",
          checkout: "2024-05-10",
          nights: 2,
          roomType: "Suite",
          boardType: "BB (Bed & Breakfast)",
          numRooms: 1,
          currency: "USD",
          pricePerNight: "500",
          totalPrice: 1000,
        }
      },
      {
        id: "V-P004-T1",
        proposalId: "P004",
        proposalReference: "PROP-2024-004",
        serviceType: "transportation" as const,
        serviceId: 1,
        status: "PENDING_PAYMENT" as VoucherStatus,
        source: "src4", // Manager
        agencyId: "5",
        salesPersonId: "6",
        guests: [],
        adults: 2,
        children: 0,
        totalPax: 2,
        notes: "Premium luxury vehicle required",
        serviceData: {
          id: 1,
          destinationId: "7",
          date: "2024-05-05",
          description: "Private Chauffeur Service",
          vehicleType: "Sedan (4 PAX)",
          numDays: 5,
          numVehicles: 1,
          currency: "USD",
          pricePerDay: "150",
          totalPrice: 750,
        }
      },
      {
        id: "V-P004-A1",
        proposalId: "P004",
        proposalReference: "PROP-2024-004",
        serviceType: "additional" as const,
        serviceId: 1,
        status: "PENDING_PAYMENT" as VoucherStatus,
        source: "src4", // Manager
        agencyId: "5",
        salesPersonId: "6",
        guests: [],
        adults: 2,
        children: 0,
        totalPax: 2,
        notes: "Sunset desert safari preferred",
        serviceData: {
          id: 1,
          destinationId: "7",
          date: "2024-05-06",
          description: "Desert Safari",
          serviceType: "Activities",
          numDays: 1,
          numPax: 2,
          currency: "USD",
          pricePerPax: "120",
          totalPrice: 240,
        }
      },
      // Vouchers for P007 - Bodrum Beach Getaway (CONFIRMED)
      {
        id: "V-P007-H1",
        proposalId: "P007",
        proposalReference: "PROP-2024-007",
        serviceType: "hotel" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src3", // Sales Employee
        agencyId: "8",
        salesPersonId: "1",
        guests: [
          { id: 1, firstName: "Carlos", lastName: "Rodriguez", passportNumber: "ES7654321", nationality: "Spain", birthDate: "1982-04-12" },
          { id: 2, firstName: "Maria", lastName: "Rodriguez", passportNumber: "ES7654322", nationality: "Spain", birthDate: "1985-06-18" },
          { id: 3, firstName: "Sofia", lastName: "Rodriguez", passportNumber: "ES7654323", nationality: "Spain", birthDate: "2010-08-22" },
          { id: 4, firstName: "Diego", lastName: "Rodriguez", passportNumber: "ES7654324", nationality: "Spain", birthDate: "2012-11-05" },
        ],
        adults: 2,
        children: 2,
        totalPax: 4,
        notes: "Sea view rooms requested. Late checkout needed on departure day.",
        serviceData: {
          id: 1,
          destinationId: "6",
          hotelId: "11",
          checkin: "2024-05-01",
          checkout: "2024-05-08",
          nights: 7,
          roomType: "Sea View Suite",
          boardType: "HB (Half Board)",
          numRooms: 2,
          currency: "EUR",
          pricePerNight: "280",
          totalPrice: 3920,
        }
      },
      {
        id: "V-P007-T1",
        proposalId: "P007",
        proposalReference: "PROP-2024-007",
        serviceType: "transportation" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src3", // Sales Employee
        agencyId: "8",
        salesPersonId: "1",
        guests: [],
        adults: 2,
        children: 2,
        totalPax: 4,
        notes: "Car seat needed for 4-year-old child.",
        serviceData: {
          id: 1,
          destinationId: "6",
          date: "2024-05-01",
          description: "Airport Transfer & Local Transportation",
          vehicleType: "Van (7 PAX)",
          numDays: 7,
          numVehicles: 1,
          currency: "EUR",
          pricePerDay: "60",
          totalPrice: 420,
        }
      },
      {
        id: "V-P007-A1",
        proposalId: "P007",
        proposalReference: "PROP-2024-007",
        serviceType: "additional" as const,
        serviceId: 1,
        status: "PENDING_PAYMENT" as VoucherStatus,
        source: "src3", // Sales Employee
        agencyId: "8",
        salesPersonId: "1",
        guests: [],
        adults: 2,
        children: 2,
        totalPax: 4,
        notes: "Morning boat tour preferred (9AM departure).",
        serviceData: {
          id: 1,
          destinationId: "6",
          date: "2024-05-03",
          description: "Private Boat Tour",
          serviceType: "Activities",
          numDays: 1,
          numPax: 4,
          currency: "EUR",
          pricePerPax: "90",
          totalPrice: 360,
        }
      },
      // Vouchers for P008 - Trabzon Nature Tour (CONFIRMED)
      {
        id: "V-P008-H1",
        proposalId: "P008",
        proposalReference: "PROP-2024-008",
        serviceType: "hotel" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src2", // Travel Agency (B2B)
        agencyId: "12",
        salesPersonId: "6",
        guests: [
          { id: 1, firstName: "Dmitri", lastName: "Volkov", passportNumber: "RU4567890", nationality: "Russia", birthDate: "1978-03-15" },
          { id: 2, firstName: "Elena", lastName: "Volkova", passportNumber: "RU4567891", nationality: "Russia", birthDate: "1980-05-22" },
          { id: 3, firstName: "Igor", lastName: "Volkov", passportNumber: "RU4567892", nationality: "Russia", birthDate: "2005-07-10" },
          { id: 4, firstName: "Natasha", lastName: "Volkova", passportNumber: "RU4567893", nationality: "Russia", birthDate: "2007-09-14" },
          { id: 5, firstName: "Alexei", lastName: "Petrov", passportNumber: "RU4567894", nationality: "Russia", birthDate: "1975-11-20" },
          { id: 6, firstName: "Svetlana", lastName: "Petrova", passportNumber: "RU4567895", nationality: "Russia", birthDate: "1977-01-25" },
          { id: 7, firstName: "Mikhail", lastName: "Petrov", passportNumber: "RU4567896", nationality: "Russia", birthDate: "2008-04-30" },
          { id: 8, firstName: "Anastasia", lastName: "Petrova", passportNumber: "RU4567897", nationality: "Russia", birthDate: "2010-06-18" },
        ],
        adults: 4,
        children: 4,
        totalPax: 8,
        notes: "Russian-speaking guide required. Rooms close together preferred.",
        serviceData: {
          id: 1,
          destinationId: "11",
          hotelId: "14",
          checkin: "2024-05-10",
          checkout: "2024-05-15",
          nights: 5,
          roomType: "Deluxe Room",
          boardType: "HB (Half Board)",
          numRooms: 4,
          currency: "USD",
          pricePerNight: "110",
          totalPrice: 2200,
        }
      },
      {
        id: "V-P008-T1",
        proposalId: "P008",
        proposalReference: "PROP-2024-008",
        serviceType: "transportation" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src2", // Travel Agency (B2B)
        agencyId: "12",
        salesPersonId: "6",
        guests: [],
        adults: 4,
        children: 4,
        totalPax: 8,
        notes: "Driver with basic Russian language skills preferred.",
        serviceData: {
          id: 1,
          destinationId: "11",
          date: "2024-05-10",
          description: "Trabzon Transportation & Tours",
          vehicleType: "Mini Bus (15 PAX)",
          numDays: 5,
          numVehicles: 1,
          currency: "USD",
          pricePerDay: "120",
          totalPrice: 600,
        }
      },
      {
        id: "V-P008-A1",
        proposalId: "P008",
        proposalReference: "PROP-2024-008",
        serviceType: "additional" as const,
        serviceId: 1,
        status: "COMPLETED" as VoucherStatus,
        channel: "WhatsApp",
        agencyId: "12",
        salesPersonId: "6",
        guests: [],
        adults: 4,
        children: 4,
        totalPax: 8,
        notes: "Professional Russian-speaking tour guide confirmed.",
        serviceData: {
          id: 1,
          destinationId: "11",
          date: "2024-05-11",
          description: "Sumela Monastery Tour with Guide",
          serviceType: "Tour Guide",
          numDays: 1,
          numPax: 8,
          currency: "USD",
          pricePerPax: "50",
          totalPrice: 400,
        }
      },
      // Vouchers for P009 - Marmaris Family Holiday (CONFIRMED)
      {
        id: "V-P009-H1",
        proposalId: "P009",
        proposalReference: "PROP-2024-009",
        serviceType: "hotel" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src5", // Other
        agencyId: "4",
        salesPersonId: "9",
        guests: [
          { id: 1, firstName: "Hans", lastName: "Mueller", passportNumber: "DE8901234", nationality: "Germany", birthDate: "1975-02-10" },
          { id: 2, firstName: "Greta", lastName: "Mueller", passportNumber: "DE8901235", nationality: "Germany", birthDate: "1977-04-15" },
          { id: 3, firstName: "Klaus", lastName: "Mueller", passportNumber: "DE8901236", nationality: "Germany", birthDate: "2008-06-20" },
          { id: 4, firstName: "Emma", lastName: "Mueller", passportNumber: "DE8901237", nationality: "Germany", birthDate: "2010-08-25" },
          { id: 5, firstName: "Friedrich", lastName: "Schmidt", passportNumber: "DE8901238", nationality: "Germany", birthDate: "1973-10-30" },
          { id: 6, firstName: "Helga", lastName: "Schmidt", passportNumber: "DE8901239", nationality: "Germany", birthDate: "1976-12-05" },
          { id: 7, firstName: "Werner", lastName: "Schmidt", passportNumber: "DE8901240", nationality: "Germany", birthDate: "2007-01-12" },
          { id: 8, firstName: "Liesl", lastName: "Schmidt", passportNumber: "DE8901241", nationality: "Germany", birthDate: "2009-03-18" },
          { id: 9, firstName: "Otto", lastName: "Becker", passportNumber: "DE8901242", nationality: "Germany", birthDate: "1980-05-22" },
          { id: 10, firstName: "Ingrid", lastName: "Becker", passportNumber: "DE8901243", nationality: "Germany", birthDate: "1982-07-28" },
          { id: 11, firstName: "Max", lastName: "Becker", passportNumber: "DE8901244", nationality: "Germany", birthDate: "2011-09-05" },
          { id: 12, firstName: "Sofia", lastName: "Becker", passportNumber: "DE8901245", nationality: "Germany", birthDate: "2013-11-10" },
        ],
        adults: 6,
        children: 6,
        totalPax: 12,
        notes: "All-inclusive wristbands for entire group. Family rooms close together.",
        serviceData: {
          id: 1,
          destinationId: "12",
          hotelId: "15",
          checkin: "2024-07-01",
          checkout: "2024-07-15",
          nights: 14,
          roomType: "Family Room",
          boardType: "AI (All Inclusive)",
          numRooms: 4,
          currency: "EUR",
          pricePerNight: "180",
          totalPrice: 10080,
        }
      },
      {
        id: "V-P009-T1",
        proposalId: "P009",
        proposalReference: "PROP-2024-009",
        serviceType: "transportation" as const,
        serviceId: 1,
        status: "PAID" as VoucherStatus,
        source: "src5", // Other
        agencyId: "4",
        salesPersonId: "9",
        guests: [],
        adults: 6,
        children: 6,
        totalPax: 12,
        notes: "Large minibus required for group of 12 with luggage.",
        serviceData: {
          id: 1,
          destinationId: "12",
          date: "2024-07-01",
          description: "Airport Transfer",
          vehicleType: "Mini Bus (15 PAX)",
          numDays: 1,
          numVehicles: 1,
          currency: "EUR",
          pricePerDay: "80",
          totalPrice: 80,
        }
      }
    ];
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("toms_companyInfo", JSON.stringify(companyInfo)); }, [companyInfo]);
  useEffect(() => { localStorage.setItem("toms_destinations", JSON.stringify(destinations)); }, [destinations]);
  useEffect(() => { localStorage.setItem("toms_hotels", JSON.stringify(hotels)); }, [hotels]);
  useEffect(() => { localStorage.setItem("toms_agencies", JSON.stringify(agencies)); }, [agencies]);
  useEffect(() => { localStorage.setItem("toms_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("toms_globalLookups", JSON.stringify(globalLookups)); }, [globalLookups]);
  useEffect(() => { localStorage.setItem("toms_sources", JSON.stringify(sources)); }, [sources]);
  useEffect(() => { localStorage.setItem("toms_proposals", JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem("toms_vouchers", JSON.stringify(vouchers)); }, [vouchers]);

  // Destination CRUD
  const addDestination = (destination: Destination) => setDestinations(prev => [...prev, destination]);
  const updateDestination = (id: string, updates: Partial<Destination>) => 
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  const deleteDestination = (id: string) => setDestinations(prev => prev.filter(d => d.id !== id));
  const getDestination = (id: string) => destinations.find(d => d.id === id);

  // Hotel CRUD
  const addHotel = (hotel: Hotel) => setHotels(prev => [...prev, hotel]);
  const updateHotel = (id: string, updates: Partial<Hotel>) => 
    setHotels(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  const deleteHotel = (id: string) => setHotels(prev => prev.filter(h => h.id !== id));
  const getHotel = (id: string) => hotels.find(h => h.id === id);
  const getHotelsByDestination = (destinationId: string) => hotels.filter(h => h.destinationId === destinationId);

  // Agency CRUD
  const addAgency = (agency: Agency) => setAgencies(prev => [...prev, agency]);
  const updateAgency = (id: string, updates: Partial<Agency>) => 
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  const deleteAgency = (id: string) => setAgencies(prev => prev.filter(a => a.id !== id));
  const getAgency = (id: string) => agencies.find(a => a.id === id);

  // User CRUD
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const updateUser = (id: string, updates: Partial<User>) => 
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  const getUser = (id: string) => users.find(u => u.id === id);

  // Source CRUD
  const addSource = (source: Source) => setSources(prev => [...prev, source]);
  const updateSource = (id: string, updates: Partial<Source>) => 
    setSources(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id));
  const getSource = (id: string) => sources.find(s => s.id === id);

  // Proposal CRUD
  const addProposal = (proposal: Proposal) => setProposals(prev => [...prev, proposal]);
  const updateProposal = (id: string, updates: Partial<Proposal>) => 
    setProposals(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProposal = (id: string) => setProposals(prev => prev.filter(p => p.id !== id));
  const getProposal = (id: string) => proposals.find(p => p.id === id);

  const confirmProposal = (id: string, selectedServices: any) => {
    const proposal = getProposal(id);
    if (!proposal) return;

    updateProposal(id, { status: "CONFIRMED" });

    const newVouchers: Voucher[] = [];
    
    // Generate vouchers for each selected service
    ["hotels", "transportation", "flights", "rentACar", "additionalServices"].forEach((serviceType) => {
      const serviceKey = serviceType as keyof typeof selectedServices;
      if (selectedServices[serviceKey]) {
        selectedServices[serviceKey].forEach((serviceId: number) => {
          const serviceData = proposal[serviceKey as keyof Proposal];
          if (Array.isArray(serviceData)) {
            const service = serviceData.find((s: any) => s.id === serviceId);
            if (service) {
              newVouchers.push({
                id: `V-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                proposalId: proposal.id,
                proposalReference: proposal.reference,
                serviceType: serviceType.replace("rentACar", "rentacar") as any,
                serviceId: serviceId,
                status: "PENDING_PAYMENT",
                source: proposal.source,
                agencyId: proposal.agencyId,
                salesPersonId: proposal.salesPersonId,
                guests: [],
                adults: 0,
                children: 0,
                totalPax: 0,
                notes: "",
                serviceData: service,
              });
            }
          }
        });
      }
    });

    setVouchers(prev => [...prev, ...newVouchers]);
  };

  // Voucher CRUD
  const addVoucher = (voucher: Voucher) => setVouchers(prev => [...prev, voucher]);
  const updateVoucher = (id: string, updates: Partial<Voucher>) => 
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  const getVoucher = (id: string) => vouchers.find(v => v.id === id);
  const getProposalVouchers = (proposalId: string) => vouchers.filter(v => v.proposalId === proposalId);

  return (
    <DataContext.Provider
      value={{
        companyInfo,
        updateCompanyInfo,
        destinations,
        hotels,
        agencies,
        users,
        globalLookups,
        sources,
        proposals,
        vouchers,
        addDestination,
        updateDestination,
        deleteDestination,
        getDestination,
        addHotel,
        updateHotel,
        deleteHotel,
        getHotel,
        getHotelsByDestination,
        addAgency,
        updateAgency,
        deleteAgency,
        getAgency,
        addUser,
        updateUser,
        deleteUser,
        getUser,
        addSource,
        updateSource,
        deleteSource,
        getSource,
        addProposal,
        updateProposal,
        deleteProposal,
        getProposal,
        confirmProposal,
        addVoucher,
        updateVoucher,
        getVoucher,
        getProposalVouchers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}