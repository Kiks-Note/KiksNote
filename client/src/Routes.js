import {BrowserRouter, Route, Routes} from "react-router-dom";
import Blog from "./pages/blog/Blog";
import Tuto from "./pages/blog/Tuto";
import TabBoard from "./pages/board_scrum/tabs/TabBoard";
import Groups from "./pages/groups/Groups";
import NotFound from "./pages/not_found/NotFound";
import Presence from "./pages/presence/Presence";
import Profil from "./pages/profil/Profil";
import StudentsProjectsInfo from "./pages/ressources//students_project/StudentProjectInfo";
import StudentsProjects from "./pages/ressources//students_project/StudentsProjects";
import Cours from "./pages/ressources/Cours/Cours";
import CoursInfo from "./pages/ressources/Cours/CoursInfo";
import Jpo from "./pages/ressources/jpo/jpo";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";

import Agile from "./pages/agile/Agile";
import EmpathyMap from "./pages/agile/EmpathyMap";
import Personas from "./pages/agile/Personas";
import Appel from "./pages/call/Call";
import Home from "./pages/home/Home";
import DeviceHistory from "./pages/inventory/DeviceHistory";
import InventoryAdminDashboard from "./pages/inventory/InventoryAdminDashboard";
import InventoryDevices from "./pages/inventory/InventoryDevices";
import InventoryHome from "./pages/inventory/InventoryHome";
import InventoryIdeas from "./pages/inventory/InventoryIdeas";
import InventoryList from "./pages/inventory/InventoryList";
import InventoryListBorrowed from "./pages/inventory/InventoryListBorrowed";
import InventoryRequests from "./pages/inventory/InventoryRequests";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import PhoneRequestDevice from "./pages/inventory/PhoneRequestDevice";
import InventoryPendingRequests from "./pages/inventory/InventoryPendingRequests";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="/preRequest/:deviceId"
            element={<PhoneRequestDevice />}
          />
        </Route>
        {/* {Route} */}
        <Route element={<PrivateRoutes />}>
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groupes" element={<Groups />} />
          <Route path="/" element={<Home />} />
          <Route path="/appel" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/tableau-de-bord" element={<TabBoard />} />
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tuto" element={<Tuto />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/jpo" element={<Jpo />} />
          <Route path="/studentprojects" element={<StudentsProjects />} />
          <Route
            path="/studentprojects/:projectid"
            element={<StudentsProjectsInfo />}
          />
          <Route path="/cours" element={<Cours />} />
          <Route path="/coursinfo/:id" element={<CoursInfo />} />
          <Route path="/agile" element={<Agile />} />
          <Route path="/agile/empathy-map" element={<EmpathyMap />} />
          <Route path="/agile/persona" element={<Personas />} />
          {/* INVENTORY */}
          <Route path="/inventory" element={<InventoryHome />} />
          <Route path="/inventory/ideas" element={<InventoryIdeas />} />
          <Route path="/inventory/ideas/:status" element={<InventoryIdeas />} />
          <Route path="/inventory/ideas/:status" element={<InventoryIdeas />} />
          <Route path="/inventory/requests" element={<InventoryRequests />} />
          <Route path="/inventory/devices" element={<InventoryDevices />} />
          <Route
            path="/inventory/admin/dashboard"
            element={<InventoryAdminDashboard />}
          />
          {/* <Route
            path="/inventory/device/:deviceId"
            element={<PhoneRequestDevice />}
          /> */}

          <Route path="/inventory/admin/list" element={<InventoryList />} />
          <Route
            path="/inventory/admin/borrowed"
            element={<InventoryListBorrowed />}
          />
          <Route
            path="/inventory/requests/:status"
            element={<InventoryPendingRequests />}
          />
          <Route path="/deviceHistory/:deviceId" element={<DeviceHistory />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
