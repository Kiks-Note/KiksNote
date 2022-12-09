import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";

function RoutesProvider() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes/>}>
                    <Route path="/" element={<Home/>}/>
                </Route>
                <Route path="/blog" element={<Blog/>}/>
                <Route path="/login" element={<Login />} /> 
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesProvider;
