import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import areaRouter from "./routes/area.routes.js";
import projectRouter from "./routes/project.routes.js";
import developerRouter from "./routes/developer.routes.js";
import xmlFeedRouter from "./routes/properties-feed.routes.js"; // Import the XML feed routes

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000','https://www.bayhomesae.com/'], // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Allowed request headers
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions)); // Apply CORS globally

// Middleware to handle API key validation for the feed route
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];  // Extract API key from headers

  // If API key is incorrect or missing, reject the request
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Unauthorized, invalid API key" });
  }

  // If valid, move to the next middleware/route handler
  next();
};

// Apply API key validation to the XML feed route
app.use("/api/feed", validateApiKey, xmlFeedRouter);

app.use(express.json({ limit: "50mb" }));

// Test route
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

// Register other routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/areas", areaRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/developers", developerRouter);

// Register the XML feed route
app.use("/api/feed", xmlFeedRouter);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL, {
      dbName: "bay-homes",
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      console.log(`Server started on port http://localhost:${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
