import express from "express";
import multer from "multer";
import { uploadProfileDocs, getProfile, updateProfile } from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

router.post(
    "/upload",
    authMiddleware,
    upload.any(),
    uploadProfileDocs
);

export default router;