import { Footer } from "./footer";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  console.log("Layout рендериться");
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
