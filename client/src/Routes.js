import {BrowserRouter, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";

import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog";
import Dashboard from "./pages/board_scrum/Dashboard";
import Board from "./pages/board_scrum/Board";

function RoutesProvider() {
    return (
      <BrowserRouter>
        <Routes>
          {/* EXAMPLES */}

          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* To Use the Navbar change Test by your page
                <Route path="/test" element={<Navbar element={<Test />} />} /> */}

          {/*<Route path="/" element={<Navbar element={<Test/>}/>}/>*/}
          {/*<Route path="/test" element={<Navbar element={<Test/>}/>}/>*/}

          {/* Write here route that you don't need to be login*/}

          <Route element={<PrivateRoutes />}>
            {/* Write here route that you need to be login*/}

            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board/:boardId" element={<Board />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
}

export default RoutesProvider;
