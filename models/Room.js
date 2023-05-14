import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema(
  {
    hostelId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    floor_number: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    hostelites: {
      type: [String],
    },

    status: [{ userId: String, status: { type: String, enum: ["pending", "booked"] } }],

    desc: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      max: 5,
    },
    rent_period: {
      type: String,
      enum: ["per night", "per week", "every 2 weeks", "per month", "per 2 months", "per 6 months", "annualy"],
    },
    condition: {
      type: String,
      // furnished, semi-furnished, not-furnished
    },
    mess: {
      type: Boolean,
    },
    roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],

    room_facilities: {
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
  },

  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
