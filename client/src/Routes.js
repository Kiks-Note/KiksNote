import {BrowserRouter, Route, Routes} from "react-router-dom";
import Test from "./pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";
import InventoryHome from "./pages/inventory/InventoryHome";
import InventoryRequests from "./pages/inventory/InventoryRequests";
import InventoryDevices from "./pages/inventory/InventoryDevices";
import InventoryAdminDashboard from "./pages/inventory/InventoryAdminDashboard";
import InventoryAdminDevice from "./pages/inventory/InventoryAdminDevice";

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
          <Route
            path="/inventory/admin/dashboard/device"
            element={<InventoryAdminDevice />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
