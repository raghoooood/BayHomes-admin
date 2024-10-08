import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  propertyId: { type: String, required: true, unique: true , sparse: true},
  title: { type: String, required: true },
  size: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purpose: { type: String, required: true },
  propertyType: { type: String, required: true },
  price: { type: Number, required: true },
  images: {
    backgroundImage: {type: String, required: true},
    propImages: [{type: String, required: true}],
   },
  area: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Area' },
  numOfrooms: { type: Number, required: true },
  numOfbathrooms: { type: Number, required: true },
  status: { type: String, required: false },
  furnishingType: { type: String, required: true },
  classification: { type: String, required: true },
  features: [{ type: String, required: true }],
  location: { type: String, required: true,  },
  description: { type: String, required: true },
  featured: { type: Boolean, required: true },
  permitNo: { type: String, required: true },
  barcode: { type: String, required: true },
  projectName: {type: String, required: true},
  location: {
    city: { type: String, required: true },
    street: { type: String, required: false },
    URL: { type: String, required: true },
  },


});


const propertyModel = mongoose.model("Property", PropertySchema);

export default propertyModel;
