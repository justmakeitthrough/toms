import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Combobox } from "../components/ui/combobox";
import { MultiSelect } from "../components/ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { 
  ArrowLeft, Plus, Trash2, Save, FileText, Hotel, Plane, 
  Car, Bus, Package, Copy, FileStack 
} from "lucide-react";
import { toast } from "sonner";
import { useData, type Proposal } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { TransportationBuilder } from "../components/proposal/TransportationBuilder";
import { FlightsBuilder } from "../components/proposal/FlightsBuilder";
import { RentACarBuilder } from "../components/proposal/RentACarBuilder";
import { AdditionalServicesBuilder } from "../components/proposal/AdditionalServicesBuilder";
import { HotelsBuilder } from "../components/proposal/HotelsBuilder";

type ServiceType = "hotels" | "transportation" | "flights" | "rentacar" | "additional";

export function ProposalCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { addProposal, updateProposal, getProposal, destinations, agencies, users, proposals, sources } = useData();
  const { user } = useAuth();
  
  const [inputMethod, setInputMethod] = useState<"forms" | "table">("forms");
  const [activeTab, setActiveTab] = useState("basic");
  const [activeServiceTab, setActiveServiceTab] = useState<ServiceType>("hotels");

  // Modal state for choosing creation method
  const [showCreationModal, setShowCreationModal] = useState(!editId);
  const [selectedProposalToCopy, setSelectedProposalToCopy] = useState("");

  // Load existing proposal if editing
  const existingProposal = editId ? getProposal(editId) : null;

  // Basic Info
  const [proposalId] = useState(editId || `${Date.now()}`);
  const [reference] = useState(
    existingProposal?.reference || `TOMS-2024-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [source, setSource] = useState(existingProposal?.source || "");
  const [agency, setAgency] = useState(existingProposal?.agencyId || "");
  const [salesPerson, setSalesPerson] = useState(existingProposal?.salesPersonId || user?.id || "");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    existingProposal?.destinationIds || []
  );
  const [estimatedNights, setEstimatedNights] = useState(existingProposal?.estimatedNights || "");

  // Services
  const [hotels, setHotels] = useState(existingProposal?.hotels || [
    {
      id: Date.now(),
      destinationId: "",
      hotelId: "",
      checkin: "",
      checkout: "",
      nights: 0,
      roomType: "",
      boardType: "",
      numRooms: 1,
      currency: "USD",
      pricePerNight: "",
      totalPrice: 0,
    },
  ]);

  const [transportation, setTransportation] = useState(existingProposal?.transportation || [
    {
      id: Date.now(),
      destinationId: "", date: "", description: "", vehicleType: "", numDays: 1, numVehicles: 1,
      currency: "USD", pricePerDay: "", totalPrice: 0,
    },
  ]);

  const [flights, setFlights] = useState(existingProposal?.flights || [
    {
      id: Date.now(),
      destinationId: "", date: "", departure: "", arrival: "", departureTime: "", arrivalTime: "",
      flightType: "", pax: 1, currency: "USD", pricePerPax: "", totalPrice: 0,
    },
  ]);

  const [rentACar, setRentACar] = useState(existingProposal?.rentACar || [
    {
      id: Date.now(),
      destinationId: "", date: "", carType: "", pickupLocation: "", dropoffLocation: "",
      numDays: 1, currency: "USD",
      pricePerDay: "", totalPrice: 0,
    },
  ]);

  const [additionalServices, setAdditionalServices] = useState(existingProposal?.additionalServices || [
    {
      id: Date.now(),
      destinationId: "", date: "", description: "", serviceType: "", numDays: 1, numPeople: 1,
      currency: "USD",
      pricePerDay: "", totalPrice: 0,
    },
  ]);

  const [overallMargin, setOverallMargin] = useState(existingProposal?.overallMargin || "15");
  const [commission, setCommission] = useState(existingProposal?.commission || "5");
  const [pdfLanguage, setPdfLanguage] = useState(existingProposal?.pdfLanguage || "arabic");
  const [displayCurrency, setDisplayCurrency] = useState(existingProposal?.displayCurrency || "usd");

  // Handle creation method selection
  const handleStartFromScratch = () => {
    setShowCreationModal(false);
    toast.success("Starting new proposal from scratch");
  };

  const handleCopyExisting = () => {
    if (!selectedProposalToCopy) {
      toast.error("Please select a proposal to copy");
      return;
    }

    const proposalToCopy = getProposal(selectedProposalToCopy);
    if (proposalToCopy) {
      // Copy all data from selected proposal
      setSource(proposalToCopy.source || "");
      setAgency(proposalToCopy.agencyId || "");
      setSalesPerson(proposalToCopy.salesPersonId || user?.id || "");
      setSelectedDestinations(proposalToCopy.destinationIds || []);
      setEstimatedNights(proposalToCopy.estimatedNights || "");
      
      // Copy services with new IDs
      setHotels(proposalToCopy.hotels.map(h => ({ ...h, id: Date.now() + Math.random() })));
      setTransportation(proposalToCopy.transportation.map(t => ({ ...t, id: Date.now() + Math.random() })));
      setFlights(proposalToCopy.flights.map(f => ({ ...f, id: Date.now() + Math.random() })));
      setRentACar(proposalToCopy.rentACar.map(r => ({ ...r, id: Date.now() + Math.random() })));
      setAdditionalServices(proposalToCopy.additionalServices.map(a => ({ ...a, id: Date.now() + Math.random() })));
      
      setOverallMargin(proposalToCopy.overallMargin || "15");
      setCommission(proposalToCopy.commission || "5");
      setPdfLanguage(proposalToCopy.pdfLanguage || "arabic");
      setDisplayCurrency(proposalToCopy.displayCurrency || "usd");

      setShowCreationModal(false);
      toast.success(`Copied data from ${proposalToCopy.reference}`);
    }
  };

  // Load existing proposal data when editing
  useEffect(() => {
    if (existingProposal) {
      setSource(existingProposal.source || "");
      setAgency(existingProposal.agencyId || "");
      setSalesPerson(existingProposal.salesPersonId || user?.id || "");
      setSelectedDestinations(existingProposal.destinationIds || []);
      setEstimatedNights(existingProposal.estimatedNights || "");
      setHotels(existingProposal.hotels || hotels);
      setTransportation(existingProposal.transportation || transportation);
      setFlights(existingProposal.flights || flights);
      setRentACar(existingProposal.rentACar || rentACar);
      setAdditionalServices(existingProposal.additionalServices || additionalServices);
      setOverallMargin(existingProposal.overallMargin || "15");
      setCommission(existingProposal.commission || "5");
      setPdfLanguage(existingProposal.pdfLanguage || "arabic");
      setDisplayCurrency(existingProposal.displayCurrency || "usd");
    }
  }, [editId]);

  // Calculations
  const calculateNights = (checkin: string, checkout: string) => {
    if (!checkin || !checkout) return 0;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getGrandTotal = () => {
    const hotelTotal = hotels.reduce((sum, h) => {
      const nights = calculateNights(h.checkin, h.checkout);
      return sum + nights * (parseFloat(h.pricePerNight) || 0) * h.numRooms;
    }, 0);
    const transportTotal = transportation.reduce((sum, t) => 
      sum + (parseFloat(t.pricePerDay) || 0) * t.numDays * (t.numVehicles || 1), 0);
    const flightTotal = flights.reduce((sum, f) => 
      sum + (parseFloat(f.pricePerPax) || 0) * f.pax, 0);
    const carTotal = rentACar.reduce((sum, c) => 
      sum + (parseFloat(c.pricePerDay) || 0) * c.numDays, 0);
    const additionalTotal = additionalServices.reduce((sum, a) => 
      sum + (parseFloat(a.pricePerDay) || 0) * a.numDays * (a.numPeople || 1), 0);
    return hotelTotal + transportTotal + flightTotal + carTotal + additionalTotal;
  };

  const getFinalTotal = () => {
    const total = getGrandTotal();
    const marginAmount = (total * (parseFloat(overallMargin) || 0)) / 100;
    const commissionAmount = (total * (parseFloat(commission) || 0)) / 100;
    return total + marginAmount + commissionAmount;
  };

  // Save functions
  const saveProposal = (status: "NEW" | "CONFIRMED" = "NEW") => {
    const proposal: Proposal = {
      id: proposalId,
      reference,
      source,
      agencyId: agency,
      salesPersonId: salesPerson,
      destinationIds: selectedDestinations,
      estimatedNights,
      status,
      createdAt: existingProposal?.createdAt || new Date().toISOString(),
      hotels: hotels.map(h => ({ ...h, nights: calculateNights(h.checkin, h.checkout) })),
      transportation,
      flights,
      rentACar,
      additionalServices,
      overallMargin,
      commission,
      pdfLanguage,
      displayCurrency,
    };

    if (existingProposal) {
      updateProposal(proposalId, proposal);
      toast.success("Proposal updated successfully");
    } else {
      addProposal(proposal);
      toast.success("Proposal saved successfully");
    }
    
    return proposal.id;
  };

  const handleSaveDraft = () => {
    saveProposal("NEW");
    navigate("/proposals");
  };

  const handleGenerateQuote = () => {
    const id = saveProposal("NEW");
    toast.success("Quote generated successfully! (Mock PDF)");
    navigate(`/proposals/${id}`);
  };

  // Add/Remove functions
  const addHotel = () => setHotels([...hotels, {
    id: Date.now(), destinationId: "", hotelId: "", checkin: "", checkout: "", nights: 0,
    roomType: "", boardType: "", numRooms: 1, currency: "USD",
    pricePerNight: "", totalPrice: 0,
  }]);

  const duplicateHotel = (index: number) => {
    const hotel = { ...hotels[index], id: Date.now() };
    setHotels([...hotels, hotel]);
    toast.success("Hotel entry duplicated");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {existingProposal ? "Edit Proposal" : "New Proposal"}
            </h1>
            <p className="text-gray-600 mt-1">Reference: {reference}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleGenerateQuote} className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Quote
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary Builder</TabsTrigger>
          <TabsTrigger value="summary">Summary & Pricing</TabsTrigger>
        </TabsList>

        {/* BASIC INFORMATION TAB */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Proposal Reference</Label>
                  <Input value={reference} disabled className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source / Channel *</Label>
                  <Combobox
                    options={sources.filter(s => s.isActive).map((source) => ({
                      value: source.id,
                      label: source.name,
                    }))}
                    value={source}
                    onValueChange={setSource}
                    placeholder="Select source"
                    searchPlaceholder="Search sources..."
                  />
                </div>

                {/* Agency field - only shown for Travel Agency (B2B) source */}
                {source === "src2" && (
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agency *</Label>
                    <Combobox
                      options={agencies.map((agency) => ({
                        value: agency.id,
                        label: agency.name,
                        sublabel: agency.country,
                      }))}
                      value={agency}
                      onValueChange={setAgency}
                      placeholder="Select agency"
                      searchPlaceholder="Search agencies..."
                      emptyText="No agencies found."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="sales">Sales Person</Label>
                  <Combobox
                    options={users.map((user) => ({
                      value: user.id,
                      label: user.name,
                      sublabel: user.email,
                    }))}
                    value={salesPerson}
                    onValueChange={setSalesPerson}
                    placeholder="Select sales person"
                    searchPlaceholder="Search users..."
                    emptyText="No users found."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destinations *</Label>
                  <MultiSelect
                    options={destinations.filter(d => d.isActive).map(d => ({
                      value: d.id,
                      label: `${d.name} (${d.country})`
                    }))}
                    selected={selectedDestinations}
                    onChange={setSelectedDestinations}
                    placeholder="Select destinations..."
                    emptyMessage="No destinations found."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nights">Estimated Nights</Label>
                  <Input 
                    id="nights" 
                    type="number" 
                    placeholder="Auto-calculated from itinerary" 
                    value={estimatedNights} 
                    onChange={(e) => setEstimatedNights(e.target.value)} 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setActiveTab("itinerary")}>
                  Continue to Itinerary Builder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ITINERARY BUILDER TAB */}
        <TabsContent value="itinerary" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Build Your Itinerary</CardTitle>
                <RadioGroup value={inputMethod} onValueChange={(val: any) => setInputMethod(val)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="forms" id="forms" />
                    <Label htmlFor="forms" className="cursor-pointer">Nested Forms</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="table" id="table" />
                    <Label htmlFor="table" className="cursor-pointer">Table View</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardHeader>
            <CardContent>
              {/* Service Type Tabs */}
              <Tabs value={activeServiceTab} onValueChange={(val: any) => setActiveServiceTab(val)}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="hotels" className="gap-2">
                    <Hotel className="h-4 w-4" />
                    Hotels ({hotels.length})
                  </TabsTrigger>
                  <TabsTrigger value="transportation" className="gap-2">
                    <Bus className="h-4 w-4" />
                    Transport ({transportation.length})
                  </TabsTrigger>
                  <TabsTrigger value="flights" className="gap-2">
                    <Plane className="h-4 w-4" />
                    Flights ({flights.length})
                  </TabsTrigger>
                  <TabsTrigger value="rentacar" className="gap-2">
                    <Car className="h-4 w-4" />
                    Cars ({rentACar.length})
                  </TabsTrigger>
                  <TabsTrigger value="additional" className="gap-2">
                    <Package className="h-4 w-4" />
                    Services ({additionalServices.length})
                  </TabsTrigger>
                </TabsList>

                {/* HOTELS TAB */}
                <TabsContent value="hotels" className="space-y-4 mt-6">
                  <HotelsBuilder
                    entries={hotels}
                    onChange={setHotels}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                  />
                </TabsContent>

                {/* Transportation, Flights, etc. - keeping them simple for now */}
                <TabsContent value="transportation" className="space-y-4 mt-6">
                  <TransportationBuilder
                    entries={transportation}
                    onChange={setTransportation}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                  />
                </TabsContent>

                <TabsContent value="flights" className="space-y-4 mt-6">
                  <FlightsBuilder
                    entries={flights}
                    onChange={setFlights}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                  />
                </TabsContent>

                <TabsContent value="rentacar" className="space-y-4 mt-6">
                  <RentACarBuilder
                    entries={rentACar}
                    onChange={setRentACar}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                  />
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-6">
                  <AdditionalServicesBuilder
                    entries={additionalServices}
                    onChange={setAdditionalServices}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-6 border-t mt-6">
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  Back to Basic Info
                </Button>
                <Button onClick={() => setActiveTab("summary")}>
                  Continue to Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUMMARY TAB */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Summary & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Service Breakdown</h3>
                
                {hotels.some(h => h.pricePerNight) && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Hotel className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Hotels ({hotels.length} entries)</p>
                        <p className="text-sm text-gray-600">
                          Total nights: {hotels.reduce((sum, h) => sum + calculateNights(h.checkin, h.checkout), 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      ${hotels.reduce((sum, h) => {
                        const nights = calculateNights(h.checkin, h.checkout);
                        return sum + nights * (parseFloat(h.pricePerNight) || 0) * h.numRooms;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {transportation.some(t => t.pricePerDay) && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bus className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Transportation ({transportation.length} entries)</p>
                        <p className="text-sm text-gray-600">
                          Total days: {transportation.reduce((sum, t) => sum + t.numDays, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      ${transportation.reduce((sum, t) => 
                        sum + (parseFloat(t.pricePerDay) || 0) * t.numDays * (t.numVehicles || 1), 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {flights.some(f => f.pricePerPax) && (
                  <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="font-medium">Flights ({flights.length} entries)</p>
                        <p className="text-sm text-gray-600">
                          Total PAX: {flights.reduce((sum, f) => sum + f.pax, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      ${flights.reduce((sum, f) => 
                        sum + (parseFloat(f.pricePerPax) || 0) * f.pax, 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {rentACar.some(c => c.pricePerDay) && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Rent a Car ({rentACar.length} entries)</p>
                        <p className="text-sm text-gray-600">
                          Total rental days: {rentACar.reduce((sum, c) => sum + c.numDays, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      ${rentACar.reduce((sum, c) => 
                        sum + (parseFloat(c.pricePerDay) || 0) * c.numDays, 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {additionalServices.some(a => a.pricePerDay) && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Additional Services ({additionalServices.length} entries)</p>
                        <p className="text-sm text-gray-600">
                          Total service days: {additionalServices.reduce((sum, a) => sum + a.numDays, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      ${additionalServices.reduce((sum, a) => 
                        sum + (parseFloat(a.pricePerDay) || 0) * a.numDays * (a.numPeople || 1), 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Financial Calculations */}
              <div className="border-t pt-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Subtotal (Net Cost)</span>
                    <span className="font-bold">${getGrandTotal().toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="overallMargin">Overall Margin (%)</Label>
                      <Input
                        id="overallMargin"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 15"
                        value={overallMargin}
                        onChange={(e) => setOverallMargin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commission">Commission (%)</Label>
                      <Input
                        id="commission"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 5"
                        value={commission}
                        onChange={(e) => setCommission(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-blue-700">+ Margin ({overallMargin || 0}%)</span>
                    <span className="font-semibold text-blue-700">
                      +${((getGrandTotal() * (parseFloat(overallMargin) || 0)) / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-blue-700">+ Commission ({commission || 0}%)</span>
                    <span className="font-semibold text-blue-700">
                      +${((getGrandTotal() * (parseFloat(commission) || 0)) / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total Sale Price</span>
                      <span className="text-3xl font-bold text-green-600">
                        ${getFinalTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Settings */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">PDF Output Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdfLanguage">PDF Language</Label>
                    <Select value={pdfLanguage} onValueChange={setPdfLanguage}>
                      <SelectTrigger id="pdfLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="arabic">Arabic (العربية)</SelectItem>
                        <SelectItem value="turkish">Turkish (Türkçe)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Display Currency</Label>
                    <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="try">TRY (₺)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={() => setActiveTab("itinerary")}>
                  Back to Itinerary
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button onClick={handleGenerateQuote} className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate PDF Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Creation Method Modal */}
      <Dialog open={showCreationModal} onOpenChange={setShowCreationModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Proposal</DialogTitle>
            <DialogDescription>
              Choose how you want to create this proposal. You can start from scratch or copy an existing proposal to save time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Start from Scratch */}
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
              onClick={handleStartFromScratch}
            >
              <FileStack className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <p className="font-semibold">Start from Scratch</p>
                <p className="text-sm text-gray-500">Create a new proposal with blank fields</p>
              </div>
            </Button>

            {/* Copy Existing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Copy className="h-4 w-4" />
                <span className="font-medium">Or copy from an existing proposal</span>
              </div>
              <Combobox
                options={proposals.map((proposal) => {
                  const destNames = proposal.destinationIds
                    ?.map(destId => destinations.find(d => d.id === destId)?.name)
                    .filter(Boolean)
                    .join(", ") || "";
                  return {
                    value: proposal.id,
                    label: proposal.reference,
                    sublabel: destNames,
                  };
                })}
                value={selectedProposalToCopy}
                onValueChange={setSelectedProposalToCopy}
                placeholder="Select a proposal to copy..."
                searchPlaceholder="Search proposals..."
                emptyText="No proposals found."
              />
              <Button
                className="w-full"
                onClick={handleCopyExisting}
                disabled={!selectedProposalToCopy}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Selected Proposal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}