import mongoose from "mongoose";


const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  aminities: [{ type: String, required: true }],
  startPrice: { type: Number, required: false },
  rooms: {
    min: { type: Number, required: false },
    max: { type: Number, required: false },
  },
  endDate: { type: Date, required: false },
  handoverDate: { type: Date, required: false },
  projectType: { type: String, required: false },
  size: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
  floorPlans: [{
    floorType: { type: String, required: false },
  floorSize: { type: String, required: false },
  floorImage: { type: String, required: false },
  numOfrooms: { type: Number, required: false },
  }],
  location: { type: String, required: false },
  aboutMap: { type: String, required: false },
  mapURL: { type: String, required: false },
   images: {
    backgroundImage: {type: String, required: true},
    outImages: [{type: String, required: false}],
    inImages: [{type: String, required: false}]
   }
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
