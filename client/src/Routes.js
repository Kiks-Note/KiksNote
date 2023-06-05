import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blog from "./pages/blog/Blog";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import Cours from "./pages/ressources/Cours/Cours";
import CoursInfo from "./pages/ressources/Cours/CoursInfo";
import PublicRoutes from "./utils/PublicRoutes";
import Profil from "./pages/profil/Profil";
import NotFound from "./pages/not_found/NotFound";
import TabBoard from "./pages/board_scrum/tabs/TabBoard";
import FolderAgile from "./pages/agile/FolderAgile";
import Jpo from "./pages/ressources/jpo/Jpo";
import JpoInfo from "./pages/ressources/jpo/JpoInfo";
import HistoryJpo from "./pages/ressources/jpo/HistoryJpo";
import StudentsProjects from "./pages/ressources/students_project/StudentsProjects";
import StudentsProjectsInfo from "./pages/ressources/students_project/StudentProjectInfo";
import Appel from "./pages/call/Call";
import Home from "./pages/home/Home";
import InventoryAdminDashboard from "./pages/inventory/InventoryAdminDashboard";
import InventoryDevices from "./pages/inventory/InventoryDevices";
import InventoryHome from "./pages/inventory/InventoryHome";
import InventoryList from "./pages/inventory/InventoryList";
import InventoryListBorrowed from "./pages/inventory/InventoryListBorrowed";
import InventoryRequests from "./pages/inventory/InventoryRequests";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import DetailBlog from "./pages/blog/DetailBlog";
import DeviceHistory from "./pages/inventory/DeviceHistory";
import Retrospective from "./pages/retrospective/Retrospective";


function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/arbre" element={<ArbreFonctionnel />} />

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
          <Route path="/blog/:id" element={<DetailBlog />} />

          <Route path="/profil" element={<Profil />} />

          {/* 404 Page */}
          <Route path="/jpo" element={<Jpo />} />
          <Route path="/jpo/:id" element={<JpoInfo />} />
          <Route path="/jpo/history" element={<HistoryJpo />} />
          <Route path="/studentprojects" element={<StudentsProjects />} />
          <Route
            path="/studentprojects/:projectid"
            element={<StudentsProjectsInfo />}
          />
          <Route path="/cours" element={<Cours />} />
          <Route path="/coursinfo/:id" element={<CoursInfo />} />




          <Route path="/agile" element={<FolderAgile />} />
          <Route path="/retro" element={<Retrospective />} />

          {/* INVENTORY */}
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
          <Route path="/deviceHistory/:deviceId" element={<DeviceHistory />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
