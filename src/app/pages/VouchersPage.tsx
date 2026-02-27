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
import { Search, Eye, ChevronDown, ChevronRight, Hotel, Bus, Plane, Car, Package, CheckSquare, X, Check, Ban, DollarSign, FileText, Sparkles } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { Pagination } from "../components/ui/pagination";
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";
import { generateColorfulVouchersPDF } from "../utils/pdfGenerator";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export function VouchersPage() {
  const navigate = useNavigate();
  const { proposals, vouchers, agencies, getAgency, getProposalVouchers, updateVoucher, companyInfo, hotels, destinations, getDestination, getUser, getSource, sources } = useData();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProposals, setExpandedProposals] = useState<Set<string>>(new Set());
  const [bulkModeProposals, setBulkModeProposals] = useState<Set<string>>(new Set());
  const [selectedVouchers, setSelectedVouchers] = useState<Record<string, Set<string>>>({});

  // Only show confirmed proposals
  const confirmedProposals = proposals.filter((p) => p.status === "CONFIRMED");

  const filteredProposals = confirmedProposals.filter((proposal) => {
    const matchesSearch =
      proposal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proposal.agencyId && proposal.agencyId.toLowerCase().includes(searchTerm.toLowerCase()));

    // Check if any vouchers match status filter
    const proposalVouchers = getProposalVouchers(proposal.id);
    const matchesStatus =
      statusFilter === "all" ||
      proposalVouchers.some((v) => v.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleExpanded = (proposalId: string) => {
    const newExpanded = new Set(expandedProposals);
    if (newExpanded.has(proposalId)) {
      newExpanded.delete(proposalId);
    } else {
      newExpanded.add(proposalId);
    }
    setExpandedProposals(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending Payment
          </Badge>
        );
      case "PAID":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Paid
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "hotel":
        return <Hotel className="h-4 w-4 text-blue-600" />;
      case "transportation":
        return <Bus className="h-4 w-4 text-green-600" />;
      case "flight":
        return <Plane className="h-4 w-4 text-sky-600" />;
      case "rentacar":
        return <Car className="h-4 w-4 text-orange-600" />;
      case "additional":
        return <Package className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const handleBulkAction = (proposalId: string, action: string) => {
    const selectedVoucherIdsForProposal = selectedVouchers[proposalId] || new Set();
    
    if (selectedVoucherIdsForProposal.size === 0) {
      toast.error("Please select at least one voucher.");
      return;
    }

    const selectedVouchersList = Array.from(selectedVoucherIdsForProposal).map(id => 
      vouchers.find((v) => v.id === id)
    ).filter(Boolean);

    // Validate status transitions based on rules
    let newStatus: "PAID" | "COMPLETED" | "CANCELLED" | null = null;
    let actionValid = true;
    const invalidVouchers: string[] = [];

    selectedVouchersList.forEach((voucher) => {
      if (!voucher) return;
      
      if (action === "mark_paid") {
        // Can only mark as Paid if status is PENDING_PAYMENT
        if (voucher.status !== "PENDING_PAYMENT") {
          actionValid = false;
          invalidVouchers.push(voucher.id);
        }
        newStatus = "PAID";
      } else if (action === "mark_cancelled") {
        // Can cancel from PENDING_PAYMENT or PAID (not COMPLETED)
        if (voucher.status !== "PENDING_PAYMENT" && voucher.status !== "PAID") {
          actionValid = false;
          invalidVouchers.push(voucher.id);
        }
        newStatus = "CANCELLED";
      } else if (action === "mark_completed") {
        // Can only complete from PAID status
        if (voucher.status !== "PAID") {
          actionValid = false;
          invalidVouchers.push(voucher.id);
        }
        newStatus = "COMPLETED";
      }
    });

    if (!actionValid) {
      toast.error(`Some vouchers cannot be ${action === "mark_paid" ? "marked as paid" : action === "mark_cancelled" ? "cancelled" : "completed"} from their current status. Invalid vouchers: ${invalidVouchers.join(", ")}`);
      return;
    }

    if (!newStatus) return;

    // Update all selected vouchers
    selectedVouchersList.forEach((voucher) => {
      if (voucher) {
        updateVoucher(voucher.id, { status: newStatus });
      }
    });

    toast.success(`Successfully ${action === "mark_paid" ? "marked as paid" : action === "mark_cancelled" ? "cancelled" : "completed"} ${selectedVouchersList.length} voucher(s).`);
    
    // Clear selections for this proposal
    const newSelectedVouchers = { ...selectedVouchers };
    delete newSelectedVouchers[proposalId];
    setSelectedVouchers(newSelectedVouchers);
    
    // Exit bulk mode for this proposal
    const newBulkModeProposals = new Set(bulkModeProposals);
    newBulkModeProposals.delete(proposalId);
    setBulkModeProposals(newBulkModeProposals);
  };

  const handleVoucherSelection = (proposalId: string, voucherId: string) => {
    const currentSelectedVouchers = selectedVouchers[proposalId] || new Set();
    const newSelectedVouchers = new Set(currentSelectedVouchers);
    if (newSelectedVouchers.has(voucherId)) {
      newSelectedVouchers.delete(voucherId);
    } else {
      newSelectedVouchers.add(voucherId);
    }
    setSelectedVouchers({
      ...selectedVouchers,
      [proposalId]: newSelectedVouchers,
    });
  };

  const handleProposalSelection = (proposalId: string) => {
    const proposalVouchers = getProposalVouchers(proposalId);
    const currentSelectedVouchers = selectedVouchers[proposalId] || new Set();
    const newSelectedVouchers = new Set(currentSelectedVouchers);
    if (newSelectedVouchers.size === proposalVouchers.length) {
      newSelectedVouchers.clear();
    } else {
      proposalVouchers.forEach((v) => newSelectedVouchers.add(v.id));
    }
    setSelectedVouchers({
      ...selectedVouchers,
      [proposalId]: newSelectedVouchers,
    });
  };

  const handleBulkModeToggle = (proposalId: string) => {
    const newBulkModeProposals = new Set(bulkModeProposals);
    if (newBulkModeProposals.has(proposalId)) {
      newBulkModeProposals.delete(proposalId);
    } else {
      newBulkModeProposals.add(proposalId);
    }
    setBulkModeProposals(newBulkModeProposals);
  };

  const handleGenerateColorfulPDF = (proposalId: string) => {
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) {
      toast.error("Proposal not found");
      return;
    }

    // Check if vouchers are selected in bulk mode
    const selectedVoucherIds = selectedVouchers[proposalId];
    let vouchersToGenerate;

    if (selectedVoucherIds && selectedVoucherIds.size > 0) {
      // Generate PDF for selected vouchers
      vouchersToGenerate = Array.from(selectedVoucherIds).map(id => 
        vouchers.find((v) => v.id === id)
      ).filter(Boolean);
    } else {
      // Generate PDF for all vouchers in this proposal
      vouchersToGenerate = getProposalVouchers(proposalId);
    }

    if (vouchersToGenerate.length === 0) {
      toast.error("No vouchers to generate PDF for");
      return;
    }

    const agency = getAgency(proposal.agencyId);
    const salesPerson = proposal.salesPersonId ? { name: "Sales Person", id: proposal.salesPersonId } : undefined;
    
    generateColorfulVouchersPDF(
      vouchersToGenerate,
      proposal,
      agency,
      salesPerson,
      hotels,
      destinations,
      companyInfo,
      proposal.pdfLanguage || 'english'
    );

    toast.success(`Generated colorful PDF for ${vouchersToGenerate.length} voucher(s)!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('vouchers.confirmedProposalsVouchers')}</h1>
        <p className="text-gray-600 mt-1">
          {t('vouchers.viewConfirmedProposals')}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('vouchers.searchAndFilter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('vouchers.searchByProposal')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('vouchers.filterByVoucherStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('vouchers.allVoucherStatuses')}</SelectItem>
                <SelectItem value="PENDING_PAYMENT">{t('vouchers.statuses.PENDING_PAYMENT')}</SelectItem>
                <SelectItem value="PAID">{t('vouchers.statuses.PAID')}</SelectItem>
                <SelectItem value="COMPLETED">{t('vouchers.statuses.COMPLETED')}</SelectItem>
                <SelectItem value="CANCELLED">{t('vouchers.statuses.CANCELLED')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Table with Expandable Vouchers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('proposals.statuses.CONFIRMED')} {t('proposals.title')} ({filteredProposals.length})</CardTitle>
            <Badge variant="secondary">{vouchers.length} {t('vouchers.totalVouchers')}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paginatedProposals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-semibold mb-2">{t('vouchers.noConfirmedProposals')}</p>
                <p>{t('vouchers.confirmedProposalsAppear')}</p>
              </div>
            ) : (
              paginatedProposals.map((proposal) => {
                const proposalVouchers = getProposalVouchers(proposal.id);
                const isExpanded = expandedProposals.has(proposal.id);
                const agency = getAgency(proposal.agencyId);

                return (
                  <div key={proposal.id} className="border rounded-lg overflow-hidden">
                    {/* Proposal Row */}
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => toggleExpanded(proposal.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(proposal.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {proposal.reference}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Source</p>
                            <Badge variant="secondary">{proposal.source}</Badge>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Agency</p>
                            <p className="font-medium">
                              {agency ? agency.name : proposal.agencyId || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Destinations</p>
                            <p className="font-medium">
                              {proposal.destinationIds.map(id => getDestination(id)?.name).filter(Boolean).join(', ') || "-"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-600">Vouchers</p>
                            <Badge className="bg-blue-600">
                              {proposalVouchers.length} voucher
                              {proposalVouchers.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Bulk Edit Toggle - Redesigned */}
                        <Button
                          variant={bulkModeProposals.has(proposal.id) ? "default" : "ghost"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBulkModeToggle(proposal.id);
                            // Auto-expand when bulk mode is enabled
                            if (!bulkModeProposals.has(proposal.id)) {
                              const newExpanded = new Set(expandedProposals);
                              newExpanded.add(proposal.id);
                              setExpandedProposals(newExpanded);
                            }
                          }}
                          className={bulkModeProposals.has(proposal.id) 
                            ? "gap-1.5 bg-blue-600 hover:bg-blue-700 px-3" 
                            : "gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3"}
                          title={bulkModeProposals.has(proposal.id) ? "Exit bulk mode" : "Enable bulk actions"}
                        >
                          {bulkModeProposals.has(proposal.id) ? (
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
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/proposals/${proposal.id}`);
                          }}
                          className="h-8 w-8"
                          title="View proposal details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Vouchers Section */}
                    {isExpanded && (
                      <div className="border-t bg-white">
                        {proposalVouchers.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <p>No vouchers generated for this proposal yet</p>
                          </div>
                        ) : (
                          <>
                            {bulkModeProposals.has(proposal.id) && (selectedVouchers[proposal.id]?.size || 0) > 0 && (
                              <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {selectedVouchers[proposal.id]?.size || 0} selected
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    Choose bulk action
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction(proposal.id, "mark_paid")}
                                    className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300"
                                  >
                                    <DollarSign className="h-4 w-4" />
                                    Mark Paid
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction(proposal.id, "mark_cancelled")}
                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                                  >
                                    <Ban className="h-4 w-4" />
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction(proposal.id, "mark_completed")}
                                    className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-300"
                                  >
                                    <Check className="h-4 w-4" />
                                    Complete
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateColorfulPDF(proposal.id)}
                                    className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-300"
                                  >
                                    <FileText className="h-4 w-4" />
                                    Generate PDF
                                  </Button>
                                </div>
                              </div>
                            )}
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  {bulkModeProposals.has(proposal.id) && (
                                    <TableHead className="w-12">
                                      <Checkbox
                                        checked={(selectedVouchers[proposal.id]?.size || 0) === proposalVouchers.length && proposalVouchers.length > 0}
                                        onCheckedChange={() => handleProposalSelection(proposal.id)}
                                      />
                                    </TableHead>
                                  )}
                                  <TableHead>Voucher ID</TableHead>
                                  <TableHead>Service Type</TableHead>
                                  <TableHead>Source</TableHead>
                                  <TableHead>Guests</TableHead>
                                  <TableHead>Pax</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {proposalVouchers.map((voucher) => (
                                  <TableRow key={voucher.id} className="hover:bg-gray-50">
                                    {bulkModeProposals.has(proposal.id) && (
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedVouchers[proposal.id]?.has(voucher.id) || false}
                                          onCheckedChange={() => handleVoucherSelection(proposal.id, voucher.id)}
                                        />
                                      </TableCell>
                                    )}
                                    <TableCell className="font-mono text-sm">
                                      {voucher.id}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {getServiceIcon(voucher.serviceType)}
                                        <span className="capitalize">
                                          {voucher.serviceType}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="secondary">{getSource(voucher.source)?.name || voucher.source}</Badge>
                                    </TableCell>
                                    <TableCell>{voucher.guests.length || 0}</TableCell>
                                    <TableCell>
                                      <div className="text-sm">
                                        <span className="font-medium">
                                          {voucher.totalPax}
                                        </span>
                                        <span className="text-gray-500 ml-1">
                                          ({voucher.adults}A {voucher.children}C)
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                                    <TableCell className="text-right">
                                      {!bulkModeProposals.has(proposal.id) && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => navigate(`/vouchers/${voucher.id}`)}
                                          className="gap-2"
                                        >
                                          <Eye className="h-4 w-4" />
                                          View
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredProposals.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}