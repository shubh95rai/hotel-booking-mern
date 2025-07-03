import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// POST /api/hotels/
export async function registerHotel(req, res) {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // check if owner has already registered a hotel
    const hotel = await Hotel.findOne({ owner });

    if (hotel) {
      return res.status(400).json({
        success: false,
        message: "You already have a hotel registered",
      });
    }

    await Hotel.create({ name, address, contact, owner, city });

    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res
      .status(201)
      .json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}
