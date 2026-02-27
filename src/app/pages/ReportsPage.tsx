import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";

const salesByEmployee = [
  { name: "John Doe", proposals: 18, confirmed: 12, sales: 45230, commission: 2261 },
  { name: "Jane Smith", proposals: 15, confirmed: 8, sales: 38450, commission: 1922 },
  { name: "Ali Hassan", proposals: 15, confirmed: 3, sales: 32770, commission: 1638 },
];

const salesByDestination = [
  { destination: "Istanbul", bookings: 15, sales: 52340, avgValue: 3489 },
  { destination: "Cappadocia", bookings: 8, sales: 38120, avgValue: 4765 },
  { destination: "Antalya", bookings: 5, sales: 25990, avgValue: 5198 },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View performance metrics and generate reports</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label>Report Period</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Input type="date" defaultValue="2026-01-01" />
                </div>
                <div className="space-y-2">
                  <Input type="date" defaultValue="2026-02-26" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select defaultValue="sales">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="performance">Performance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">$128,450</p>
              <p className="text-sm text-green-600 mt-1">+12.5% from last period</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Proposals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">48</p>
              <p className="text-sm text-gray-500 mt-1">23 confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">47.9%</p>
              <p className="text-sm text-green-600 mt-1">+5.2% improvement</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Deal Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">$2,676</p>
              <p className="text-sm text-gray-500 mt-1">Per confirmed proposal</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-center text-gray-600">
                <BarChart3 className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Bar Chart</p>
                <p className="text-sm">Monthly sales comparison</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-center text-gray-600">
                <TrendingUp className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Pie Chart</p>
                <p className="text-sm">B2B vs B2C distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance by Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-center">Proposals</TableHead>
                <TableHead className="text-center">Confirmed</TableHead>
                <TableHead className="text-center">Conversion %</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesByEmployee.map((employee) => (
                <TableRow key={employee.name}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell className="text-center">{employee.proposals}</TableCell>
                  <TableCell className="text-center">{employee.confirmed}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-green-600">
                      {((employee.confirmed / employee.proposals) * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${employee.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    ${employee.commission.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Destination Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Destination</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead className="text-center">Bookings</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Avg Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesByDestination.map((dest) => (
                <TableRow key={dest.destination}>
                  <TableCell className="font-medium">{dest.destination}</TableCell>
                  <TableCell className="text-center">{dest.bookings}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${dest.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-gray-600">
                    ${dest.avgValue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-blue-700 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">$128,450</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-blue-900">$98,500</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 mb-1">Gross Profit</p>
              <p className="text-2xl font-bold text-green-600">$29,950</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 mb-1">Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">23.3%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
