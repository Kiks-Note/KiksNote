import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./pages/call/Call";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import TabList from "./pages/board_scrum/tabs/TabBoard";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import Tuto from "./pages/blog/Tuto";
import Cours from "./pages/ressources/Cours/Cours";
import CoursInfo from "./pages/ressources/Cours/CoursInfo";
import PDFBacklogCartView from "./pages/ressources/PDFBacklogCardView";
import PDFSupport from "./pages/ressources/PDFSupportCardView";
import PublicRoutes from "./utils/PublicRoutes";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profil from "./pages/profil/Profil";
import NotFound from "./pages/not_found/NotFound";
import Jpo from "./pages/ressources/JPO/jpo";
import StudentsProjects from "./pages/students_project/StudentsProjects";

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
          <Route path="/appel" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/" element={<Home />} />
          <Route path="/appel" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/tabList" element={<TabList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tuto" element={<Tuto />} />
          <Route path="/cours" element={<Cours />} />
          <Route path="/cours/:id" element={<CoursInfo />} />
          <Route path="/pdfbacklog" element={<PDFBacklogCartView />} />
          <Route path="/pdfsupport" element={<PDFSupport />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/jpo" element={<Jpo />} />
          <Route path="/studentprojects" element={<StudentsProjects />} />
          {/* 404 Page */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
