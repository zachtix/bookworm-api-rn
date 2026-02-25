import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // const token = req.header("Authorization").replace("Bearer ", "");
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.user_id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    console.log("Error middleware protect route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
