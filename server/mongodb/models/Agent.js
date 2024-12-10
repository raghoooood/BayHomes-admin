import mongoose, { Schema, models, model, Document } from 'mongoose';



const AgentSchema = new mongoose.Schema({
  agentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  employeeID: { type: String, required: true },
  adrress: { type: String },
});

const Agent = mongoose.model('Agent', AgentSchema);

export default Agent;