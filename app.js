import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminAuthRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/auth", adminAuthRoutes);



app.listen(3000, () => console.log("Server running on port 3000"));
