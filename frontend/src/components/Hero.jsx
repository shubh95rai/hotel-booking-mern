import { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

export default function Hero() {
  const { navigate, axios, getToken, setSearchedCities } = useAppContext();

  const [destination, setDestination] = useState("");

  async function onSearch(e) {
    e.preventDefault();
    navigate(`/rooms?destination=${destination}`);

    // API call to save recent searched city
    try {
      const response = await axios.post(
        "/api/user/store-recent-search",
        {
          recentSearchedCity: destination,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (response.data.success) {
        setSearchedCities([...response.data.recentSearchedCities]);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.error(message);

      toast.error("Error searching for hotels");
    }
  }

  return (
    <div className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/heroImage.png')] bg-no-repeat bg-cover bg-center h-screen">
      <p className="bg-blue-600/60 px-3.5 py-1 rounded-full mt-20 mx-auto">
        The Ultimate Hotel Experience
      </p>
      <h1 className="font-playfair text-3xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4 mx-auto text-center">
        Discover Your Perfect Gateway Destination
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base mx-auto text-center">
        Unparalled luxury and comfort await at the world's most exclusive hotels
        and resorts. Start your journey today.
      </p>

      <form
        onSubmit={onSearch}
        className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 mx-auto"
      >
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            list="destinations"
            id="destinationInput"
            type="text"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
            placeholder="Type here"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <datalist id="destinations">
            {cities.map((city, i) => (
              <option key={i} value={city} />
            ))}
          </datalist>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16"
            placeholder="0"
          />
        </div>

        <button className="flex items-center justify-center gap-1 rounded-md bg-black py-2 px-2 text-white my-auto cursor-pointer max-md:w-full max-md:py-1 shrink-0">
          <img src={assets.searchIcon} alt="searchIcon" className="h-7" />
          <span className="md:hidden lg:flex pr-1">Search</span>
        </button>
      </form>
    </div>
  );
}
