import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function RoomDetails() {
  const { id } = useParams();
  const { rooms, axios, navigate, getToken } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const [isAvailable, setIsAvailable] = useState(false);

  // function check if the room is available
  async function checkAvailability() {
    try {
      // check if checkInDate is greater than checkOutDate
      if (checkInDate >= checkOutDate) {
        toast.error("Check-In date should be less than Check-Out date");
        return;
      }

      const response = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (response.data.success) {
        if (response.data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available");
        } else {
          setIsAvailable(false);
          toast.error("Room is not available");
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.error(message);

      toast.error("Error checking availability");
    }
  }

  // function to check and book the room
  async function onSubmitHandler(e) {
    e.preventDefault();

    try {
      if (!isAvailable) {
        return checkAvailability();
      } else {
        const response = await axios.post(
          "/api/bookings/book",
          {
            room: id,
            checkInDate,
            checkOutDate,
            guests,
            paymentMethod: "Pay at hotel",
          },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/my-bookings");
          scrollTo(0, 0);
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.error(message);

      toast.error("Error creating booking");
    }
  }

  useEffect(() => {
    const room = rooms.find((room) => room._id === id);

    if (room) {
      setRoom(room);
      setMainImage(room.images[0]);
    }
  }, [rooms]);

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* room details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="text-sm font-inter">({room.roomType})</span>
          </h1>
          <p className="text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full font-inter">
            20% OFF
          </p>
        </div>

        {/* room rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">200+ reviews</p>
        </div>

        {/* room address */}
        <div className="flex items-center gap-1 mt-2 text-gray-500">
          <img src={assets.locationIcon} alt="location icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* room images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="room-image"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="room-image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* room highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>

            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="size-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* room price */}
          <p className="text-2xl font-medium">${room.pricePerNight} /night</p>
        </div>

        {/* check in - check out form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col lg:flex-row items-center  justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-wrap flex-row items-center justify-center md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col max-sm:items-center">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 mt-1.5 py-2 outline-none"
                required
                onChange={(e) => setCheckInDate(e.target.value)}
                value={checkInDate}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex flex-col max-sm:items-center">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                placeholder="Check-Out"
                className="w-full rounded border border-gray-300 px-3 mt-1.5 py-2 outline-none"
                required
                onChange={(e) => setCheckOutDate(e.target.value)}
                value={checkOutDate}
                min={checkInDate}
                disabled={!checkInDate}
              />
            </div>

            <div className="flex flex-col max-sm:items-center">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                placeholder="1"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                onChange={(e) => setGuests(e.target.value)}
                value={guests}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white rounded-md max-lg:mt-6 px-6 lg:px-25 py-3 md:py-4 text-base cursor-pointer flex-none"
          >
            {isAvailable ? "Book Now" : "Check Availability"}
          </button>
        </form>

        {/* common specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-center gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* description */}
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable Two bedroom apartment that a
            true city feeling. The price quoted is for two guest, at the guest
            slot please mark the number of guests to get the exact price for
            groups. The Guests will be allocated roud floor according to
            availability. You are welcome to book the room for a weekend or
            longer stay.
          </p>
        </div>

        {/* hosted by */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={room.hotel.owner.image}
              alt="host"
              className="size-14 md:size-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>

          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary/90 transition-all cursor-pointer">
            Contact Now
          </button>
        </div>
      </div>
    )
  );
}
