import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { username, email } = req.body;

  // Check if username is already taken
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(409).json({ message: "Username is already taken" });
  }

  // Check if email is already taken
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({ message: "Email is already taken" });
  }

  try {
    if (req.body.type === "manager") {
      const hostel = await Hostel.findById(req.body.hostelId);
      if (hostel.managerId) {
        return res.status(400).send("There is already a manager in this hostel.");
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
      ...req.body,
      ...(req.body.type !== "user" ? { isSeller: true } : { isSeller: false }),
      password: hash,
    });

    const newUser = await user.save();

    if (newUser.type === "manager") {
      await Hostel.findByIdAndUpdate(req.body.hostelId, { $set: { managerId: newUser._id } }, { new: true });
    }

    res.status(200).json({ message: "User has been created." });
  } catch (err) {
    // next(err);
    res.send(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username, type: req.body.type });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign({ id: user._id, type: user.type, active: user.active, isSeller: user.isSeller }, process.env.JWT);

    const { password, type, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, type, message: 'Login Successfull!' });
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
export const toggleActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.active = !user.active;
    await user.save();
    res.status(200).json({ message: "Active status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
