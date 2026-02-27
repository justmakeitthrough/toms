import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Building2, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../contexts/DataContext";

export function CompanySettingsPage() {
  const { companyInfo, updateCompanyInfo } = useData();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    licenseNumber: "",
    currency: "USD",
  });

  // Update form data when companyInfo changes
  useEffect(() => {
    console.log("CompanyInfo from context:", companyInfo);
    if (companyInfo) {
      setFormData({
        name: companyInfo.name || "",
        address: companyInfo.address || "",
        city: companyInfo.city || "",
        country: companyInfo.country || "",
        postalCode: companyInfo.postalCode || "",
        phone: companyInfo.phone || "",
        email: companyInfo.email || "",
        website: companyInfo.website || "",
        taxId: companyInfo.taxId || "",
        licenseNumber: companyInfo.licenseNumber || "",
        currency: companyInfo.currency || "USD",
      });
    }
  }, [companyInfo]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateCompanyInfo(formData);
    toast.success("Company settings saved successfully");
  };

  const handleLoadMockup = () => {
    const mockupData = {
      name: "Mediterranean Explorer Tours",
      address: "Cumhuriyet Caddesi No: 145, Harbiye",
      city: "Istanbul",
      country: "Turkey",
      postalCode: "34367",
      phone: "+90 212 368 4200",
      email: "info@mediterraneanexplorer.com",
      website: "www.mediterraneanexplorer.com",
      taxId: "TR8520147365",
      licenseNumber: "TURSAB-A-8524",
      currency: "USD",
    };
    setFormData(mockupData);
    updateCompanyInfo(mockupData);
    toast.success("Mockup company data loaded successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your company information and branding
        </p>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            <CardTitle>Company Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="info@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="www.company.com"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Istanbul"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Turkey"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder="34000"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleChange("taxId", e.target.value)}
                  placeholder="TR1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Tourism License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  placeholder="TURSAB-A-1234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency *</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  placeholder="USD"
                />
                <p className="text-xs text-gray-500">
                  ISO currency code (e.g., USD, EUR, GBP, TRY)
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6 flex justify-end gap-2">
            <Button 
              onClick={handleLoadMockup} 
              variant="outline" 
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Load Mockup Data
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This information will appear on all generated
            PDF documents, proposals, and vouchers. Make sure all details are
            accurate and up-to-date.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}