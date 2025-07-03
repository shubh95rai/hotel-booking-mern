import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getHotelBookings,
  stripePayment,
} from "../controllers/bookingController.js";
import protect from "../middlewares/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getHotelBookings);

bookingRouter.post("/stripe-payment", protect, stripePayment);

export default bookingRouter;
