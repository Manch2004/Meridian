import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import StakingProducts from "./pages/StakingProducts";
import BonusEcosystem from "./pages/BonusEcosystem";
import PointsLevels from "./pages/PointsLevels";
import Fund from "./pages/Fund";
import Technology from "./pages/Technology";
import Token from "./pages/Token";
import Security from "./pages/Security";
import Ecosystem from "./pages/Ecosystem";
import Roadmap from "./pages/Roadmap";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/staking" element={<StakingProducts />} />
          <Route path="/bonuses" element={<BonusEcosystem />} />
          <Route path="/levels" element={<PointsLevels />} />
          <Route path="/fund" element={<Fund />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/token" element={<Token />} />
          <Route path="/security" element={<Security />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
