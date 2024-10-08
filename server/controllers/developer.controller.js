import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import Developer from "../mongodb/models/developer.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Project from "../mongodb/models/project.js";

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
        projectName,
        image,
        email,
      } = req.body;
  
      const session = await mongoose.startSession();
      session.startTransaction();

      const user = await User.findOne({ email }).session(session);

  
      if (!user) throw new Error("User not found");

      const project = await Project.findOne({ projectName}).session(session);;
  
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
  
    
      user.getAllDevelopers.push(newDeveloper._id);
      await user.save({ session });
  
      await session.commitTransaction();
  
      res.status(200).json({ message: "Developer created successfully", developer: newDeveloper });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

/*  const updateDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        developerName,
        description,
        projectName,
        image,
    } = req.body;
      
  
      const uploadedImage = await cloudinary.uploader.upload(image);
  
      // Extract the URL from the uploaded photo
      const imageUrl = uploadedImage.url;

    await Developer.findByIdAndUpdate(
      { _id: id },
      {
        developerName,
        description,
        projectName,
        image: imageUrl,
      },
    );

    res.status(200).json({ message: "Developer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

const updateDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        developerName,
        description,
        projectName,
        image,
    } = req.body;

    // Start a session to handle transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the existing developer
      const existingDeveloper = await Developer.findById(id).session(session);
      if (!existingDeveloper) throw new Error("Developer not found");

      // Delete old image from Cloudinary if a new image is provided
      if (image && existingDeveloper.image) {
        const publicId = existingDeveloper.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload the new image to Cloudinary
      let imageUrl = existingDeveloper.image;
      if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image);
        imageUrl = uploadedImage.url;
      }

      // Update the developer document in the database
      const updatedDeveloper = await Developer.findByIdAndUpdate(
        id,
        {
          developerName,
          description,
          projectName,
          image: imageUrl,
        },
        { new: true }
      ).session(session);

      if (!updatedDeveloper) throw new Error("Developer update failed");

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Developer updated successfully", data: updatedDeveloper });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* const deleteDeveloper = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the developer to delete and populate the projectId
    const developerToDelete = await Developer.findById(id).populate("projectId");
    if (!developerToDelete) {
      return res.status(404).json({ message: "Developer not found" });
    }

    // Start a session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove the developer within the transaction
      await developerToDelete.remove({ session });

      // Check if projectId and developer list exist before modifying
      if (developerToDelete.projectId && developerToDelete.projectId.developer) {
        developerToDelete.projectId.developer.pull(developerToDelete._id);
        await developerToDelete.projectId.save({ session });
      }

      await developerToDelete.remove({ session });
      developerToDelete.creator.allDevelopers.pull(developerToDelete);
      await developerToDelete.creator.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Respond with success
      res.status(200).json({ message: "Developer deleted successfully" });
    } catch (transactionError) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
  } catch (error) {
    // Catch any other errors and respond with the error message
    res.status(500).json({ message: error.message });
  }
}; */

const deleteDeveloper = async (req, res) => {
  try {
    const { id } = req.params;

    // Start a session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the developer to delete
      const developerToDelete = await Developer.findById(id).populate("projectId").session(session);
      if (!developerToDelete) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Developer not found" });
      }

      // Delete the image from Cloudinary
      if (developerToDelete.image) {
        const publicId = developerToDelete.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Remove references from related projects if necessary
      if (developerToDelete.projectId) {
        developerToDelete.projectId.developer.pull(developerToDelete._id);
        await developerToDelete.projectId.save({ session });
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
      throw error;
    }
  } catch (error) {
    // Catch any other errors and respond with the error message
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
