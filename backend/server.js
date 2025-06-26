import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const app = express();

connectDB();

// middlewares
app.use(cors()); // enable cross origin resource sharing
app.use(express.json());
app.use(clerkMiddleware());

// API to listen to clerk webhooks
app.use("/api/clerk", clerkWebhooks);

// routes
app.get("/", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
