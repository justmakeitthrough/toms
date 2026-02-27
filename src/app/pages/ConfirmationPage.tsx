import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { ArrowLeft, CheckCircle2, Hotel, Bus, Plane, Car, Package } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { toast } from "sonner";

export function ConfirmationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProposal, confirmProposal, getDestination, getHotel } = useData();

  const proposal = id ? getProposal(id) : null;

  const [selectedServices, setSelectedServices] = useState({
    hotels: proposal?.hotels.map(h => h.id) || [],
    transportation: proposal?.transportation.map(t => t.id) || [],
    flights: proposal?.flights.map(f => f.id) || [],
    rentACar: proposal?.rentACar.map(c => c.id) || [],
    additionalServices: proposal?.additionalServices.map(a => a.id) || [],
  });

  if (!proposal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proposal Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  if (proposal.status === "CONFIRMED") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Already Confirmed</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">This proposal is already confirmed</p>
            <p className="text-gray-600 mb-4">Vouchers have been generated for this proposal.</p>
            <Button onClick={() => navigate("/vouchers")}>
              View Vouchers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateNights = (checkin: string, checkout: string) => {
    if (!checkin || !checkout) return 0;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const toggleService = (type: keyof typeof selectedServices, id: number) => {
    setSelectedServices(prev => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter(serviceId => serviceId !== id)
        : [...prev[type], id]
    }));
  };

  const handleConfirm = () => {
    if (!id) return;

    const totalSelected = Object.values(selectedServices).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalSelected === 0) {
      toast.error("Please select at least one service to confirm");
      return;
    }

    confirmProposal(id, selectedServices);
    toast.success(`Proposal confirmed! ${totalSelected} voucher(s) generated.`);
    navigate("/vouchers");
  };

  const totalSelected = Object.values(selectedServices).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/proposals/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Confirm Proposal</h1>
            <p className="text-gray-600 mt-1">{proposal.reference}</p>
          </div>
        </div>
        <Button onClick={handleConfirm} className="gap-2" disabled={totalSelected === 0}>
          <CheckCircle2 className="h-4 w-4" />
          Confirm & Generate Vouchers ({totalSelected})
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <p className="text-sm text-blue-900">
            ✓ Select the services you want to confirm and include in the vouchers. 
            Unchecked services will not be included in the booking.
          </p>
          <p className="text-xs text-blue-800 mt-2">
            ℹ️ Once confirmed, the proposal status will change to "CONFIRMED" and vouchers will be created with "PENDING" status. 
            Vouchers can then be sent to suppliers and marked as "CONFIRMED" once accepted.
          </p>
        </CardContent>
      </Card>

      {/* Hotels */}
      {proposal.hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-blue-600" />
              Hotels ({selectedServices.hotels.length}/{proposal.hotels.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.hotels.map((hotel) => {
                const hotelData = getHotel(hotel.hotelId);
                const destinationData = getDestination(hotel.destinationId);
                
                return (
                <div
                  key={hotel.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    selectedServices.hotels.includes(hotel.id)
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Checkbox
                    checked={selectedServices.hotels.includes(hotel.id)}
                    onCheckedChange={() => toggleService("hotels", hotel.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Hotel</p>
                      <p className="font-semibold">{hotelData?.name || 'Unknown Hotel'}</p>
                      <p className="text-sm text-gray-500">{destinationData?.name || 'Unknown City'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dates</p>
                      <p className="font-semibold text-sm">{hotel.checkin}</p>
                      <p className="text-sm">to {hotel.checkout}</p>
                      <p className="text-xs text-gray-500">
                        {calculateNights(hotel.checkin, hotel.checkout)} nights
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rooms</p>
                      <p className="font-semibold">{hotel.numRooms}x {hotel.roomType}</p>
                      <p className="text-sm text-gray-500">{hotel.boardType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold text-green-600">
                        {hotel.currency} {(
                          calculateNights(hotel.checkin, hotel.checkout) *
                          (parseFloat(hotel.pricePerNight) || 0) *
                          hotel.numRooms
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transportation */}
      {proposal.transportation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-orange-600" />
              Transportation ({selectedServices.transportation.length}/{proposal.transportation.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.transportation.map((trans) => {
                const destinationData = getDestination(trans.destinationId);
                
                return (
                <div
                  key={trans.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    selectedServices.transportation.includes(trans.id)
                      ? "bg-orange-50 border-orange-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Checkbox
                    checked={selectedServices.transportation.includes(trans.id)}
                    onCheckedChange={() => toggleService("transportation", trans.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-semibold">{trans.description}</p>
                      <p className="text-sm text-gray-500">{destinationData?.name || 'Unknown City'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{trans.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-semibold">{trans.vehicleType}</p>
                      <p className="text-sm text-gray-500">{trans.numDays} days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold text-green-600">
                        {trans.currency} {((parseFloat(trans.pricePerDay) || 0) * trans.numDays).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flights */}
      {proposal.flights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-purple-600" />
              Flights ({selectedServices.flights.length}/{proposal.flights.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.flights.map((flight) => (
                <div
                  key={flight.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    selectedServices.flights.includes(flight.id)
                      ? "bg-purple-50 border-purple-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Checkbox
                    checked={selectedServices.flights.includes(flight.id)}
                    onCheckedChange={() => toggleService("flights", flight.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-semibold">{flight.departure} → {flight.arrival}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold">{flight.date}</p>
                      <p className="text-sm text-gray-500">{flight.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type & PAX</p>
                      <p className="font-semibold">{flight.flightType}</p>
                      <p className="text-sm text-gray-500">{flight.pax} passengers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold text-green-600">
                        {flight.currency} {((parseFloat(flight.pricePerPax) || 0) * flight.pax).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rent a Car */}
      {proposal.rentACar.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-green-600" />
              Rent a Car ({selectedServices.rentACar.length}/{proposal.rentACar.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.rentACar.map((car) => {
                const destinationData = getDestination(car.destinationId);
                
                return (
                <div
                  key={car.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    selectedServices.rentACar.includes(car.id)
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Checkbox
                    checked={selectedServices.rentACar.includes(car.id)}
                    onCheckedChange={() => toggleService("rentACar", car.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Car Type</p>
                      <p className="font-semibold">{car.carType}</p>
                      <p className="text-sm text-gray-500">{destinationData?.name || 'Unknown City'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup Date</p>
                      <p className="font-semibold">{car.pickupDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{car.numDays} days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold text-green-600">
                        {car.currency} {((parseFloat(car.pricePerDay) || 0) * car.numDays).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Services */}
      {proposal.additionalServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-600" />
              Additional Services ({selectedServices.additionalServices.length}/{proposal.additionalServices.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.additionalServices.map((service) => {
                const destinationData = getDestination(service.destinationId);
                
                return (
                <div
                  key={service.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    selectedServices.additionalServices.includes(service.id)
                      ? "bg-amber-50 border-amber-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Checkbox
                    checked={selectedServices.additionalServices.includes(service.id)}
                    onCheckedChange={() => toggleService("additionalServices", service.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-semibold">{service.description}</p>
                      <p className="text-sm text-gray-500">{destinationData?.name || 'Unknown City'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{service.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{service.numDays} days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold text-green-600">
                        {service.currency} {((parseFloat(service.pricePerPax) || 0) * service.numPax).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {totalSelected} service{totalSelected !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-gray-600">
                {totalSelected} voucher{totalSelected !== 1 ? 's' : ''} will be generated
              </p>
            </div>
            <Button onClick={handleConfirm} size="lg" className="gap-2" disabled={totalSelected === 0}>
              <CheckCircle2 className="h-5 w-5" />
              Confirm & Generate Vouchers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}