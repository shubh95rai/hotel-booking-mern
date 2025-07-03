import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export function AppProvider({ children }) {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  async function fetchRooms() {
    try {
      const response = await axios.get("/api/rooms");

      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.error(message);

      toast.error("Error fetching rooms");
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (response.data.success) {
        setIsOwner(response.data.role === "hotelOwner");
        setSearchedCities(response.data.recentSearchedCities);
      } else {
        // retry fetching user details after 5 seconds
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || // Check if error has a response and data (API error)
        error.message || // Network error or other issue
        "Unknown error";

      console.error(message);

      toast.error("Error fetching user details");
    }
  }

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    axios,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
