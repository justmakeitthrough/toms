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
import { Plus, Trash2, Copy, Car } from "lucide-react";

interface RentACarEntry {
  id: number;
  destinationId: string;
  date: string;
  carType: string;
  pickupLocation: string;
  dropoffLocation: string;
  numDays: number;
  currency: string;
  pricePerDay: string;
  totalPrice: number;
}

interface Props {
  entries: RentACarEntry[];
  onChange: (entries: RentACarEntry[]) => void;
  inputMethod: "forms" | "table";
  overallMargin: string;
  commission: string;
}

export function RentACarBuilder({ entries, onChange, inputMethod, overallMargin, commission }: Props) {
  const addEntry = () => {
    onChange([
      ...entries,
      {
        id: Date.now(),
        destinationId: "",
        date: "",
        carType: "",
        pickupLocation: "",
        dropoffLocation: "",
        numDays: 1,
        currency: "USD",
        pricePerDay: "",
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

  const calculateTotal = (entry: RentACarEntry) => {
    return (parseFloat(entry.pricePerDay) || 0) * entry.numDays;
  };

  if (inputMethod === "forms") {
    return (
      <>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="p-4 border rounded-lg space-y-4 bg-orange-50 border-orange-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Car className="h-4 w-4 text-orange-600" />
                Car Rental #{index + 1}
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateEntry(index)}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
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
                    <SelectItem value="Bursa">Bursa</SelectItem>
                    <SelectItem value="Antalya">Antalya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pickup Date *</Label>
                <Input
                  type="date"
                  value={entry.date}
                  onChange={(e) => updateEntry(index, "date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Car Type *</Label>
                <Select
                  value={entry.carType}
                  onValueChange={(val) => updateEntry(index, "carType", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Compact">Compact</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="Van">Van / Minivan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pickup Location *</Label>
                <Input
                  placeholder="e.g., Istanbul Airport"
                  value={entry.pickupLocation}
                  onChange={(e) => updateEntry(index, "pickupLocation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Drop-off Location *</Label>
                <Input
                  placeholder="e.g., Antalya Airport"
                  value={entry.dropoffLocation}
                  onChange={(e) => updateEntry(index, "dropoffLocation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Number of Days *</Label>
                <Input
                  type="number"
                  min="1"
                  value={entry.numDays}
                  onChange={(e) =>
                    updateEntry(index, "numDays", parseInt(e.target.value) || 1)
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price per Day *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={entry.pricePerDay}
                  onChange={(e) => updateEntry(index, "pricePerDay", e.target.value)}
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
          Add Car Rental
        </Button>
      </>
    );
  }

  // Table View
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 border-b">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left min-w-[120px]">Destination</th>
              <th className="p-2 text-left min-w-[120px]">Pickup Date</th>
              <th className="p-2 text-left min-w-[100px]">Car Type</th>
              <th className="p-2 text-left min-w-[120px]">Pickup Location</th>
              <th className="p-2 text-left min-w-[120px]">Drop-off</th>
              <th className="p-2 text-left">Days</th>
              <th className="p-2 text-left">Cur</th>
              <th className="p-2 text-left min-w-[100px]">Price/Day</th>
              <th className="p-2 text-left min-w-[100px]">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id} className="border-b hover:bg-orange-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <Select
                    value={entry.destinationId}
                    onValueChange={(val) => updateEntry(index, "destinationId", val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Istanbul">Istanbul</SelectItem>
                      <SelectItem value="Antalya">Antalya</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    type="date"
                    className="h-8 text-xs"
                    value={entry.date}
                    onChange={(e) => updateEntry(index, "date", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={entry.carType}
                    onValueChange={(val) => updateEntry(index, "carType", val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Economy">Economy</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    className="h-8 text-xs"
                    value={entry.pickupLocation}
                    onChange={(e) => updateEntry(index, "pickupLocation", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    className="h-8 text-xs"
                    value={entry.dropoffLocation}
                    onChange={(e) => updateEntry(index, "dropoffLocation", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    className="h-8 text-xs w-16"
                    value={entry.numDays}
                    onChange={(e) =>
                      updateEntry(index, "numDays", parseInt(e.target.value) || 1)
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
                    value={entry.pricePerDay}
                    onChange={(e) => updateEntry(index, "pricePerDay", e.target.value)}
                  />
                </td>
                <td className="p-2 font-semibold text-orange-600">
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