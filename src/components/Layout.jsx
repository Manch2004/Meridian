import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AIChatWidget from "./AIChatWidget";
import { AIChatProvider } from "../context/AIChatContext";

export default function Layout() {
  return (
    <AIChatProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <AIChatWidget />
      </div>
    </AIChatProvider>
  );
}
