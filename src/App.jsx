import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Fund from "./pages/Fund";
import Technology from "./pages/Technology";
import Token from "./pages/Token";
import Roadmap from "./pages/Roadmap";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/fund" element={<Fund />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/token" element={<Token />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
