import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Plus, Search, Eye, Trash2, Copy, CheckSquare, X, Check, Ban } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { toast } from "sonner";
import { Pagination } from "../components/ui/pagination";
import { Checkbox } from "../components/ui/checkbox";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { useConfirm } from "../hooks/useConfirm";

const ITEMS_PER_PAGE = 10;

export function ProposalsListPage() {
  const navigate = useNavigate();
  const { proposals, deleteProposal, addProposal, destinations, agencies, users, updateProposal, sources, getSource } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedProposals, setSelectedProposals] = useState<Set<string>>(new Set());
  const confirmDialog = useConfirm();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case "CONFIRMED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDuplicate = (proposal: any) => {
    const newProposal = {
      ...proposal,
      id: `${Date.now()}`,
      reference: `TOMS-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "NEW" as const,
      createdAt: new Date().toISOString(),
    };
    addProposal(newProposal);
    toast.success("Proposal duplicated successfully");
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog.confirm({
      title: "Delete Proposal",
      description: "Are you sure you want to delete this proposal? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (confirmed) {
      deleteProposal(id);
      toast.success("Proposal deleted successfully");
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await confirmDialog.confirm({
      title: "Delete Multiple Proposals",
      description: `Are you sure you want to delete ${selectedProposals.size} selected proposal(s)? This action cannot be undone.`,
      confirmText: "Delete All",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (confirmed) {
      selectedProposals.forEach(id => deleteProposal(id));
      toast.success(`${selectedProposals.size} proposal(s) deleted successfully`);
      setSelectedProposals(new Set());
    }
  };

  const handleBulkCancel = async () => {
    const confirmed = await confirmDialog.confirm({
      title: "Cancel Multiple Proposals",
      description: `Are you sure you want to cancel ${selectedProposals.size} selected proposal(s)?`,
      confirmText: "Cancel Proposals",
      cancelText: "Go Back",
      variant: "destructive",
    });

    if (confirmed) {
      selectedProposals.forEach(id => {
        const proposal = proposals.find(p => p.id === id);
        if (proposal) {
          updateProposal(id, { ...proposal, status: "CANCELLED" });
        }
      });
      toast.success(`${selectedProposals.size} proposal(s) cancelled successfully`);
      setSelectedProposals(new Set());
    }
  };

  const handleBulkConfirm = async () => {
    const confirmed = await confirmDialog.confirm({
      title: "Confirm Multiple Proposals",
      description: `Are you sure you want to confirm ${selectedProposals.size} selected proposal(s)?`,
      confirmText: "Confirm All",
      cancelText: "Cancel",
      variant: "default",
    });

    if (confirmed) {
      selectedProposals.forEach(id => {
        const proposal = proposals.find(p => p.id === id);
        if (proposal) {
          updateProposal(id, { ...proposal, status: "CONFIRMED" });
        }
      });
      toast.success(`${selectedProposals.size} proposal(s) confirmed successfully`);
      setSelectedProposals(new Set());
    }
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedProposals(new Set());
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProposals(new Set(paginatedProposals.map(p => p.id)));
    } else {
      setSelectedProposals(new Set());
    }
  };

  const toggleSelectProposal = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedProposals);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProposals(newSelected);
  };

  const filteredProposals = proposals.filter((proposal) => {
    // Search across multiple destinations
    const destNames = proposal.destinationIds
      ?.map(destId => destinations.find(d => d.id === destId)?.name || "")
      .join(" ")
      .toLowerCase() || "";
    
    const matchesSearch = 
      proposal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destNames.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    const matchesSource = sourceFilter === "all" || proposal.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
          <p className="text-gray-600 mt-1">Manage customer quotations and requests</p>
        </div>
        <Button onClick={() => navigate("/proposals/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Proposal
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by reference, agency, destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.filter(s => s.isActive).map(source => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Proposals ({filteredProposals.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{filteredProposals.length} results</Badge>
              <Button
                variant={bulkMode ? "default" : "outline"}
                size="sm"
                onClick={toggleBulkMode}
                className="gap-2"
              >
                {bulkMode ? (
                  <>
                    <X className="h-4 w-4" />
                    Exit Bulk Mode
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    Enable Bulk Actions
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bulkMode && selectedProposals.size > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedProposals.size} selected</Badge>
                <span className="text-sm text-gray-600">
                  Bulk actions available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkConfirm}
                  className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300"
                  disabled={selectedProposals.size === 0}
                >
                  <Check className="h-4 w-4" />
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkCancel}
                  className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-300"
                  disabled={selectedProposals.size === 0}
                >
                  <Ban className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                  disabled={selectedProposals.size === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {bulkMode && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProposals.size === paginatedProposals.length && paginatedProposals.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                  )}
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Sales Person</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProposals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={bulkMode ? 9 : 8} className="text-center py-8 text-gray-500">
                      No proposals found. Create your first proposal!
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProposals.map((proposal) => {
                    const proposalDestinations = proposal.destinationIds
                      ?.map(destId => destinations.find(d => d.id === destId)!)
                      .filter(Boolean) || [];
                    
                    const agency = agencies.find(a => a.id === proposal.agencyId);
                    const salesPerson = users.find(u => u.id === proposal.salesPersonId);
                    
                    return (
                    <TableRow key={proposal.id} className="hover:bg-gray-50">
                      {bulkMode && (
                        <TableCell>
                          <Checkbox
                            checked={selectedProposals.has(proposal.id)}
                            onCheckedChange={(checked) => toggleSelectProposal(proposal.id, checked)}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{proposal.reference}</TableCell>
                      <TableCell>{new Date(proposal.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getSource(proposal.source)?.name || proposal.source}
                        </Badge>
                      </TableCell>
                      <TableCell>{agency?.name || "-"}</TableCell>
                      <TableCell>
                        {proposalDestinations.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {proposalDestinations.map((dest) => (
                              <Badge key={dest.id} variant="outline" className="text-xs">
                                {dest.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{salesPerson?.name || "-"}</TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell className="text-right">
                        {!bulkMode && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/proposals/${proposal.id}`)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(proposal.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )})
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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