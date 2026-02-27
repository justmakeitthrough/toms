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
import { Plus, Trash2, Copy, Plane } from "lucide-react";

interface FlightEntry {
  id: number;
  destinationId: string;
  date: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightType: string;
  pax: number;
  currency: string;
  pricePerPax: string;
  totalPrice: number;
  marginType: "percentage" | "fixed";
  margin: string;
}

interface Props {
  entries: FlightEntry[];
  onChange: (entries: FlightEntry[]) => void;
  inputMethod: "forms" | "table";
  overallMargin: string;
  commission: string;
}

export function FlightsBuilder({ entries, onChange, inputMethod, overallMargin, commission }: Props) {
  const addEntry = () => {
    onChange([
      ...entries,
      {
        id: Date.now(),
        destinationId: "",
        date: "",
        departure: "",
        arrival: "",
        departureTime: "",
        arrivalTime: "",
        flightType: "",
        pax: 1,
        currency: "USD",
        pricePerPax: "",
        totalPrice: 0,
      },
    ]);
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const duplicateEntry = (index: number) => {
    const entry = { ...entries[index], id: Date.now() };
    onChange([...entries, entry]);
  };

  const calculateTotal = (entry: FlightEntry) => {
    return (parseFloat(entry.pricePerPax) || 0) * entry.pax;
  };

  if (inputMethod === "forms") {
    return (
      <>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="p-4 border rounded-lg space-y-4 bg-sky-50 border-sky-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Plane className="h-4 w-4 text-sky-600" />
                Flight #{index + 1}
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateEntry(index)}
                  className="text-sky-600 hover:text-sky-700 hover:bg-sky-100"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {entries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Destination *</Label>
                <Select
                  value={entry.destinationId}
                  onValueChange={(val) => updateEntry(index, "destinationId", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Istanbul">Istanbul</SelectItem>
                    <SelectItem value="Cappadocia">Cappadocia</SelectItem>
                    <SelectItem value="Antalya">Antalya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={entry.date}
                  onChange={(e) => updateEntry(index, "date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Flight Type *</Label>
                <Select
                  value={entry.flightType}
                  onValueChange={(val) => updateEntry(index, "flightType", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Domestic">Domestic</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                    <SelectItem value="Economy">Economy Class</SelectItem>
                    <SelectItem value="Business">Business Class</SelectItem>
                    <SelectItem value="First">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Departure City *</Label>
                <Input
                  placeholder="e.g., Istanbul"
                  value={entry.departure}
                  onChange={(e) => updateEntry(index, "departure", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Arrival City *</Label>
                <Input
                  placeholder="e.g., London"
                  value={entry.arrival}
                  onChange={(e) => updateEntry(index, "arrival", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Departure Time</Label>
                <Input
                  type="time"
                  value={entry.departureTime}
                  onChange={(e) => updateEntry(index, "departureTime", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Arrival Time</Label>
                <Input
                  type="time"
                  value={entry.arrivalTime}
                  onChange={(e) => updateEntry(index, "arrivalTime", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Number of Passengers (PAX) *</Label>
                <Input
                  type="number"
                  min="1"
                  value={entry.pax}
                  onChange={(e) =>
                    updateEntry(index, "pax", parseInt(e.target.value) || 1)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={entry.currency}
                  onValueChange={(val) => updateEntry(index, "currency", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="TRY">TRY</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price per Passenger *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={entry.pricePerPax}
                  onChange={(e) => updateEntry(index, "pricePerPax", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Price</Label>
                <Input
                  value={`${entry.currency} ${(calculateTotal(entry) || 0).toFixed(2)}`}
                  disabled
                  className="bg-white font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-700">Price After Margin & Commission ({(parseFloat(overallMargin) || 0) + (parseFloat(commission) || 0)}%)</Label>
                <Input
                  value={`${entry.currency} ${((calculateTotal(entry) || 0) * (1 + ((parseFloat(overallMargin) || 0) + (parseFloat(commission) || 0)) / 100)).toFixed(2)}`}
                  disabled
                  className="bg-green-50 font-bold text-green-700 border-green-300"
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={addEntry} variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Flight
        </Button>
      </>
    );
  }

  // Table View
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-sky-50 border-b">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left min-w-[120px]">Date</th>
              <th className="p-2 text-left min-w-[100px]">Departure</th>
              <th className="p-2 text-left min-w-[100px]">Arrival</th>
              <th className="p-2 text-left">Dep Time</th>
              <th className="p-2 text-left">Arr Time</th>
              <th className="p-2 text-left min-w-[100px]">Type</th>
              <th className="p-2 text-left">PAX</th>
              <th className="p-2 text-left">Cur</th>
              <th className="p-2 text-left min-w-[100px]">Price/PAX</th>
              <th className="p-2 text-left min-w-[100px]">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id} className="border-b hover:bg-sky-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <Input
                    type="date"
                    className="h-8 text-xs"
                    value={entry.date}
                    onChange={(e) => updateEntry(index, "date", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    className="h-8 text-xs"
                    placeholder="From"
                    value={entry.departure}
                    onChange={(e) => updateEntry(index, "departure", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    className="h-8 text-xs"
                    placeholder="To"
                    value={entry.arrival}
                    onChange={(e) => updateEntry(index, "arrival", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="time"
                    className="h-8 text-xs w-24"
                    value={entry.departureTime}
                    onChange={(e) => updateEntry(index, "departureTime", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="time"
                    className="h-8 text-xs w-24"
                    value={entry.arrivalTime}
                    onChange={(e) => updateEntry(index, "arrivalTime", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={entry.flightType}
                    onValueChange={(val) => updateEntry(index, "flightType", val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Domestic">Domestic</SelectItem>
                      <SelectItem value="International">Int'l</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    className="h-8 text-xs w-16"
                    value={entry.pax}
                    onChange={(e) =>
                      updateEntry(index, "pax", parseInt(e.target.value) || 1)
                    }
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={entry.currency}
                    onValueChange={(val) => updateEntry(index, "currency", val)}
                  >
                    <SelectTrigger className="h-8 text-xs w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 text-xs"
                    value={entry.pricePerPax}
                    onChange={(e) => updateEntry(index, "pricePerPax", e.target.value)}
                  />
                </td>
                <td className="p-2 font-semibold text-sky-600">
                  {calculateTotal(entry).toFixed(2)}
                </td>
                <td className="p-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => duplicateEntry(index)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {entries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-600"
                        onClick={() => removeEntry(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={addEntry} variant="outline" className="gap-2">
        <Plus className="h-4 w-4" />
        Add Row
      </Button>
    </div>
  );
}