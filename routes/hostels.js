import express from "express";
import { countByCity, countByType, createHostel, deleteHostel, getHostel, getHostelRooms, getHostels, updateHostel, getHostelsByOwner } from "../controllers/hostel.js";
import Hostel from "../models/Hostel.js";
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/", verifyAdmin, createHostel);
router.put("/:id", verifyAdmin, updateHostel);
router.delete("/:id", verifyAdmin, deleteHostel);
router.get("/find/:id", getHostel);
router.get("/", getHostels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHostelRooms);
router.get("/getHostelsByOwner", verifyToken, getHostelsByOwner);

export default router;
