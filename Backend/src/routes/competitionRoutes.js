import express from "express";
import multer from "multer";
import { registerCompetition, checkRegistrationStatus } from "../controllers/competitionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer();

router.get("/status", authMiddleware, checkRegistrationStatus);

router.post(
    "/register",
    authMiddleware,
    upload.single("file"),
    registerCompetition
);

export default router;