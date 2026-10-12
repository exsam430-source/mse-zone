// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import ConnectDB from "./config/db.js";
import ConnectCloud from "./config/cloudinary.js";

import router from "./routes/userRouter.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import returnRouter from "./routes/returnRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS Configuration
const allowedOrigins = [
  "https://msezone.mrsolverlearninghub.com",
  "http://localhost:5173",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Trim URL spaces
app.use((req, res, next) => {
  req.url = req.url.trim();
  next();
});

// ✅ Redirect requests for external image URLs (e.g., Unsplash seed images)
app.use((req, res, next) => {
  let decodedUrl = "";
  try {
    decodedUrl = decodeURIComponent(req.url);
  } catch (err) {
    decodedUrl = req.url;
  }
  const cleanUrl = decodedUrl.startsWith('/') ? decodedUrl.slice(1) : decodedUrl;
  if (/^https?:\/\//i.test(cleanUrl)) {
    return res.redirect(cleanUrl);
  }
  next();
});

// ✅ Serve uploaded images
app.use("/Images", express.static(path.join(__dirname, "Images")));

// ✅ API Routes
app.use("/api/user", router);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/profile", profileRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/return", returnRouter);

// ✅ Connect Cloudinary safely
try {
  ConnectCloud();
} catch (cloudErr) {
  console.log("Cloudinary init warning:", cloudErr.message);
}

// ✅ Serve static compiled frontend from "dist"
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// ✅ API Health Check (Hostinger checks this)
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "MSE Zone API is running",
    distFound: fs.existsSync(distPath),
    timestamp: new Date().toISOString(),
  });
});

// ✅ SPA Fallback: Serve index.html for all page routes
app.use((req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/reviews/")) {
    return res.status(404).json({ success: false, message: "API endpoint not found" });
  }

  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.send("MSE Zone Server is active. Dist files are ready.");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Runtime Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ 1. START LISTENING IMMEDIATELY (So Hostinger sees the port alive right away)
app.listen(PORT, () => {
  console.log(`✅ Server successfully started on port ${PORT}`);
  console.log(`🌐 Live URL: https://msezone.mrsolverlearninghub.com`);
});

// ✅ 2. CONNECT DATABASE ASYNCHRONOUSLY (Never kill process if DB takes a moment)
ConnectDB()
  .then(() => {
    console.log("✅ MongoDB Connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Do NOT call process.exit(1) here so the server stays alive!
  });