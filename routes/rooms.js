import express from "express";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability, bookRoom, getPendingRooms, getUserRooms, approvePendingRequest } from "../controllers/room.js";
import { verifyUserType, verifyToken, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/getUserRooms", verifyToken, getUserRooms);
router.post("/approvePendingRequest/:id", verifyToken, approvePendingRequest);
router.post("/bookroom/:id", verifyToken, bookRoom);
router.get("/pendingRooms", verifyToken, getPendingRooms);

router.post("/:hostelId", verifyAdmin, createRoom);
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", verifyAdmin, updateRoom);
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
router.get("/:id", getRoom);
router.get("/", getRooms);

export default router;
