import {BrowserRouter, Route, Routes} from "react-router-dom";
import Test from "./pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";
import InventoryHome from "./pages/inventory/InventoryHome";
import {InventoryRequests} from "./pages/inventory/InventoryRequests";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/inventory" element={<InventoryHome />} />
          <Route path="/inventoryRequests" element={<InventoryRequests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
