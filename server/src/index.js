import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { configEnv } from "./config/env.js";
import { connectDB } from "./db/connect.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

configEnv();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "stackguard", time: Date.now() }));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
});
