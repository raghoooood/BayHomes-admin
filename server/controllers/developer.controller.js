import Property from "../mongodb/models/property.js"; // This import seems unused
import User from "../mongodb/models/user.js";
import Developer from "../mongodb/models/developer.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllDevelopers = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    developerName = "",
  } = req.query;

  const query = {};

  if (developerName !== "") {
    query.developerName = developerName;
  }

  try {
    const count = await Developer.countDocuments(query);

    const developers = await Developer.find(query)
      .limit(parseInt(_end)) // Ensure _end is converted to an integer
      .skip(parseInt(_start)) // Ensure _start is converted to an integer
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDeveloperDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const developerExists = await Developer.findById(id)
      .populate("projectId")
      .populate("creator");

    if (developerExists) {
      res.status(200).json(developerExists);
    } else {
      res.status(404).json({ message: "Developer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDeveloper = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      developerName,
      description,
      image,
      email,
    } = req.body;

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image);
    const imageUrl = uploadedImage.url;

    const newDeveloper = await Developer.create([{
      developerId: new mongoose.Types.ObjectId(),
      developerName,
      description,
      projectId: [],
      image: imageUrl,
      creator: user._id,
    }], { session });

    user.allDevelopers.push(newDeveloper[0]._id);
    await user.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Developer created successfully", developer: newDeveloper[0] });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

const updateDeveloper = async (req, res) => {
  const { id } = req.params;
  const {
    projectName,
    description,
    area,
    image,
    developerName,
  } = req.body;

  try {
    const existingDeveloper = await Developer.findById(id);

    if (!existingDeveloper) {
      return res.status(404).json({ message: "Developer not found" });
    }

    // Handle image update
    let updatedImageUrl = existingDeveloper.image;
    if (image && !image.startsWith("http")) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      updatedImageUrl = uploadedImage.url;
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      id,
      {
        projectName,
        description,
        area,
        image: updatedImageUrl,
        developerName,
      },
      { new: true }
    );

    // Optionally delete old Cloudinary images
    if (updatedImageUrl !== existingDeveloper.image && existingDeveloper.image) {
      const oldImagePublicId = getPublicIdFromUrl(existingDeveloper.image);
      await cloudinary.uploader.destroy(oldImagePublicId);
    }

    res.status(200).json({ message: "Developer updated successfully", developer: updatedDeveloper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDeveloper = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const developerToDelete = await Developer.findById(id)
      .populate("creator projectId");

    if (!developerToDelete) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Developer not found" });
    }

    if (developerToDelete.image) {
      const publicId = getPublicIdFromUrl(developerToDelete.image);
      await cloudinary.uploader.destroy(publicId);
    }

    if (developerToDelete.projectId && developerToDelete.projectId.length > 0) {
      for (let project of developerToDelete.projectId) {
        project.developer = null;
        await project.save({ session });
      }
    }

    if (developerToDelete.creator) {
      developerToDelete.creator.allDevelopers.pull(developerToDelete._id);
      await developerToDelete.creator.save({ session });
    }

    await developerToDelete.remove({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Developer deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Helper function to extract the public ID from a Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const publicIdWithExtension = parts[parts.length - 1];
  return publicIdWithExtension.split('.')[0];
};

export {
  getAllDevelopers,
  getDeveloperDetail,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
};
