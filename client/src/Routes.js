import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./pages/call/Call";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import TabList from "./pages/board_scrum/tabs/TabBoard";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import Tuto from "./pages/blog/Tuto";
import PublicRoutes from "./utils/PublicRoutes";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profil from "./pages/profil/Profil";
import NotFound from "./pages/not_found/NotFound";

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
          <Route path="/appel" element={<Navbar element={<Appel />} />} />
          <Route
            path="/presence/:id"
            element={<Navbar element={<Presence />} />}
          />
          <Route path="/groups" element={<Navbar element={<Groups />} />} />
          <Route path="/" element={<Home />} />
          <Route path="/appel" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/tabList" element={<TabList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tuto" element={<Tuto />} />
          <Route path="/profil" element={<Profil />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
