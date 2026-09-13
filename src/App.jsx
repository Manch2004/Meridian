import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/RequireAuth";
import RequireStaff from "./components/RequireStaff";
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyTickets from "./pages/MyTickets";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import AdminTickets from "./pages/AdminTickets";
import AdminTicketDetail from "./pages/AdminTicketDetail";

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<RequireAuth />}>
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/my-tickets/new" element={<NewTicket />} />
            <Route path="/my-tickets/:ticketId" element={<TicketDetail />} />
          </Route>
          <Route element={<RequireStaff />}>
            <Route path="/admin" element={<AdminTickets />} />
            <Route path="/admin/:ticketId" element={<AdminTicketDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
