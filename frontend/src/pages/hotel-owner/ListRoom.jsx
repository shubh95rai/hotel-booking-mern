import { useState } from "react";
import { roomsDummyData } from "../../assets/assets";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext.jsx";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ListRoom() {
  const [rooms, setRooms] = useState([]);
  const { axios, getToken, user, currency } = useAppContext();

  async function fetchRooms() {
    try {
      const response = await axios.get("/api/rooms/owner", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      if (!error.response.data.success) {
        console.error(error.response.data.message);
      } else {
        console.error(error.message);
      }

      toast.error("Error fetching rooms");
    }
  }

  // toggle availability of room
  async function toggleRoomAvailability(roomId) {
    try {
      const response = await axios.post(
        `/api/rooms/toggle-availability`,
        {
          roomId,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchRooms();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.error(message);

      toast.error("Error toggling room availability");
    }
  }

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  return (
    <div>
      <Title
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
        align="left"
        font="outfit"
      />
      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="*:py-3 *:px-4 *:text-gray-800 *:font-medium">
              <th>Name</th>
              <th className="max-sm:hidden">Facility</th>
              <th>Price / night</th>
              <th className="text-center ">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.roomType}
                </td>

                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.amenities.join(", ")}
                </td>

                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {currency} {item.pricePerNight}
                </td>

                <td className="py-3 px-4 border-t text-red-500 text-sm border-gray-300 text-center">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      onChange={() => toggleRoomAvailability(item._id)}
                    />
                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
