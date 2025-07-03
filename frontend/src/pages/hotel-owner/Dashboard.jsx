import { useEffect, useState } from "react";
import { assets, dashboardDummyData } from "../../assets/assets";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext.jsx";

export default function Dashboard() {
  const { axios, getToken, currency, user } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });

  async function fetchDashboardData() {
    try {
      const response = await axios.get("/api/bookings/hotel", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (response.data.success) {
        setDashboardData(response.data.dashboardData);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.error(message);

      toast.error("Error fetching dashboard data");
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div>
      <Title
        title="Dasboard"
        subTitle="Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth experience."
        align="left"
        font="outfit"
      />

      <div className="flex gap-4 my-8">
        {/* total bookings */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt="booking-icon"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>

        {/* total revenue */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt="revenue-icon"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* recent bookings */}
      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Bookings
      </h2>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="*:py-3 *:px-4 *:text-gray-800 *:font-medium">
              <th>User Name</th>
              <th className="max-sm:hidden">Room Name</th>
              <th className="text-center ">Total Amount</th>
              <th className="text-center ">Payment Status</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {dashboardData.bookings.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.user.username}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.room.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {currency} {item.totalPrice}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 flex">
                  <button
                    className={`py-1 px-3
                     text-xs rounded-full mx-auto ${
                       item.isPaid
                         ? "bg-green-200 text-green-600"
                         : "bg-amber-200 text-yellow-600"
                     }`}
                  >
                    {item.isPaid ? "Completed" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
