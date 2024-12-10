import mongoose, { Schema} from 'mongoose';


const AreaSchema = new mongoose.Schema({
  areaId: { type: String, required: true },
 features: [{ type: String, required: true }],
  areaName: { type: String, required: true},
  description: { type: String, required: true },
  location: { type:String, required: true},
  propertyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  image: { type: String, required: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]

});



const Area = mongoose.model('Area', AreaSchema);


export default Area;