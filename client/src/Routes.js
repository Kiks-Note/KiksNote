import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./pages/call/Call";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import TabList from "./pages/board_scrum/tabs/TabBoard";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import MiniDrawerNotConnected from "./components/drawer/MiniDrawerNotConnected";
import Register from "./pages/register/Register";
import Tuto from "./pages/blog/Tuto";
import Login from "./pages/login/Login";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route
          path="/login"
          element={<MiniDrawerNotConnected element={<Login />} />}
        />
        <Route
          path="/signup"
          element={<MiniDrawerNotConnected element={<Register />} />}
        />
        {/* {Route} */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/appel" element={<Appel />} />
          <Route path="/presence/:id" element={<Presence />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/tabList" element={<TabList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tuto" element={<Tuto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
