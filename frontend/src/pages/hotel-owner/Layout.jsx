import { Outlet } from "react-router-dom";
import Navbar from "../../components/hotel-owner/Navbar";
import Sidebar from "../../components/hotel-owner/Sidebar";
import { useAppContext } from "../../context/AppContext.jsx";
import { useEffect } from "react";

export default function Layout() {
  const { isOwner, navigate } = useAppContext();

  useEffect(() => {
    if (!isOwner) {
      navigate("/");
    }
  }, [isOwner]);

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 pt-10 md:px-10 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
