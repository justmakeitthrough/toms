import { Plus, Edit, Trash2, Search, Hotel as HotelIcon, Star, X, CheckSquare, Check, Ban } from "lucide-react";
import { useData, type Hotel } from "../contexts/DataContext";
import { toast } from "sonner";
import { Pagination } from "../components/ui/pagination";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { useConfirm } from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export function HotelsPage() {
  const { hotels, destinations, addHotel, updateHotel, deleteHotel, getDestination } = useData();
  const { confirm } = useConfirm();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [formData, setFormData] = useState({
    name: "",
    destinationId: "",
    address: "",
    starRating: 5,
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    roomTypes: [] as string[],
    boardTypes: [] as string[],
    currencies: [] as string[],
    isActive: true,
  });

  // Tag input states
  const [roomTypeInput, setRoomTypeInput] = useState("");
  const [boardTypeInput, setBoardTypeInput] = useState("");
  const [currencyInput, setCurrencyInput] = useState("");

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDestination =
      destinationFilter === "all" || hotel.destinationId === destinationFilter;
    return matchesSearch && matchesDestination;
  });

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name,
        destinationId: hotel.destinationId,
        address: hotel.address,
        starRating: hotel.starRating,
        contactPerson: hotel.contactPerson,
        contactEmail: hotel.contactEmail,
        contactPhone: hotel.contactPhone,
        roomTypes: hotel.roomTypes || [],
        boardTypes: hotel.boardTypes || [],
        currencies: hotel.currencies || [],
        isActive: hotel.isActive,
      });
    } else {
      setEditingHotel(null);
      setFormData({
        name: "",
        destinationId: "",
        address: "",
        starRating: 5,
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
        roomTypes: [],
        boardTypes: [],
        currencies: [],
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingHotel(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.destinationId || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingHotel) {
      updateHotel(editingHotel.id, formData);
      toast.success("Hotel updated successfully");
    } else {
      const newHotel: Hotel = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addHotel(newHotel);
      toast.success("Hotel created successfully");
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm("Are you sure you want to delete this hotel?");
    if (confirmed) {
      deleteHotel(id);
      toast.success("Hotel deleted successfully");
    }
  };

  const handleBulkSetInactive = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item");
      return;
    }
    
    const confirmed = await confirm(`Are you sure you want to set ${selectedItems.size} hotel(s) to inactive?`);
    if (confirmed) {
      selectedItems.forEach(id => {
        const hotel = hotels.find(h => h.id === id);
        if (hotel) {
          updateHotel(id, { ...hotel, isActive: false });
        }
      });
      toast.success(`${selectedItems.size} hotel(s) set to inactive`);
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item");
      return;
    }
    
    const confirmed = await confirm(`Are you sure you want to delete ${selectedItems.size} hotel(s)?`);
    if (confirmed) {
      selectedItems.forEach(id => deleteHotel(id));
      toast.success(`${selectedItems.size} hotel(s) deleted successfully`);
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedHotels.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(paginatedHotels.map(hotel => hotel.id));
      setSelectedItems(allIds);
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Master Data", href: "/master-data" },
          { label: "Hotels" },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>
          <p className="text-gray-600 mt-1">Manage hotel master data</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bulk Mode Toggle */}
          <Button
            variant={bulkMode ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedItems(new Set());
            }}
            className={bulkMode 
              ? "gap-1.5 bg-blue-600 hover:bg-blue-700 px-3" 
              : "gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3"}
            title={bulkMode ? "Exit bulk mode" : "Enable bulk actions"}
          >
            {bulkMode ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Bulk Active</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Bulk</span>
              </>
            )}
          </Button>
          
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Hotel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, address, contact..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={destinationFilter}
              onValueChange={(val) => {
                setDestinationFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {destinations.map((dest) => (
                  <SelectItem key={dest.id} value={dest.id}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Hotels ({filteredHotels.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={itemsPerPage.toString()} onValueChange={(val) => {
                setItemsPerPage(parseInt(val));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">{filteredHotels.length} total</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions Bar */}
          {bulkMode && selectedItems.size > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedItems.size} selected
                </Badge>
                <span className="text-sm text-gray-600">
                  Choose bulk action
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkSetInactive}
                  className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-300"
                >
                  <Ban className="h-4 w-4" />
                  Set Inactive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                {bulkMode && (
                  <TableHead>
                    <Checkbox
                      id="selectAll"
                      checked={selectedItems.size === paginatedHotels.length && paginatedHotels.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Hotel Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No hotels found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedHotels.map((hotel) => {
                  const destination = getDestination(hotel.destinationId);
                  return (
                    <TableRow key={hotel.id} className="hover:bg-gray-50">
                      {bulkMode && (
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.has(hotel.id)}
                            onCheckedChange={() => handleSelectItem(hotel.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <HotelIcon className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{hotel.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {destination ? (
                          <Badge variant="secondary">{destination.name}</Badge>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(hotel.starRating)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {hotel.address}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{hotel.contactPerson}</p>
                          <p className="text-gray-500">{hotel.contactPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {hotel.isActive ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(hotel)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(hotel.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredHotels.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHotel ? "Edit Hotel" : "Add New Hotel"}
            </DialogTitle>
            <DialogDescription>
              {editingHotel ? "Update hotel information below." : "Enter the details for the new hotel."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Hotel Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Hilton Istanbul Bosphorus"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destinationId">
                    Destination <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.destinationId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, destinationId: val })
                    }
                  >
                    <SelectTrigger id="destinationId">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations
                        .filter((d) => d.isActive)
                        .map((dest) => (
                          <SelectItem key={dest.id} value={dest.id}>
                            {dest.name} ({dest.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="starRating">Star Rating</Label>
                  <Select
                    value={formData.starRating.toString()}
                    onValueChange={(val) =>
                      setFormData({ ...formData, starRating: parseInt(val) })
                    }
                  >
                    <SelectTrigger id="starRating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="e.g., Cumhuriyet Cad. No:50"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="e.g., Ali Yılmaz"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="e.g., contact@hotel.com"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="e.g., +90 212 123 4567"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active hotel
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Room Types</Label>
                <div className="flex items-center">
                  <Input
                    id="roomTypeInput"
                    placeholder="Add room type"
                    value={roomTypeInput}
                    onChange={(e) => setRoomTypeInput(e.target.value)}
                    className="mr-2"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (roomTypeInput.trim()) {
                        setFormData({
                          ...formData,
                          roomTypes: [...formData.roomTypes, roomTypeInput.trim()],
                        });
                        setRoomTypeInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  {formData.roomTypes.map((roomType, index) => (
                    <Badge
                      key={index}
                      className="mr-2"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          roomTypes: formData.roomTypes.filter(
                            (rt) => rt !== roomType
                          ),
                        })
                      }
                    >
                      {roomType} <X className="h-4 w-4" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Board Types</Label>
                <div className="flex items-center">
                  <Input
                    id="boardTypeInput"
                    placeholder="Add board type"
                    value={boardTypeInput}
                    onChange={(e) => setBoardTypeInput(e.target.value)}
                    className="mr-2"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (boardTypeInput.trim()) {
                        setFormData({
                          ...formData,
                          boardTypes: [...formData.boardTypes, boardTypeInput.trim()],
                        });
                        setBoardTypeInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  {formData.boardTypes.map((boardType, index) => (
                    <Badge
                      key={index}
                      className="mr-2"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          boardTypes: formData.boardTypes.filter(
                            (bt) => bt !== boardType
                          ),
                        })
                      }
                    >
                      {boardType} <X className="h-4 w-4" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Currencies</Label>
                <div className="flex items-center">
                  <Input
                    id="currencyInput"
                    placeholder="Add currency"
                    value={currencyInput}
                    onChange={(e) => setCurrencyInput(e.target.value)}
                    className="mr-2"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (currencyInput.trim()) {
                        setFormData({
                          ...formData,
                          currencies: [...formData.currencies, currencyInput.trim()],
                        });
                        setCurrencyInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  {formData.currencies.map((currency, index) => (
                    <Badge
                      key={index}
                      className="mr-2"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          currencies: formData.currencies.filter(
                            (c) => c !== currency
                          ),
                        })
                      }
                    >
                      {currency} <X className="h-4 w-4" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">{editingHotel ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}