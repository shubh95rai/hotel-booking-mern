import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API ro create a new room for a hotel
export async function createRoom(req, res) {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await Hotel.findOne({ owner: req.auth().userId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path, {
        folder: "hotel-booking",
      });

      return response.secure_url;
    });

    // wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res
      .status(201)
      .json({ success: true, message: "Room created successfully" });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}

// API to get all rooms
export async function getAllRooms(req, res) {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}

// API to get all rooms for a specific hotel
export async function getOwnerRooms(req, res) {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth().userId });

    if (!hotelData) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate(
      "hotel"
    );

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}

// API to toggle room availability
export async function toggleRoomAvailability(req, res) {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    room.isAvailable = !room.isAvailable;

    await room.save();

    res
      .status(201)
      .json({ success: true, message: "Room availability updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}
