import {BrowserRouter, Route, Routes} from "react-router-dom";
import Blog from "./pages/blog/Blog";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import Tuto from "./pages/blog/Tuto";
import Cours from "./pages/ressources/Cours/Cours";
import CoursInfo from "./pages/ressources/Cours/CoursInfo";
import CourseBacklogPdf from "./pages/ressources/Cours/PdfCoursBacklog";
import PDFCourseView from "./pages/ressources/Cours/PdfCourseView";
import PublicRoutes from "./utils/PublicRoutes";
import Profil from "./pages/profil/Profil";
import NotFound from "./pages/not_found/NotFound";
import Jpo from "./pages/ressources/jpo/jpo";
import StudentsProjects from "./pages/students_project/StudentsProjects";
import Agile from "./pages/agile/Agile";
import TabList from "./pages/board_scrum/tabs/TabBoard";
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
import DeviceHistory from "./pages/inventory/DeviceHistory";
import EmpathyMap from "./pages/agile/EmpathyMap";
import Personas from "./pages/agile/Personas";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Route>
        {/* {Route} */}
        <Route element={<PrivateRoutes />}>
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groupes" element={<Groups />} />
          <Route path="/" element={<Home />} />
          <Route path="/appel" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/" element={<Home />} />
          <Route path="/tabList" element={<TabList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tuto" element={<Tuto />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/jpo" element={<Jpo />} />
          <Route path="/studentprojects" element={<StudentsProjects />} />
          <Route path="/cours" element={<Cours />} />
          <Route path="/coursinfo/:id" element={<CoursInfo />} />
          <Route path="/pdfsupport" element={<PDFCourseView />} />
          <Route path="/pdfbacklog" element={<CourseBacklogPdf />} />
          <Route path="/agile" element={<Agile/>}/>
          <Route path="/agile/empathy-map" element={<EmpathyMap />} />
          <Route path="/agile/persona" element={<Personas />} />
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
