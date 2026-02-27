import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Edit, Trash2, Search, MapPin, CheckSquare, Check, X, Ban } from "lucide-react";
import { useData, type Destination } from "../contexts/DataContext";
import { toast } from "sonner";
import { Pagination } from "../components/ui/pagination";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { useConfirm } from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export function DestinationsPage() {
  const { destinations, addDestination, updateDestination, deleteDestination } = useData();
  const { confirm } = useConfirm();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    country: "",
    description: "",
    isActive: true,
  });

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (destination?: Destination) => {
    if (destination) {
      setEditingDestination(destination);
      setFormData({
        code: destination.code,
        name: destination.name,
        country: destination.country,
        description: destination.description,
        isActive: destination.isActive,
      });
    } else {
      setEditingDestination(null);
      setFormData({
        code: "",
        name: "",
        country: "",
        description: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDestination(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingDestination) {
      updateDestination(editingDestination.id, formData);
      toast.success("Destination updated successfully");
    } else {
      const newDestination: Destination = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addDestination(newDestination);
      toast.success("Destination created successfully");
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm("Are you sure you want to delete this destination?");
    if (confirmed) {
      deleteDestination(id);
      toast.success("Destination deleted successfully");
    }
  };

  const handleBulkSetInactive = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item");
      return;
    }
    
    const confirmed = await confirm(`Are you sure you want to set ${selectedItems.size} destination(s) to inactive?`);
    if (confirmed) {
      selectedItems.forEach(id => {
        const dest = destinations.find(d => d.id === id);
        if (dest) {
          updateDestination(id, { ...dest, isActive: false });
        }
      });
      toast.success(`${selectedItems.size} destination(s) set to inactive`);
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item");
      return;
    }
    
    const confirmed = await confirm(`Are you sure you want to delete ${selectedItems.size} destination(s)?`);
    if (confirmed) {
      selectedItems.forEach(id => deleteDestination(id));
      toast.success(`${selectedItems.size} destination(s) deleted successfully`);
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedDestinations.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(paginatedDestinations.map(dest => dest.id));
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

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Master Data", href: "/master-data" },
          { label: "Destinations" },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-600 mt-1">Manage destination master data</p>
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
            Add Destination
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, code, or country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Destinations ({filteredDestinations.length})</CardTitle>
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
              <Badge variant="secondary">{filteredDestinations.length} total</Badge>
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
                      checked={selectedItems.size === paginatedDestinations.length && paginatedDestinations.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDestinations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No destinations found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDestinations.map((destination) => (
                  <TableRow key={destination.id} className="hover:bg-gray-50">
                    {bulkMode && (
                      <TableCell>
                        <Checkbox
                          id={`select-${destination.id}`}
                          checked={selectedItems.has(destination.id)}
                          onCheckedChange={() => handleSelectItem(destination.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-mono font-semibold">
                      {destination.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{destination.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{destination.country}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {destination.description}
                    </TableCell>
                    <TableCell>
                      {destination.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(destination.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(destination)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(destination.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredDestinations.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDestination ? "Edit Destination" : "Add New Destination"}
            </DialogTitle>
            <DialogDescription>
              {editingDestination ? "Update destination information below." : "Enter the details for the new destination."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="e.g., IST"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    maxLength={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Istanbul"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  placeholder="e.g., Turkey"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the destination"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
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
                  Active destination
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingDestination ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}