import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
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
import useFirebase from "./hooks/useFirebase";

function RoutesProvider() {
  const {user} = useFirebase();

  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
          </>
        ) : (
          <Route>
            <Route path="/appel" element={<Navbar element={<Appel />} />} />
            <Route
              path="/presence/:id"
              element={<Navbar element={<Presence />} />}
            />
            <Route path="/groups" element={<Navbar element={<Groups />} />} />
            <Route path="/" element={<Navbar element={<Home />} />} />
            <Route path="/tabList" element={<Navbar element={<TabList />} />} />
            <Route path="/blog" element={<Navbar element={<Blog />} />} />
            <Route path="/tuto" element={<Navbar element={<Tuto />} />} />

            {/* INVENTORY */}
            <Route
              path="/inventory"
              element={<Navbar element={<InventoryHome />} />}
            />
            <Route
              path="/inventory/requests"
              element={<Navbar element={<InventoryRequests />} />}
            />
            <Route
              path="/inventory/devices"
              element={<Navbar element={<InventoryDevices />} />}
            />
            <Route
              path="/inventory/admin/dashboard"
              element={<Navbar element={<InventoryAdminDashboard />} />}
            />

            <Route
              path="/inventory/admin/list"
              element={<Navbar element={<InventoryList />} />}
            />
            <Route
              path="/inventory/admin/borrowed"
              element={<Navbar element={<InventoryListBorrowed />} />}
            />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
