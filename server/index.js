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

// Configure CORS
const corsOptions = {
  origin: ["https://bay-homes-admin.vercel.app"], // Add your dashboard's URL here
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/areas", areaRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/developers", developerRouter);

// Register the new XML feed routes
app.use("/api/feed", xmlFeedRouter);

const startServer = async () => {
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
