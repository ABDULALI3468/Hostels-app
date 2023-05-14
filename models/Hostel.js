import mongoose from "mongoose";
const HostelSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  cat: {
    type: String,
    enum: ["boys hostel", "girls hostel"],
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "Pakistan",
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    max: 3,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  rooms: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  hostel_size: {
    type: String,
  },
  rent_period: {
    type: String,
    enum: ["per night", "per week", "every 2 weeks", "per month", "per 2 months", "per 6 months", "annualy"],
  },
  condition: {
    type: String,
    enum: ["furnished", "semi-furnished", "not-furnished"],
  },
  mess: {
    type: String,
    enum: ["mess included", "mess not-included"],
  },
  floors: {
    type: String,
  },

  general_facilities: {
    electricity_backup: Boolean,
    security_cameras: Boolean,
    wifi: Boolean,
    breakfast: Boolean,
    lunch: Boolean,
    dinner: Boolean,
    geyser: Boolean,
    attach_bath: Boolean,
    cupboard: Boolean,
    parking: Boolean,
    tv_lounge: Boolean,
    internet: Boolean,
    telephone: Boolean,
    security_guard: Boolean,
    kitchen: Boolean,
    doorman: Boolean,
    safety_fire: Boolean,
    garden: Boolean,
    washer: Boolean,
    fridge: Boolean,
    oven: Boolean,
    air_cooler: Boolean,
    roof_top: Boolean,
    outdoor_sitting: Boolean,
    laundry: Boolean,
    heating: Boolean,
    pool: Boolean,
    gym: Boolean,
    non_smooking: Boolean,
    pets_allowed: Boolean,
  },
});

export default mongoose.model("Hostel", HostelSchema);
