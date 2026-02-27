import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export function DashboardPage() {
  const navigate = useNavigate();
  const { proposals, vouchers } = useData();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Calculate statistics
  const totalProposals = proposals.length;
  const newProposals = proposals.filter(p => p.status === "NEW").length;
  const confirmedProposals = proposals.filter(p => p.status === "CONFIRMED").length;
  const totalVouchers = vouchers.length;

  // Calculate total revenue
  const calculateProposalTotal = (proposal: any) => {
    const calculateNights = (checkin: string, checkout: string) => {
      if (!checkin || !checkout) return 0;
      const start = new Date(checkin);
      const end = new Date(checkout);
      const diff = end.getTime() - start.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const hotelTotal = proposal.hotels.reduce((sum: number, h: any) => {
      const nights = calculateNights(h.checkin, h.checkout);
      return sum + nights * (parseFloat(h.pricePerNight) || 0) * h.numRooms;
    }, 0);

    const transportTotal = proposal.transportation.reduce((sum: number, t: any) =>
      sum + (parseFloat(t.pricePerDay) || 0) * t.numDays, 0);

    const flightTotal = proposal.flights.reduce((sum: number, f: any) =>
      sum + (parseFloat(f.pricePerPax) || 0) * f.pax, 0);

    const carTotal = proposal.rentACar.reduce((sum: number, c: any) =>
      sum + (parseFloat(c.pricePerDay) || 0) * c.numDays, 0);

    const additionalTotal = proposal.additionalServices.reduce((sum: number, a: any) =>
      sum + (parseFloat(a.pricePerDay) || 0) * a.numDays, 0);

    const subtotal = hotelTotal + transportTotal + flightTotal + carTotal + additionalTotal;
    const marginAmount = (subtotal * (parseFloat(proposal.overallMargin) || 0)) / 100;
    const commissionAmount = (subtotal * (parseFloat(proposal.commission) || 0)) / 100;

    return subtotal + marginAmount + commissionAmount;
  };

  const totalRevenue = proposals
    .filter(p => p.status === "CONFIRMED")
    .reduce((sum, p) => sum + calculateProposalTotal(p), 0);

  const recentProposals = [...proposals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.welcomeBack', { name: user?.name || 'User' })}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('dashboard.todayOverview')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button onClick={() => navigate("/proposals/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('dashboard.newProposal')}
        </Button>
        <Button variant="outline" onClick={() => navigate("/proposals")}>
          {t('dashboard.viewAllProposals')}
        </Button>
        <Button variant="outline" onClick={() => navigate("/vouchers")}>
          {t('dashboard.viewVouchers')}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            if (confirm("⚠️ This will clear all data and reset to initial mockup data. Are you sure?")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="ml-auto text-xs text-gray-500 hover:text-red-600"
        >
          🔄 Reset Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalProposals')}</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProposals}</div>
            <p className="text-xs text-gray-600 mt-1">
              {newProposals} {t('dashboard.newProposals').toLowerCase()}, {confirmedProposals} {t('dashboard.confirmedProposals').toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.newProposals')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newProposals}</div>
            <p className="text-xs text-gray-600 mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalVouchers')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVouchers}</div>
            <p className="text-xs text-gray-600 mt-1">
              From {confirmedProposals} {t('dashboard.confirmedProposals').toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(0)}</div>
            <p className="text-xs text-gray-600 mt-1">
              From confirmed bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('dashboard.recentProposals')}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/proposals")}>
                {t('dashboard.viewAllProposals')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProposals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>{t('dashboard.noProposals')}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/proposals/new")}
                    className="mt-3"
                  >
                    {t('dashboard.startCreating')}
                  </Button>
                </div>
              ) : (
                recentProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/proposals/${proposal.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{proposal.reference}</p>
                        {getStatusBadge(proposal.status)}
                      </div>
                      <p className="text-sm text-gray-600">{proposal.destination}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {proposal.agency || "Direct Client"} • {proposal.salesPerson}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ${calculateProposalTotal(proposal).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Conversion Rate</p>
                    <p className="text-sm text-gray-600">
                      {totalProposals > 0
                        ? `${((confirmedProposals / totalProposals) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {confirmedProposals}/{totalProposals}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Confirmed This Month</p>
                    <p className="text-sm text-gray-600">Proposals confirmed</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {confirmedProposals}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Awaiting Action</p>
                    <p className="text-sm text-gray-600">Pending proposals</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {newProposals}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Active Vouchers</p>
                    <p className="text-sm text-gray-600">Service bookings</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {totalVouchers}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Role</p>
              <Badge className="bg-blue-600">{user?.role}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Services</p>
              <p className="font-semibold">
                {proposals.reduce((sum, p) =>
                  sum + p.hotels.length + p.transportation.length +
                  p.flights.length + p.rentACar.length + p.additionalServices.length, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Activity</p>
              <p className="font-semibold">
                {recentProposals.length > 0
                  ? new Date(recentProposals[0].createdAt).toLocaleString()
                  : "No activity yet"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}