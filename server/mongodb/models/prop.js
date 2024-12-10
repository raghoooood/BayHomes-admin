import mongoose from "mongoose";


  const PropertySchema = new mongoose.Schema({
    propertyId: { type: String, required: true, unique: true},
    title: { type: String, required: true },
    size: { type: String },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    purpose: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    area: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Area' },
    project: { type:mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    developer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Developer' },
    numOfrooms: { type: Number, required: true },
    numOfbathrooms: { type: Number, required: true },
    status: { type: String, required: true },
    furnishingType: { type: String, required: true },
    classification: { type: String, required: true },
    features: [{ type: String, required: true }],
    location: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Location' },
    description: { type: String, required: true },
    featured: { type: Boolean, required: true },
    permitNo: { type: String, required: true },
    barcode: { type: String, required: true },
  });
  
  const Property =  mongoose.model('Property', PropertySchema);
  
  export default Property;