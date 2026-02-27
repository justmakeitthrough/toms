import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../contexts/AuthContext";

type UserRole = "Sales Employee" | "Reservations Officer" | "Operations Officer" | "Accounting Officer" | "Super Admin";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Sales Employee");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome to TOMS</CardTitle>
            <CardDescription>Tourism Operations Management System</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@toms.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales Employee">Sales Employee</SelectItem>
                  <SelectItem value="Reservations Officer">Reservations Officer</SelectItem>
                  <SelectItem value="Operations Officer">Operations Officer</SelectItem>
                  <SelectItem value="Accounting Officer">Accounting Officer</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-md space-y-2">
            <p className="text-xs font-semibold text-gray-700">
              🎭 Demo Access - Select Your Role:
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• <strong>Sales Employee:</strong> Create & view proposals</p>
              <p>• <strong>Reservations:</strong> Confirm proposals & manage vouchers</p>
              <p>• <strong>Operations:</strong> View & manage operational details</p>
              <p>• <strong>Accounting:</strong> View financials & reports</p>
              <p>• <strong>Super Admin:</strong> Full system access</p>
            </div>
            <p className="text-xs text-gray-500 pt-2">
              Use any email/password to login
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
