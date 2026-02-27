import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MapPin, Hotel, Building2, Settings, ArrowRight, List, Radio } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export function MasterDataPage() {
  const navigate = useNavigate();
  const { destinations, hotels, agencies, globalLookups, sources } = useData();

  // Calculate global lookups breakdown by category
  const vehicleTypesCount = globalLookups.filter(l => l.category === "vehicleTypes").length;
  const flightTypesCount = globalLookups.filter(l => l.category === "flightTypes").length;
  const carTypesCount = globalLookups.filter(l => l.category === "carTypes").length;
  const serviceTypesCount = globalLookups.filter(l => l.category === "serviceTypes").length;
  const totalLookupsCount = globalLookups.length;

  const masterDataSections = [
    {
      title: "Destinations",
      description: "Manage travel destinations and locations",
      icon: MapPin,
      count: destinations.length,
      color: "bg-blue-100 text-blue-600",
      route: "/master-data/destinations",
    },
    {
      title: "Hotels",
      description: "Manage hotel properties and accommodations",
      icon: Hotel,
      count: hotels.length,
      color: "bg-green-100 text-green-600",
      route: "/master-data/hotels",
    },
    {
      title: "Agencies",
      description: "Manage B2B travel agency partners",
      icon: Building2,
      count: agencies.length,
      color: "bg-purple-100 text-purple-600",
      route: "/master-data/agencies",
    },
    {
      title: "Sources/Channels",
      description: "Track B2C, B2B, and sales team sources",
      icon: Radio,
      count: sources.length,
      color: "bg-teal-100 text-teal-600",
      route: "/master-data/sources",
    },
    {
      title: "Global Lookups",
      description: "Manage service types, vehicle types, and more",
      icon: List,
      count: totalLookupsCount,
      color: "bg-orange-100 text-orange-600",
      route: "/master-data/lookups",
      breakdown: [
        { label: "Vehicle Types", count: vehicleTypesCount },
        { label: "Flight Types", count: flightTypesCount },
        { label: "Car Types", count: carTypesCount },
        { label: "Service Types", count: serviceTypesCount },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Master Data Management</h1>
        <p className="text-gray-600 mt-1">
          Manage all master data including destinations, hotels, and agencies
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {masterDataSections.map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${section.color}`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(section.route)}
                  className="hover:bg-gray-100"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{section.title}</CardTitle>
              <p className="text-sm text-gray-600 mb-3">{section.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{section.count}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(section.route)}
                >
                  Manage
                </Button>
              </div>
              {section.breakdown && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Breakdown</h4>
                  <ul className="space-y-2">
                    {section.breakdown.map(breakdownItem => (
                      <li key={breakdownItem.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{breakdownItem.label}</span>
                        <span className="text-sm font-bold">{breakdownItem.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <CardTitle>About Master Data</CardTitle>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Click on each section to learn more about managing your master data
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="destinations" className="border-blue-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-900">Destinations</div>
                    <div className="text-xs text-gray-600 font-normal">Geographic locations and regions</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-blue-800 mb-3">
                    Define cities and regions where you operate tourism services. Each destination serves as a geographic anchor for your operations.
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1.5 ml-4 list-disc">
                    <li>Link multiple hotels to each destination</li>
                    <li>Track services available per location</li>
                    <li>Organize proposals by geographic region</li>
                    <li>Filter and search by destination across the system</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hotels" className="border-green-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <Hotel className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-900">Hotels</div>
                    <div className="text-xs text-gray-600 font-normal">Accommodation properties database</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-green-800 mb-3">
                    Maintain a comprehensive database of hotel properties and accommodation providers.
                  </p>
                  <ul className="text-sm text-green-700 space-y-1.5 ml-4 list-disc">
                    <li>Each hotel must be linked to a destination</li>
                    <li>Include contact details, star ratings, and addresses</li>
                    <li>Set active/inactive status for availability management</li>
                    <li>Used in proposals, vouchers, and PDF generation</li>
                    <li>Track hotel relationships and service agreements</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="agencies" className="border-purple-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-purple-900">Agencies</div>
                    <div className="text-xs text-gray-600 font-normal">B2B travel agency partners</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-purple-800 mb-3">
                    Manage your B2B travel agency partners and client relationships.
                  </p>
                  <ul className="text-sm text-purple-700 space-y-1.5 ml-4 list-disc">
                    <li>Track commission rates and payment terms</li>
                    <li>Store contact information and business details</li>
                    <li>Link proposals and vouchers to agencies</li>
                    <li>Monitor business relationships and performance</li>
                    <li>Generate agency-specific reports and documents</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sources" className="border-teal-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
                    <Radio className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-teal-900">Sources/Channels</div>
                    <div className="text-xs text-gray-600 font-normal">Lead sources and marketing channels</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-teal-800 mb-3">
                    Track where your business comes from - whether it's direct clients, partner agencies, or through your sales team.
                  </p>
                  <ul className="text-sm text-teal-700 space-y-1.5 ml-4 list-disc">
                    <li>Distinguish between B2C (Direct Client) and B2B (Travel Agency) bookings</li>
                    <li>Track business brought by Sales Employees and Managers</li>
                    <li>Analyze which sources generate the most revenue</li>
                    <li>Standardize source tracking across proposals and vouchers</li>
                    <li>Generate reports on business source performance</li>
                    <li>Set active/inactive status for source management</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lookups" className="border-orange-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <List className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-orange-900">Global Lookups</div>
                    <div className="text-xs text-gray-600 font-normal">System-wide reference data</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-orange-800 mb-3">
                    Centralized dropdown values and system-wide reference data for consistency.
                  </p>
                  <ul className="text-sm text-orange-700 space-y-1.5 ml-4 list-disc">
                    <li><strong>Vehicle Types:</strong> Buses, minivans, sedans for transportation services</li>
                    <li><strong>Flight Types:</strong> Domestic, international, charter flight categories</li>
                    <li><strong>Car Types:</strong> Economy, luxury, SUV for rental services</li>
                    <li><strong>Service Types:</strong> Additional services like tours, guides, transfers</li>
                    <li>Ensures data consistency across proposals and vouchers</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="best-practices" className="border-gray-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Best Practices</div>
                    <div className="text-xs text-gray-600 font-normal">Tips for managing master data effectively</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 ml-11">
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Keep master data up-to-date to ensure accurate proposals and vouchers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Use the bulk mode for efficient updates across multiple records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Set inactive status instead of deleting to preserve historical data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Regularly review and clean up unused or outdated entries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Maintain consistent naming conventions for easy searching</span>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}