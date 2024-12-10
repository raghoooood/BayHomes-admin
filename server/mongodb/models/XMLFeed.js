import mongoose from "mongoose";

const xmlFeedSchema = new mongoose.Schema({
  feedData: {
    type: Array,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

const XmlFeed = mongoose.model("XmlFeed", xmlFeedSchema);

export default XmlFeed;
