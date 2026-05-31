import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/competition", competitionRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Mech-ONE Backend Running 🚀" });
});

const PORT = process.env.PORT || 5005;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;