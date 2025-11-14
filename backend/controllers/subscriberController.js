import Subscriber from "../models/Subscriber.js";

export const createSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ msg: "Already subscribed" });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({ msg: "Subscribed successfully", subscriber });
  } catch (err) {
    console.error("Error subscribing:", err);
    res.status(500).json({ msg: "Failed to subscribe" });
  }
}


