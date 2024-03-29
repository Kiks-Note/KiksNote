import { BrowserRouter, Route, Routes } from "react-router-dom";
import FolderAgile from "./pages/agile/FolderAgile";
import Blog from "./pages/blog/Blog";
import Board from "./pages/board_retro/board";
import BoardReview from "./pages/board_retro/boardReview";
import TabBoard from "./pages/board_scrum/tabs/TabBoard";
import Calendar from "./pages/calendar/Calendar";
import CalendarPedago from "./pages/calendar/CalendarPedago";
import Appel from "./pages/call/Call";
import GroupsCreation from "./pages/groups/Groups";
import GroupsDisplay from "./pages/groups/GroupsDisplay";
import Home from "./pages/home/Home";
import InventoryAdminDashboard from "./pages/inventory/InventoryAdminDashboard";
import InventoryDevices from "./pages/inventory/InventoryDevices";
import InventoryHome from "./pages/inventory/InventoryHome";
import InventoryIdeas from "./pages/inventory/InventoryIdeas";
import InventoryList from "./pages/inventory/InventoryList";
import InventoryListBorrowed from "./pages/inventory/InventoryListBorrowed";
import InventoryPdfGenerator from "./pages/inventory/InventoryPdfGenerator";
import InventoryPendingRequests from "./pages/inventory/InventoryPendingRequests";
import InventoryRequests from "./pages/inventory/InventoryRequests";
import InventoryStatistics from "./pages/inventory/InventoryStatistics";
import Login from "./pages/login/Login";
import NotFound from "./pages/not_found/NotFound";
import Presence from "./pages/presence/Presence";
import Profil from "./pages/profil/Profil";
import Register from "./pages/register/Register";
import AskResetPassword from "./pages/resetpassword/AskResetPassword";
import DetailBlog from "./pages/blog/DetailBlog";
import DeviceHistory from "./pages/inventory/DeviceHistory";
import DetailTuto from "./pages/blog/DetailTuto";
import Cours from "./pages/ressources/Cours/Cours";
import CoursInfo from "./pages/ressources/Cours/CoursInfo";
import Jpo from "./pages/ressources/jpo/Jpo";
import HistoryJpo from "./pages/ressources/jpo/HistoryJpo";
import JpoInfo from "./pages/ressources/jpo/JpoInfo";
import StudentsProjectsInfo from "./pages/ressources/students_project/StudentProjectInfo";
import StudentsProjects from "./pages/ressources/students_project/StudentsProjects";
import Retrospective from "./pages/retrospective/Retrospective";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";
import useFirebase from "./hooks/useFirebase";

function RoutesProvider() {
  const {user} = useFirebase();
  console.log(user);

  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/askresetpassword" element={<AskResetPassword />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
        {/* {Route} */}
        <Route element={<PrivateRoutes />}>
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groupes" element={<GroupsDisplay />} />
          <Route path="/groupes/creation" element={<GroupsCreation />} />
          <Route path="/" element={<Home />} />
          <Route path="/appel/:id" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groups" element={<GroupsCreation />} />
          <Route path="/tableau-de-bord" element={<TabBoard />} />
          <Route path="/agile" element={<FolderAgile />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<DetailBlog />} />
          <Route path="/tuto/:id" element={<DetailTuto />} />

          <Route path="/profil/:id" element={<Profil />} />

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
          <Route path="/retro" element={<Retrospective />} />
          <Route path="/board" element={<Board />} />
          <Route path="/boardReview" element={<BoardReview />} />
          {/* INVENTORY */}
          <Route path="/inventory" element={<InventoryHome />} />

          {user?.status === "pedago" && (
            <>
              <Route path="/inventory/ideas" element={<InventoryIdeas />} />
              <Route
                path="/inventory/ideas/:status"
                element={<InventoryIdeas />}
              />
              <Route
                path="/inventory/ideas/:status"
                element={<InventoryIdeas />}
              />
              <Route
                path="/inventory/requests"
                element={<InventoryRequests />}
              />
              <Route path="/inventory/devices" element={<InventoryDevices />} />
              <Route
                path="/inventory/statistics"
                element={<InventoryStatistics />}
              />
              <Route
                path="/inventory/pdfGenerator"
                element={<InventoryPdfGenerator />}
              />
              <Route
                path="/inventory/admin/dashboard"
                element={<InventoryAdminDashboard />}
              />

              <Route path="/inventory/admin/list" element={<InventoryList />} />
              <Route
                path="/inventory/admin/borrowed"
                element={<InventoryListBorrowed />}
              />
              <Route
                path="/inventory/requests/:status"
                element={<InventoryPendingRequests />}
              />
              <Route
                path="/deviceHistory/:deviceId"
                element={<DeviceHistory />}
              />
            </>
          )}

          <Route path="/calendrier" element={<Calendar />} />
          <Route path="/calendrier/:id" element={<CalendarPedago />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
