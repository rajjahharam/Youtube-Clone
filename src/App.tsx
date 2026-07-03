import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home/Home";
import Shorts from "./pages/Shorts/Shorts";
import Search from "./pages/Search/Search";
import Watch from "./pages/Watch/Watch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watch/:videoId" element={<Watch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;