import Property from "../mongodb/models/property.js";
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
    const count = await Developer.countDocuments({ query });

    const developers = await Developer.find(query)
      .limit(_end)
      .skip(_start)
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
  const developerExists = await Developer.findOne({ _id: id }).populate(
    "projectId",
  ).populate("creator");
  if (developerExists) {
    res.status(200).json(developerExists);
  } else {
    res.status(404).json({ message: "Developer not found" });
  }
};

const createDeveloper = async (req, res) => {
    try {
      const {
        developerName,
        description,
        image,
        email,
      } = req.body;
  
      const session = await mongoose.startSession();
      session.startTransaction();

      const user = await User.findOne({ email }).session(session);

  
      if (!user) throw new Error("User not found");

  
      // Upload a single photo to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image);
  
      // Extract the URL from the uploaded photo
      const imageUrl = uploadedImage.url;
  
      // Create a new area without associating it with any properties initially
      const newDeveloper = await Developer.create({
        developerId: new mongoose.Types.ObjectId(),
        developerName,
        description,
        projectId: [],
        image : imageUrl,
        creator: user._id,
      });
  
    
      user.allDevelopers.push(newDeveloper._id);
      await user.save({ session });
  
      await session.commitTransaction();
  
      res.status(200).json({ message: "Developer created successfully", developer: newDeveloper });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  



const updateDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      projectName,
      description,
      area,
      image,
      developerName,
      // Add any other fields as needed
    } = req.body;

    
      const existingDeveloper = await Developer.findById(id);

      if (!existingDeveloper) {
        return res.status(404).json({ message: "Develoepr not found" });
      }
  
      // Handle area image update
      let updatedImageUrl = existingDeveloper.image;  // Keep the existing image by default
      if (image && !image.startsWith("http")) {
        // Only upload new images (if provided and not already a URL)
        const uploadedImage = await cloudinary.uploader.upload(image);
        updatedImageUrl = uploadedImage.url;
      }

      // Update the project document in the database
      await Developer.findByIdAndUpdate(
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

     
    // Optionally delete old images from Cloudinary if a new image was uploaded
    if (updatedImageUrl !== existingDeveloper.image && existingDeveloper.image) {
      const oldImagePublicId = getPublicIdFromUrl(existingDeveloper.image);
      await cloudinary.uploader.destroy(oldImagePublicId);
    }
      res.status(200).json({ message: "Developer updated successfully"});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
};

// Helper function to extract the public ID from a Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const publicIdWithExtension = parts[parts.length - 1];
  return publicIdWithExtension.split('.')[0];
};




const deleteDeveloper = async (req, res) => {
  try {
    const { id } = req.params;

    // Start a session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the developer to delete, including associated projects and creator
      const developerToDelete = await Developer.findById(id).populate("creator projectId");

      // If developer is not found
      if (!developerToDelete) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Developer not found" });
      }

      // Delete the image from Cloudinary if it exists
      if (developerToDelete.image) {
        const publicId = developerToDelete.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Remove the developer reference from associated projects
      if (developerToDelete.projectId && developerToDelete.projectId.length > 0) {
        for (let project of developerToDelete.projectId) {
          // Remove the developer reference from the project
          project.developer = null; // Assuming developer field is stored as a single reference, adjust if it's an array
          await project.save({ session });
        }
      }

      // Safely remove references from related creator
      if (developerToDelete.creator) {
        developerToDelete.creator.allDevelopers.pull(developerToDelete._id);
        await developerToDelete.creator.save({ session });
      }

      // Remove the developer
      await developerToDelete.remove({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Developer deleted successfully" });
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction error:", error); // Log the error
      throw error;
    }
  } catch (error) {
    // Catch any other errors and respond with the error message
    console.error("Server error:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllDevelopers,
  getDeveloperDetail,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
};
