import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import stripeWebhooks from "./controllers/stripeWebhooks.js";

const app = express();

connectDB();
connectCloudinary();

// middlewares
app.use(cors()); // enable cross origin resource sharing

// API to listen to stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
); // stripe requires the raw body of the request to verify the webhook signature that's why we're using express.raw before express.json

app.use(express.json());
app.use(clerkMiddleware());

// API to listen to clerk webhooks
app.use("/api/clerk", clerkWebhooks);

// routes
app.get("/", (req, res) => {
  res.send("API is working");
});
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
