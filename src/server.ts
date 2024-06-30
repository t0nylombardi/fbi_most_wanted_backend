import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./api/apiRouter.js"; // Import the apiRouter

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan("combined"));

app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type"], // Allow specific headers
  })
);

// Add a simple test endpoint
app.get("/test", (req, res) => {
  res.status(404).json({ message: "Server is working" });
});

// Use the API router with the /api/v1 prefix
try {
  app.use("/api/v1", apiRouter);
} catch (error) {
  console.error("Error loading the API router", error);
}

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
