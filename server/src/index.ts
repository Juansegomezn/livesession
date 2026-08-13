import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tokenRouter from "./routes/tokenRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", tokenRouter);

app.listen(port, () => {
  console.log(`[server]: LiveSession Express Server running on http://localhost:${port}`);
});