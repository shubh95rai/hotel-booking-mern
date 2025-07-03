import { Route, Router, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotel-owner/Layout";
import Dashboard from "./pages/hotel-owner/Dashboard";
import AddRoom from "./pages/hotel-owner/AddRoom";
import ListRoom from "./pages/hotel-owner/ListRoom";
import AllRooms from "./pages/AllRooms";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";

export default function App() {
  const isOwnerPath = useLocation().pathname.includes("owner");

  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}

      <ScrollToTop />

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/loader/:nextUrl" element={<Loader />} />

          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
