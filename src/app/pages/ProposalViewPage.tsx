import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, FileText, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { useConfirm } from "../hooks/useConfirm";
import { generateProposalPDF } from "../utils/pdfGenerator";

export function ProposalViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProposal, updateProposal, deleteProposal, getHotel, getDestination, getAgency, getUser, getSource, companyInfo } = useData();
  const confirmDialog = useConfirm();

  const proposal = id ? getProposal(id) : null;

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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">The proposal you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/proposals")} className="mt-4">
              Back to Proposals
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

  const getGrandTotal = () => {
    const hotelTotal = proposal.hotels.reduce((sum, h) => {
      const nights = calculateNights(h.checkin, h.checkout);
      return sum + nights * (parseFloat(h.pricePerNight) || 0) * h.numRooms;
    }, 0);
    const transportTotal = proposal.transportation.reduce((sum, t) => 
      sum + (parseFloat(t.pricePerDay) || 0) * t.numDays, 0);
    const flightTotal = proposal.flights.reduce((sum, f) => 
      sum + (parseFloat(f.pricePerPax) || 0) * f.pax, 0);
    const carTotal = proposal.rentACar.reduce((sum, c) => 
      sum + (parseFloat(c.pricePerDay) || 0) * c.numDays, 0);
    const additionalTotal = proposal.additionalServices.reduce((sum, a) => 
      sum + (parseFloat(a.pricePerDay) || 0) * a.numDays, 0);
    return hotelTotal + transportTotal + flightTotal + carTotal + additionalTotal;
  };

  const getFinalTotal = () => {
    const total = getGrandTotal();
    const marginAmount = (total * (parseFloat(proposal.overallMargin) || 0)) / 100;
    const commissionAmount = (total * (parseFloat(proposal.commission) || 0)) / 100;
    return total + marginAmount + commissionAmount;
  };

  const handleConfirm = () => {
    navigate(`/proposals/${id}/confirm`);
  };

  const handleEdit = () => {
    navigate(`/proposals/new?edit=${id}`);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog.confirm({
      title: "Delete Proposal",
      description: "Are you sure you want to delete this proposal? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (confirmed) {
      deleteProposal(id);
      toast.success("Proposal deleted");
      navigate("/proposals");
    }
  };

  const handleGeneratePDF = () => {
    const agency = getAgency(proposal.agencyId);
    const salesPerson = getUser(proposal.salesPersonId);
    const destinations = proposal.destinationIds.map(id => getDestination(id));
    const hotels = proposal.hotels.map(h => getHotel(h.hotelId));
    
    generateProposalPDF(
      proposal,
      agency,
      salesPerson,
      destinations,
      hotels,
      companyInfo,
      {
        language: proposal.pdfLanguage,
        showPricing: true,
      }
    );
    toast.success("PDF generated successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-500">New</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Proposal Details</h1>
            <p className="text-gray-600 mt-1">{proposal.reference}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete} className="gap-2 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline" onClick={handleGeneratePDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Generate PDF
          </Button>
          {proposal.status === "NEW" && (
            <Button onClick={handleConfirm} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confirm Proposal
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Basic Information</CardTitle>
            {getStatusBadge(proposal.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Reference Number</p>
              <p className="font-semibold">{proposal.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Source / Channel</p>
              <p className="font-semibold capitalize">{getSource(proposal.source)?.name || proposal.source}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Agency</p>
              <p className="font-semibold">{getAgency(proposal.agencyId)?.name || 'Unknown Agency'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Sales Person</p>
              <p className="font-semibold">{getUser(proposal.salesPersonId)?.name || 'Unknown User'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Destinations</p>
              <p className="font-semibold">
                {proposal.destinationIds.map(id => getDestination(id)?.name).filter(Boolean).join(', ') || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Created Date</p>
              <p className="font-semibold">{new Date(proposal.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      {proposal.hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hotels ({proposal.hotels.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.hotels.map((hotel, index) => {
                const hotelData = getHotel(hotel.hotelId);
                const destinationData = getDestination(hotel.destinationId);
                return (
                  <div key={hotel.id} className="border rounded-lg p-4 bg-blue-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">City & Hotel</p>
                        <p className="font-semibold">{destinationData?.name || 'Unknown'}</p>
                        <p className="text-sm">{hotelData?.name || 'Unknown Hotel'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dates</p>
                        <p className="font-semibold">{hotel.checkin} → {hotel.checkout}</p>
                        <p className="text-sm">{hotel.nights} nights</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Room Details</p>
                        <p className="font-semibold">{hotel.numRooms}x {hotel.roomType}</p>
                        <p className="text-sm">{hotel.boardType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-bold text-lg text-green-600">
                          {hotel.currency} {hotel.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transportation */}
      {proposal.transportation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transportation ({proposal.transportation.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.transportation.map((transport) => {
                const destinationData = getDestination(transport.destinationId);
                return (
                  <div key={transport.id} className="border rounded-lg p-4 bg-purple-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Destination</p>
                        <p className="font-semibold">{destinationData?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date & Vehicle</p>
                        <p className="font-semibold">{transport.date}</p>
                        <p className="text-sm">{transport.vehicleType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="font-semibold">{transport.description}</p>
                        <p className="text-sm">{transport.numDays} days × {transport.numVehicles} vehicle(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-bold text-lg text-green-600">
                          {transport.currency} {transport.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flights */}
      {proposal.flights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flights ({proposal.flights.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.flights.map((flight) => (
                <div key={flight.id} className="border rounded-lg p-4 bg-sky-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-semibold">{flight.departure}</p>
                      <p className="text-sm">→ {flight.arrival}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold">{flight.date}</p>
                      <p className="text-sm">{flight.departureTime} - {flight.arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Flight Details</p>
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-sm">{flight.flightType} · {flight.pax} PAX</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-bold text-lg text-green-600">
                        {flight.currency} {flight.totalPrice.toFixed(2)}
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
            <CardTitle>Rent a Car ({proposal.rentACar.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.rentACar.map((car) => {
                const destinationData = getDestination(car.destinationId);
                return (
                  <div key={car.id} className="border rounded-lg p-4 bg-orange-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Destination</p>
                        <p className="font-semibold">{destinationData?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dates</p>
                        <p className="font-semibold">{car.pickupDate} → {car.dropoffDate}</p>
                        <p className="text-sm">{car.numDays} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Car Details</p>
                        <p className="font-semibold">{car.carType}</p>
                        <p className="text-sm">{car.pickupLocation} → {car.dropoffLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-bold text-lg text-green-600">
                          {car.currency} {car.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Services */}
      {proposal.additionalServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Services ({proposal.additionalServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.additionalServices.map((service) => {
                const destinationData = getDestination(service.destinationId);
                return (
                  <div key={service.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Destination</p>
                        <p className="font-semibold">{destinationData?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date & Type</p>
                        <p className="font-semibold">{service.date}</p>
                        <p className="text-sm">{service.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="font-semibold">{service.description}</p>
                        <p className="text-sm">{service.numPax} PAX × {service.numDays} day(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-bold text-lg text-green-600">
                          {service.currency} {service.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Subtotal (Net Cost)</span>
              <span className="font-bold">${getGrandTotal().toFixed(2)}</span>
            </div>
            
            {proposal.overallMargin && parseFloat(proposal.overallMargin) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Margin ({proposal.overallMargin}%)</span>
                <span className="font-semibold text-blue-600">
                  +${((getGrandTotal() * parseFloat(proposal.overallMargin)) / 100).toFixed(2)}
                </span>
              </div>
            )}
            
            {proposal.commission && parseFloat(proposal.commission) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Commission ({proposal.commission}%)</span>
                <span className="font-semibold text-blue-600">
                  +${((getGrandTotal() * parseFloat(proposal.commission)) / 100).toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total Sale Price</span>
                <span className="text-3xl font-bold text-green-600">
                  ${getFinalTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Settings */}
      <Card>
        <CardHeader>
          <CardTitle>PDF Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">PDF Language</p>
              <p className="font-semibold capitalize">{proposal.pdfLanguage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Display Currency</p>
              <p className="font-semibold uppercase">{proposal.displayCurrency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={confirmDialog.handleCancel}
        title={confirmDialog.options.title}
        description={confirmDialog.options.description}
        confirmText={confirmDialog.options.confirmText}
        cancelText={confirmDialog.options.cancelText}
        variant={confirmDialog.options.variant}
        onConfirm={confirmDialog.handleConfirm}
      />
    </div>
  );
}