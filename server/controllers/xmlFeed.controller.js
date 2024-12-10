import XmlFeed from "../mongodb/models/XMLFeed.js";  // Import the model
import Property from "../mongodb/models/property.js";

const generateFeed = async (req, res) => {
    try {
      // Fetch the property data from MongoDB
      const properties = await Property.find({ status: 'active' }).populate("area");
  
      // Check if properties are returned
      if (!properties || properties.length === 0) {
        return res.status(404).json({ message: "No properties found" });
      }
  
      // Map properties to the desired XML feed structure
      const feedItems = properties.map((property) => ({
        id: property._id,
        title: property.title || "No Title",
        description: property.description || "No Description",
        price: property.price || "No Price",
        location: {
          street: property.location.street || "No Street",
          city: property.location.city || "No City",
          URL: property.location.URL || "No URL"
        },
        images: {
          backgroundImage: property.images.backgroundImage || "No Background Image",
          propImages: property.images.propImages ? property.images.propImages.join(", ") : "No Property Images"
        },
        numOfRooms: property.numOfrooms || "No Room Data",
        numOfBathrooms: property.numOfbathrooms || "No Bathroom Data",
        size: property.size || "No Size Data",
        propertyType: property.propertyType || "No Property Type",
        area: property.area ? property.area.areaName : "No Area",
        status: property.status || "No Status",
        furnishingType: property.furnishingType || "No Furnishing Type",
        classification: property.classification || "No Classification",
        features: property.features ? property.features.join(", ") : "No Features"
      }));
  
      // Create a new XmlFeed document and save it to the database
      const newFeed = new XmlFeed({
        feedData: feedItems,
      });
  
      await newFeed.save();
  
      // Return a success message
      res.json({ message: "Feed generated and saved successfully", feed: feedItems });
    } catch (error) {
      console.error("Error generating feed:", error);
      res.status(500).json({ message: "Error generating feed", error });
    }
  };
  


const escapeXML = (str) => {
    // Ensure the value is a string before performing the replacement
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
  const serveFeed = async (req, res) => {
    try {
      // Fetch the most recent feed from the database
      const feed = await XmlFeed.findOne().sort({ generatedAt: -1 });  // Sort to get the latest feed
  
      // Check if feed exists
      if (!feed) {
        return res.status(404).json({ error: "Feed not found" });
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
  
      // Send the XML feed
      res.set("Content-Type", "application/xml");
      res.send(feedXML);
    } catch (error) {
      console.error("Error serving feed:", error);
      res.status(500).json({ error: "Error serving feed", error });
    }
  };
  
  
  
  
  
export {generateFeed , serveFeed}