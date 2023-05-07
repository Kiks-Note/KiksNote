import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blog from "./pages/blog/Blog";
import Tuto from "./pages/blog/Tuto";
import TabList from "./pages/board_scrum/tabs/TabBoard";
import Appel from "./pages/call/Call";
import Groups from "./pages/groups/Groups";
import Home from "./pages/home/Home";
import InventoryAdminDashboard from "./pages/inventory/InventoryAdminDashboard";
import InventoryDevices from "./pages/inventory/InventoryDevices";
import InventoryHome from "./pages/inventory/InventoryHome";
import InventoryList from "./pages/inventory/InventoryList";
import InventoryListBorrowed from "./pages/inventory/InventoryListBorrowed";
import InventoryRequests from "./pages/inventory/InventoryRequests";
import Login from "./pages/login/Login";
import Presence from "./pages/presence/Presence";
import Register from "./pages/register/Register";
import PrivateRoutes from "./utils/PrivateRoutes";

function RoutesProvider() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence/>} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/" element={<Home/>} />
          <Route path="/tabList" element={<TabList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tuto" element={<Tuto />} />

          {/* INVENTORY */}
          <Route
            path="/inventory"
            element={<InventoryHome />} 
          />
          <Route
            path="/inventory/requests"
            element={<InventoryRequests />} 
          />
          <Route
            path="/inventory/devices"
            element={<InventoryDevices />}
          />
          <Route
            path="/inventory/admin/dashboard"
            element={<InventoryAdminDashboard />} 
          />

          <Route
            path="/inventory/admin/list"
            element={<InventoryList />} 
          />
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
