import { Outlet } from "react-router";
import { AuthProvider } from "../../contexts/AuthContext";
import { DataProvider } from "../../contexts/DataContext";

export function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <Outlet />
      </DataProvider>
    </AuthProvider>
  );
}