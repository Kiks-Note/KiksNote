import {BrowserRouter, Route, Routes} from "react-router-dom";
import Test from "./pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";
import InventoryHome from "./pages/inventory/InventoryHome";
import InventoryRequests from "./pages/inventory/InventoryRequests";
import InventoryDevices from "./pages/inventory/InventoryDevices";
import InventoryAdminDashboard from "./pages/inventory/InventoryAdminDashboard";
import InventoryList from "./pages/inventory/InventoryList";
import InventoryListBorrowed from "./pages/inventory/InventoryListBorrowed";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/inventory" element={<InventoryHome />} />
          <Route path="/inventory/requests" element={<InventoryRequests />} />
          <Route path="/inventory/devices" element={<InventoryDevices />} />
          <Route
            path="/inventory/admin/dashboard"
            element={<InventoryAdminDashboard />}
          />
          <Route path="/inventory/admin/list" element={<InventoryList />} />
          <Route
            path="/inventory/admin/borrowed"
            element={<InventoryListBorrowed />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
