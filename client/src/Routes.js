import { BrowserRouter, Route, Routes } from "react-router-dom";

import Appel from "./pages/call/Call";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";
import Tuto from "./pages/blog/Tuto";
import Ressources from "./pages/ressources/Ressources";
import CreateCard from "./pages/ressources/CreateCard";
import PDFBacklogCartView from "./pages/ressources/PDFBacklogCardView";
import PDFSupport from "./pages/ressources/PDFSupportCardView";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Navbar element={<Appel />} />} />
          <Route
            path="/presence/:id"
            element={<Navbar element={<Presence />} />}
          />
          <Route path="/groups" element={<Navbar element={<Groups />} />} />
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tuto" element={<Tuto />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="/createCard" element={<CreateCard />} />
          <Route path="/pdfbacklog" element={<PDFBacklogCartView />} />
          <Route path="/pdfsupport" element={<PDFSupport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
