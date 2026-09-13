import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AIChatWidget from "./AIChatWidget";

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
