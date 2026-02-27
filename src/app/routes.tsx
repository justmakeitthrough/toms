import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { MainLayout } from "./components/layouts/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProposalsListPage } from "./pages/ProposalsListPage";
import { ProposalCreatePage } from "./pages/ProposalCreatePage";
import { ProposalViewPage } from "./pages/ProposalViewPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { VouchersPage } from "./pages/VouchersPage";
import { VoucherDetailPage } from "./pages/VoucherDetailPage";
import { MasterDataPage } from "./pages/MasterDataPage";
import { DestinationsPage } from "./pages/DestinationsPage";
import { HotelsPage } from "./pages/HotelsPage";
import { AgenciesPage } from "./pages/AgenciesPage";
import { GlobalLookupsPage } from "./pages/GlobalLookupsPage";
import { SourcesPage } from "./pages/SourcesPage";
import { UsersPage } from "./pages/UsersPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage";
import { CompanySettingsPage } from "./pages/CompanySettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "proposals", element: <ProposalsListPage /> },
          { path: "proposals/new", element: <ProposalCreatePage /> },
          { path: "proposals/:id", element: <ProposalViewPage /> },
          { path: "proposals/:id/confirm", element: <ConfirmationPage /> },
          { path: "confirmed", element: <VouchersPage /> },
          { path: "vouchers", element: <VouchersPage /> },
          { path: "vouchers/:id", element: <VoucherDetailPage /> },
          { path: "master-data", element: <MasterDataPage /> },
          { path: "master-data/destinations", element: <DestinationsPage /> },
          { path: "master-data/hotels", element: <HotelsPage /> },
          { path: "master-data/agencies", element: <AgenciesPage /> },
          { path: "master-data/lookups", element: <GlobalLookupsPage /> },
          { path: "master-data/sources", element: <SourcesPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "profile", element: <ProfileSettingsPage /> },
          { path: "company-settings", element: <CompanySettingsPage /> },
        ],
      },
    ],
  },
]);