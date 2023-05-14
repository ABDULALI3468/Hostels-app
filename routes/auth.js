import express from "express";
import { login, register, logout, toggleActive } from "../controllers/auth.js";

const router = express.Router();

router.post("/toggleActive/:id", toggleActive);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
