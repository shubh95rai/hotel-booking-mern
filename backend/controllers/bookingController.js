import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";

// function to check room availability
export async function checkAvailability({ checkInDate, checkOutDate, room }) {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;

    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
}

// API to check room availability
// POST /api/bookings/check-availability
export async function checkAvailabilityAPI(req, res) {
  try {
    const { checkInDate, checkOutDate, room } = req.body;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    res.status(200).json({ success: true, isAvailable });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}

// API to create a new booking
// POST /api/bookings/book
export async function createBooking(req, res) {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    // before booking check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Room is not available",
      });
    }

    // get totalPrice from Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut - checkIn;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res
      .status(201)
      .json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: "Booking failed" });
  }
}

// API to get all bookings for a user
// GET /api/bookings/user
export async function getUserBookings(req, res) {
  try {
    const user = req.user._id;

    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}

// API to get owner hotel bookings
// GET /api/bookings/hotel

export async function getHotelBookings(req, res) {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth().userId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    // total bookings
    const totalBookings = bookings.length;

    // total revenue
    const totalRevenue = bookings.reduce((acc, booking) => {
      return acc + booking.totalPrice;
    }, 0);

    res.status(200).json({
      success: true,
      dashboardData: { bookings, totalBookings, totalRevenue },
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}

export async function stripePayment(req, res) {
  try {
    const { bookingId } = req.body;
    const { origin } = req.headers;

    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100, // stripe expects amount in cents
        },
        quantity: 1,
      },
    ];

    // create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}
