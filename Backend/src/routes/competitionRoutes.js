import express from "express";
import multer from "multer";
import { registerCompetition, checkRegistrationStatus, uploadProposal } from "../controllers/competitionController.js";
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

router.post(
    "/upload-proposal",
    authMiddleware,
    upload.single("file"),
    uploadProposal
);

export default router;