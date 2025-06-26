import User from "../models/User.js";
import { Webhook } from "svix";

async function clerkWebhooks(req, res) {
  try {
    // create a svix instance with clerk webhook secret
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // getting headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // verifying headers
    await webhook.verify(JSON.stringify(req.body), headers);

    // getting data from request body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    // switch case for different events
    switch (type) {
      case "user.created":
        // creating a new user
        await User.create(userData);
        break;
      case "user.updated":
        // updating a user
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        // deleting a user
        await User.findByIdAndDelete(data.id);
        break;
      default:
        break;
    }

    res
      .status(200)
      .json({ success: true, message: "Webhook received successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export default clerkWebhooks;
