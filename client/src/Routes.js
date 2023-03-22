import {BrowserRouter, Route, Routes} from "react-router-dom";
import Test from "./pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";
import CreateRetro from "./Pages/createretro/CreateRetro.js";
import Retrospective from "./Pages/retrospective/Retrospective.js";

import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog";

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


                <Route element={<PrivateRoutes/>}>
                    {/* Write here route that you need to be login*/}

                    <Route path="/" element={<Home/>}/>
                    <Route path="/blog" element={<Blog/>}/>
                    <Route path="/createretro" element={<CreateRetro />} />
                    <Route path="/retrospective/:retro_id" element={<Retrospective />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesProvider;
