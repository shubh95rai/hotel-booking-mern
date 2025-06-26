import { Outlet } from "react-router-dom";
import Navbar from "../../components/hotel-owner/Navbar";
import Sidebar from "../../components/hotel-owner/Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 p-4 pt-10 md:px-10 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
