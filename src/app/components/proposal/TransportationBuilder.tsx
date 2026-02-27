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
import { Plus, Trash2, Copy, Bus } from "lucide-react";
import { TransportationEntry } from "../../contexts/DataContext";
import { useData } from "../../contexts/DataContext";

interface Props {
  entries: TransportationEntry[];
  onChange: (entries: TransportationEntry[]) => void;
  inputMethod: "forms" | "table";
  overallMargin: string;
  commission: string;
}

export function TransportationBuilder({ entries, onChange, inputMethod, overallMargin, commission }: Props) {
  const { destinations, globalLookups } = useData();

  // Filter vehicle types from global lookups
  const vehicleTypes = globalLookups.filter(lookup => lookup.category === "vehicleTypes");
  
  // Filter destinations based on selected ones in basic information
  const availableDestinations = destinations.filter(d => 
    d.isActive
  );

  const addEntry = () => {
    onChange([
      ...entries,
      {
        id: Date.now(),
        destinationId: "",
        date: "",
        description: "",
        vehicleType: "",
        numDays: 1,
        numVehicles: 1,
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

  const calculateTotal = (entry: TransportationEntry) => {
    return (parseFloat(entry.pricePerDay) || 0) * entry.numDays * entry.numVehicles;
  };

  if (inputMethod === "forms") {
    return (
      <>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="p-4 border rounded-lg space-y-4 bg-green-50 border-green-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Bus className="h-4 w-4 text-green-600" />
                Transportation #{index + 1}
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateEntry(index)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
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
                    {availableDestinations.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
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
                <Label>Vehicle Type *</Label>
                <Select
                  value={entry.vehicleType}
                  onValueChange={(val) => updateEntry(index, "vehicleType", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(vt => (
                      <SelectItem key={vt.id} value={vt.name}>{vt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label>Description</Label>
                <Input
                  placeholder="e.g., Airport transfer, City tour, etc."
                  value={entry.description}
                  onChange={(e) => updateEntry(index, "description", e.target.value)}
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
                <Label>Number of Vehicles *</Label>
                <Input
                  type="number"
                  min="1"
                  value={entry.numVehicles}
                  onChange={(e) =>
                    updateEntry(index, "numVehicles", parseInt(e.target.value) || 1)
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
          Add Transportation
        </Button>
      </>
    );
  }

  // Table View
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-green-50 border-b">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left min-w-[120px]">Destination</th>
              <th className="p-2 text-left min-w-[120px]">Date</th>
              <th className="p-2 text-left min-w-[120px]">Vehicle</th>
              <th className="p-2 text-left min-w-[150px]">Description</th>
              <th className="p-2 text-left">Days</th>
              <th className="p-2 text-left">Vehicles</th>
              <th className="p-2 text-left">Cur</th>
              <th className="p-2 text-left min-w-[100px]">Price/Day</th>
              <th className="p-2 text-left min-w-[100px]">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id} className="border-b hover:bg-green-50">
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
                      {availableDestinations.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
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
                    value={entry.vehicleType}
                    onValueChange={(val) => updateEntry(index, "vehicleType", val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(vt => (
                        <SelectItem key={vt.id} value={vt.name}>{vt.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    className="h-8 text-xs"
                    value={entry.description}
                    onChange={(e) => updateEntry(index, "description", e.target.value)}
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
                  <Input
                    type="number"
                    className="h-8 text-xs w-16"
                    value={entry.numVehicles}
                    onChange={(e) =>
                      updateEntry(index, "numVehicles", parseInt(e.target.value) || 1)
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
                <td className="p-2 font-semibold text-green-600">
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