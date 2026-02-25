import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "login successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (username.length < 3)
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    // const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    // if (existingUser) res.status(400).json({ message: "User already exists" });
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      res.status(400).json({ message: "Email already exists" });
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      res.status(400).json({ message: "Username already exists" });

    const profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${username}`;

    const user = new User({ email, username, password, profileImage });

    await user.save();

    const token = generateToken(user._id);
    // const user = await User.create({ email, username, password });
    res.status(201).json({
      message: "register successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
