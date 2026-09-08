import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
