import express from "express"; // serve as a framework to create the api
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import "dotenv/config";
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

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

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Server is ready"));
}

mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 2, // Minimum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // Timeout for selecting a server
    socketTimeoutMS: 45000, // Timeout for socket operations
    family: 4 // Use IPv4, skip trying IPv6
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    app.listen(process.env.PORT || 3001, () =>
      console.log(`🚀 Server is running on port ${process.env.PORT || 3001}`)
    );
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit the process with failure
  });
