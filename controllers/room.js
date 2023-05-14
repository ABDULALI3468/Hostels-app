import Room from "../models/Room.js";
import Hostel from "../models/Hostel.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hostelId = req.params.hostelId;
  const newRoom = new Room({
    hostelId,
    ...req.body,
  });

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hostel.findByIdAndUpdate(hostelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};
export const updateRoom = async (req, res, next) => {
  const hostel = await Hostel.findOne({ rooms: req.params.id });

  if (!hostel) {
    return res.status(404).json({ message: "hostel not found" });
  }

  if (hostel.createdBy.toString() !== req.user.id.toString() && hostel.managerId.toString() !== req.user.id.toString()) {
    return res.status(401).json({ message: "You are not authorized to perform this action" });
  }

  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;

  const hostel = await Hostel.findOne({ rooms: req.params.id });

  if (!hostel) {
    return res.status(404).json({ message: "hostel not found" });
  }

  if (hostel.createdBy.toString() !== req.user.id.toString() && hostel.managerId.toString() !== req.user.id.toString()) {
    return res.status(401).json({ message: "You are not authorized to perform this action" });
  }

  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hostel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const bookRoom = async (req, res) => {
  const userId = req.user.id;

  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const isUserAlreadyBooked = room.status.some((status) => status.userId === userId);

  if (isUserAlreadyBooked) {
    return res.status(400).json({ error: "You have already requested for booking of this room!" });
  }

  const updatedRoom = await Room.updateOne({ _id: req.params.id }, { $push: { status: { status: "pending", userId: userId } } });
  res.json(updatedRoom);
};
export const getPendingRooms = async (req, res) => {
  const userId = req.user.id;

  try {
    const hostels = await Hostel.find({
      $or: [{ managerId: userId }, { createdBy: userId }],
    });

    const pendingRooms = [];

    for (const hostel of hostels) {
      const rooms = await Room.find({
        hostelId: hostel.id,
        status: { $elemMatch: { status: "pending" } },
      });

      for (const room of rooms) {
        const bookedBy = await User.findById(room.status[0].userId);
        pendingRooms.push([room, bookedBy]);
      }
    }

    res.json(pendingRooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
export const getUserRooms = async (req, res) => {
  const userId = req.user.id;

  try {
    const rooms = await Room.find({
      "status.userId": userId,
      "status.status": { $in: ["pending", "approved"] },
    }).populate("hostelId");

    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
export const approvePendingRequest = async (req, res) => {
  const roomId = req.params.id;
  const userId = req.body.userId;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const pendingStatusIndex = room.status.findIndex((s) => s.status === "pending" && s.userId === userId);

    if (pendingStatusIndex === -1) {
      return res.status(400).json({ error: "Room is not pending for the specified user" });
    }

    room.status[pendingStatusIndex].status = "booked";
    await Room.updateOne({ _id: roomId }, { $set: { status: room.status } });

    res.json({ message: "Room booked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// export default bookRoom;

// CREATE ROOM
// ROOM BOOK

// 1- STATUS : FROM NOT-BOOKED ------> PENDING
// 2-
