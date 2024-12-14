
import XmlFeed from ".././../mongodb/models/XMLFeed.js";  // Import the model

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
  
  
  
  
  
export { serveFeed}