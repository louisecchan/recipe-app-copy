import express from "express"; // serve as a framework to create the api
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import "dotenv/config";
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI environment variable is not defined!");
  console.error("Please set MONGO_URI in your environment variables.");
  process.exit(1);
}

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://recipe-app-copy.onrender.com"],
    methods: ["PUT", "POST", "GET", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Server is ready"));
}

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000,
};

console.log("🔄 Attempting to connect to MongoDB...");
console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`🔌 Port: ${process.env.PORT || 3001}`);

mongoose
  .connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 Server URL: http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("Full error:", error);
    console.error("\n🔍 Troubleshooting tips:");
    console.error("1. Check if MONGO_URI is set correctly in environment variables");
    console.error("2. Verify MongoDB Atlas network access allows connections from 0.0.0.0/0");
    console.error("3. Confirm database credentials are correct");
    console.error("4. Ensure special characters in password are URL-encoded\n");
    process.exit(1); // Exit the process with failure
  });
