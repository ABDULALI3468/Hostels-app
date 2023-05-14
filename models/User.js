import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    cnic: {
      type: String,
    },
    contact: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["user", "owner", "manager"],
      default: "user",
      required: true,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
