import User from "../models/User.js";

// middleware to check if user is authenticated
export default async function protect(req, res, next) {
  const { userId } = req.auth();

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }

  const user = await User.findById(userId);

  req.user = user;
  next();
}
