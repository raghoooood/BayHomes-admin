import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import areaRouter from "./routes/area.routes.js";
import projectRouter from "./routes/project.routes.js";
import developerRouter from "./routes/developer.routes.js";
import xmlFeedRouter from "./routes/properties-feed.routes.js"; // Import the XML feed routes
import connectDB from "./mongodb/connect.js";
import axios from 'axios';
import xml2js  from 'xml2js';
import XmlFeed from "./mongodb/models/XMLFeed.js";

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
// app.use("/api/feed", xmlFeedRouter)
const escapeXML = (str) => {
  if (typeof str !== 'string') {
    str = String(str); // Convert non-string values to string
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};
app.get('/xml-feed', async (req, res) => {
  try {
    // Fetch the most recent feed from the database
    const feed = await XmlFeed.findOne().sort({ generatedAt: -1 });

    if (!feed || !Array.isArray(feed.feedData)) {
      return res.status(404).json({ error: "Feed data not found or is not in the correct format" });
    }

    // Generate the XML feed
    let feedXML = `
      <feed>
        ${feed.feedData.map(property => `
          <property>
            <id>${escapeXML(property.id)}</id>
            <title>${escapeXML(property.title)}</title>
            <description>${escapeXML(property.description)}</description>
            <price>${escapeXML(property.price)}</price>
            <location>
              <street>${escapeXML(property.location.street)}</street>
              <city>${escapeXML(property.location.city)}</city>
              <url>${escapeXML(property.location.URL)}</url>
            </location>
            <images>
              <backgroundImage>${escapeXML(property.images.backgroundImage)}</backgroundImage>
              <propImages>${escapeXML(property.images.propImages)}</propImages>
            </images>
            <numOfRooms>${escapeXML(property.numOfRooms)}</numOfRooms>
            <numOfBathrooms>${escapeXML(property.numOfBathrooms)}</numOfBathrooms>
            <size>${escapeXML(property.size)}</size>
            <propertyType>${escapeXML(property.propertyType)}</propertyType>
            <area>${escapeXML(property.area)}</area>
            <status>${escapeXML(property.status)}</status>
            <furnishingType>${escapeXML(property.furnishingType)}</furnishingType>
            <classification>${escapeXML(property.classification)}</classification>
            <features>${escapeXML(property.features)}</features>
          </property>
        `).join('')}
      </feed>
    `;

    // Add XML declaration at the beginning
    feedXML = `<?xml version="1.0" encoding="UTF-8"?>\n` + feedXML;

   // Set the content type header and send XML response only once
   res.setHeader('Content-Type', 'application/xml');
   res.status(200).send(feedXML); // Ensure only one response is sent

  } catch (error) {
    console.error("Error generating XML feed:", error);
    res.status(500).json({ error: "Error generating XML feed", details: error.message });
  }
});



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
 

