import { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function HotelReg() {
  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  async function onSubmitHandler(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/hotels",
        {
          name,
          contact,
          address,
          city,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setIsOwner(true);
        setShowHotelReg(false);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.error(message);

      toast.error("Hotel registration failed");
    }
  }

  return (
    <div
      onClick={() => {
        setShowHotelReg(false);
      }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      >
        <img
          src={assets.regImage}
          alt="reg-image"
          className="w-1/2 rounded-l-xl hidden md:block"
        />

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="w-4 h-4 absolute top-4 right-4 cursor-pointer"
            onClick={() => setShowHotelReg(false)}
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* hotel name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* phone */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* select city dropdown */}
          <div className="w-full mt-4">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select
              id="address"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
