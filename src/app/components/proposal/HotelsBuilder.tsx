import { Hotel, Copy, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { HotelEntry } from "../../contexts/DataContext";
import { useData } from "../../contexts/DataContext";

interface Props {
  entries: HotelEntry[];
  onChange: (entries: HotelEntry[]) => void;
  inputMethod: "forms" | "table";
  overallMargin: string;
  commission: string;
}

export function HotelsBuilder({ entries, onChange, inputMethod, overallMargin, commission }: Props) {
  const { destinations, hotels: masterHotels, getHotelsByDestination, getHotel } = useData();

  const calculateNights = (checkin: string, checkout: string) => {
    if (!checkin || !checkout) return "0";
    const diffTime = Math.abs(new Date(checkout).getTime() - new Date(checkin).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };

  const addHotel = () => {
    onChange([
      ...entries,
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
        currency: "",
        pricePerNight: "",
        totalPrice: 0,
      },
    ]);
  };

  const duplicateHotel = (index: number) => {
    const hotel = entries[index];
    onChange([...entries, { ...hotel, id: Date.now() }]);
  };

  const removeHotel = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const updateHotel = (index: number, field: keyof HotelEntry, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate nights
    if (field === "checkin" || field === "checkout") {
      const nights = calculateNights(updated[index].checkin, updated[index].checkout);
      updated[index].nights = parseInt(nights) || 0;
    }

    // Clear dependent fields when destination changes
    if (field === "destinationId") {
      updated[index].hotelId = "";
      updated[index].roomType = "";
      updated[index].boardType = "";
      updated[index].currency = "";
    }

    // Clear dependent fields when hotel changes
    if (field === "hotelId") {
      updated[index].roomType = "";
      updated[index].boardType = "";
      updated[index].currency = "";
    }

    // Auto-calculate total price
    if (field === "pricePerNight" || field === "numRooms" || field === "nights") {
      const nights = updated[index].nights || 0;
      const rooms = updated[index].numRooms || 1;
      const price = parseFloat(updated[index].pricePerNight) || 0;
      updated[index].totalPrice = nights * rooms * price;
    }

    onChange(updated);
  };

  // Filter destinations based on selected ones
  const availableDestinations = destinations.filter(d => 
    d.isActive
  );

  // Get hotels for specific destination
  const getHotelsForDestination = (destinationId: string) => {
    return masterHotels.filter(h => h.destinationId === destinationId && h.isActive);
  };

  // Get selected hotel data
  const getSelectedHotel = (hotelId: string) => {
    return masterHotels.find(h => h.id === hotelId);
  };

  // Forms View
  if (inputMethod === "forms") {
    return (
      <div className="space-y-4">
        {entries.map((hotel, index) => {
          const selectedHotel = getSelectedHotel(hotel.hotelId);
          const availableHotels = hotel.destinationId ? getHotelsForDestination(hotel.destinationId) : [];

          return (
            <div key={hotel.id} className="p-4 border rounded-lg space-y-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-blue-600" />
                  Hotel Entry #{index + 1}
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateHotel(index)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {entries.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHotel(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Destination */}
                <div className="space-y-2">
                  <Label>Destination *</Label>
                  <Select
                    value={hotel.destinationId}
                    onValueChange={(val) => updateHotel(index, "destinationId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDestinations.length === 0 ? (
                        <SelectItem value="_none" disabled>
                          No destinations selected in basic info
                        </SelectItem>
                      ) : (
                        availableDestinations.map((dest) => (
                          <SelectItem key={dest.id} value={dest.id}>
                            {dest.name} ({dest.country})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hotel */}
                <div className="space-y-2">
                  <Label>Hotel *</Label>
                  <Select
                    value={hotel.hotelId}
                    onValueChange={(val) => updateHotel(index, "hotelId", val)}
                    disabled={!hotel.destinationId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHotels.length === 0 ? (
                        <SelectItem value="_none" disabled>
                          No hotels available
                        </SelectItem>
                      ) : (
                        availableHotels.map((h) => (
                          <SelectItem key={h.id} value={h.id}>
                            {h.name} ({h.starRating}⭐)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Check-in Date */}
                <div className="space-y-2">
                  <Label>Check-in Date *</Label>
                  <Input
                    type="date"
                    value={hotel.checkin}
                    onChange={(e) => updateHotel(index, "checkin", e.target.value)}
                  />
                </div>

                {/* Check-out Date */}
                <div className="space-y-2">
                  <Label>Check-out Date *</Label>
                  <Input
                    type="date"
                    value={hotel.checkout}
                    onChange={(e) => updateHotel(index, "checkout", e.target.value)}
                  />
                </div>

                {/* Nights (Auto-calculated) */}
                <div className="space-y-2">
                  <Label>Nights</Label>
                  <Input
                    value={hotel.nights}
                    disabled
                    className="bg-white font-semibold"
                  />
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <Label>Room Type *</Label>
                  <Select
                    value={hotel.roomType}
                    onValueChange={(val) => updateHotel(index, "roomType", val)}
                    disabled={!selectedHotel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {!selectedHotel || !selectedHotel.roomTypes?.length ? (
                        <SelectItem value="_none" disabled>
                          No room types available
                        </SelectItem>
                      ) : (
                        selectedHotel.roomTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Board Type */}
                <div className="space-y-2">
                  <Label>Board Type *</Label>
                  <Select
                    value={hotel.boardType}
                    onValueChange={(val) => updateHotel(index, "boardType", val)}
                    disabled={!selectedHotel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board type" />
                    </SelectTrigger>
                    <SelectContent>
                      {!selectedHotel || !selectedHotel.boardTypes?.length ? (
                        <SelectItem value="_none" disabled>
                          No board types available
                        </SelectItem>
                      ) : (
                        selectedHotel.boardTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Rooms */}
                <div className="space-y-2">
                  <Label>Number of Rooms *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={hotel.numRooms}
                    onChange={(e) => updateHotel(index, "numRooms", parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label>Currency *</Label>
                  <Select
                    value={hotel.currency}
                    onValueChange={(val) => updateHotel(index, "currency", val)}
                    disabled={!selectedHotel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {!selectedHotel || !selectedHotel.currencies?.length ? (
                        <SelectItem value="_none" disabled>
                          No currencies available
                        </SelectItem>
                      ) : (
                        selectedHotel.currencies.map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Per Night */}
                <div className="space-y-2">
                  <Label>Price Per Night *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={hotel.pricePerNight}
                    onChange={(e) => updateHotel(index, "pricePerNight", e.target.value)}
                  />
                </div>

                {/* Total Price (Auto-calculated) */}
                <div className="space-y-2">
                  <Label>Total Price</Label>
                  <Input
                    value={`${hotel.currency || 'USD'} ${hotel.totalPrice.toFixed(2)}`}
                    disabled
                    className="bg-white font-semibold"
                  />
                </div>

                {/* Price After Margin (Read-only, calculated) */}
                <div className="space-y-2">
                  <Label className="text-green-700">Price After Margin & Commission ({(parseFloat(overallMargin) || 0) + (parseFloat(commission) || 0)}%)</Label>
                  <Input
                    value={`${hotel.currency || 'USD'} ${(hotel.totalPrice * (1 + ((parseFloat(overallMargin) || 0) + (parseFloat(commission) || 0)) / 100)).toFixed(2)}`}
                    disabled
                    className="bg-green-50 font-bold text-green-700 border-green-300"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <Button onClick={addHotel} variant="outline" className="w-full gap-2">
          <Hotel className="h-4 w-4" />
          Add Hotel
        </Button>
      </div>
    );
  }

  // Table View
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 border-b">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left min-w-[120px]">Dest</th>
              <th className="p-2 text-left min-w-[150px]">Hotel</th>
              <th className="p-2 text-left min-w-[120px]">Check-in</th>
              <th className="p-2 text-left min-w-[120px]">Check-out</th>
              <th className="p-2 text-left">Nights</th>
              <th className="p-2 text-left min-w-[120px]">Room Type</th>
              <th className="p-2 text-left min-w-[120px]">Board</th>
              <th className="p-2 text-left">Rooms</th>
              <th className="p-2 text-left">Cur</th>
              <th className="p-2 text-left min-w-[100px]">Price/Nt</th>
              <th className="p-2 text-left min-w-[100px]">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((hotel, index) => {
              const selectedHotel = getSelectedHotel(hotel.hotelId);
              const availableHotels = hotel.destinationId ? getHotelsForDestination(hotel.destinationId) : [];

              return (
                <tr key={hotel.id} className="border-b hover:bg-blue-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <Select
                      value={hotel.destinationId}
                      onValueChange={(val) => updateHotel(index, "destinationId", val)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDestinations.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Select
                      value={hotel.hotelId}
                      onValueChange={(val) => updateHotel(index, "hotelId", val)}
                      disabled={!hotel.destinationId}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableHotels.map(h => (
                          <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="date"
                      className="h-8 text-xs"
                      value={hotel.checkin}
                      onChange={(e) => updateHotel(index, "checkin", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="date"
                      className="h-8 text-xs"
                      value={hotel.checkout}
                      onChange={(e) => updateHotel(index, "checkout", e.target.value)}
                    />
                  </td>
                  <td className="p-2 font-semibold">{hotel.nights}</td>
                  <td className="p-2">
                    <Select
                      value={hotel.roomType}
                      onValueChange={(val) => updateHotel(index, "roomType", val)}
                      disabled={!selectedHotel}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedHotel?.roomTypes?.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Select
                      value={hotel.boardType}
                      onValueChange={(val) => updateHotel(index, "boardType", val)}
                      disabled={!selectedHotel}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedHotel?.boardTypes?.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      className="h-8 text-xs w-16"
                      value={hotel.numRooms}
                      onChange={(e) => updateHotel(index, "numRooms", parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td className="p-2">
                    <Select
                      value={hotel.currency}
                      onValueChange={(val) => updateHotel(index, "currency", val)}
                      disabled={!selectedHotel}
                    >
                      <SelectTrigger className="h-8 text-xs w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedHotel?.currencies?.map(curr => (
                          <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      step="0.01"
                      className="h-8 text-xs"
                      value={hotel.pricePerNight}
                      onChange={(e) => updateHotel(index, "pricePerNight", e.target.value)}
                    />
                  </td>
                  <td className="p-2 font-semibold text-blue-600">
                    {hotel.totalPrice.toFixed(2)}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-600"
                        onClick={() => duplicateHotel(index)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {entries.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600"
                          onClick={() => removeHotel(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Button onClick={addHotel} variant="outline" className="w-full gap-2">
        <Hotel className="h-4 w-4" />
        Add Hotel
      </Button>
    </div>
  );
}