import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import areaRouter from "./routes/area.routes.js";
import projectRouter from "./routes/project.routes.js";
import developerRouter from "./routes/developer.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/areas", areaRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/developers", developerRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL, {
      dbName: 'bay-homes'
    });

    app.listen(8080, () =>
      console.log("Server started on port http://localhost:8080"),
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
