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



app.use(cors()); // Apply CORS globally


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

/* const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL, {
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
 */

export default async (req, res) => {
  try {
    // Connect to the database before handling the request
    await connectDB(process.env.MONGODB_URL, { dbName: "bay-homes" });
    // Pass the request to the Express app
    app(req, res);
  } catch (error) {
    console.error("Error connecting to DB:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
};