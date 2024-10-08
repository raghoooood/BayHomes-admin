import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
  allProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  allAreas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Area"}],
  allProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project"}],
  allDevelopers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer"}],

});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
