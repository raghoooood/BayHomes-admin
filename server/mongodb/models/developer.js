import mongoose from "mongoose";

const DeveloperSchema = new mongoose.Schema({
 developerId: { type: String, required: true },
 developerName: { type: String, required: true},
  description: { type: String, required: true },
  projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  image: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

 
});


const Developer = mongoose.model('Developer', DeveloperSchema);

export default Developer;