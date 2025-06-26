import { useState } from "react";
import { roomsDummyData } from "../../assets/assets";
import Title from "../../components/Title";

export default function ListRoom() {
  const [rooms, setRooms] = useState(roomsDummyData);

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
                  $ {item.pricePerNight}
                </td>

                <td className="py-3 px-4 border-t text-red-500 text-sm border-gray-300 text-center">
                  <label class="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input type="checkbox" class="sr-only peer" />
                    <div class="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span class="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
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
