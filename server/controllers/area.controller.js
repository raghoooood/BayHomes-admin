import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import Area from "../mongodb/models/Area.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllAreas = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    areaName = "",
  } = req.query;

  const query = {};

  if (areaName !== "") {
    query.areaName = areaName;
  }

  try {
    const count = await Area.countDocuments({ query });

    const areas = await Area.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAreaDetail = async (req, res) => {
  const { id } = req.params;
  const areaExists = await Area.findOne({ _id: id }).populate(
    "creator",
  );
  if (areaExists) {
    res.status(200).json(areaExists);
  } else {
    res.status(404).json({ message: "Property not found" });
  }
};

const createArea = async (req, res) => {
    try {
      const {
        areaName,
        description,
        features,
        image,
        location,
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
      const newArea = await Area.create({
        areaId: new mongoose.Types.ObjectId(),
        areaName,
        description,
        features,
        image: imageUrl,
        location,
        creator: user._id,
        propertyId: [] // Empty array initially, properties can be pushed later
      });
  
      user.allAreas.push(newArea._id);
      await user.save({ session });

      await session.commitTransaction();
  
      res.status(200).json({ message: "Area created successfully", area: newArea });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

 

/* const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      areaName,
      description,
      features,
      image,
      location,
    } = req.body;
      
  
      const uploadedImage = await cloudinary.uploader.upload(image);
  
      // Extract the URL from the uploaded photo
      const imageUrl = uploadedImage.url;

    await Area.findByIdAndUpdate(
      { _id: id },
      {
        areaName,
        description,
        features,
        image: imageUrl,
        location,
      },
    );

    res.status(200).json({ message: "Area updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the area to delete and populate the creator
    const areaToDelete = await Area.findById(id).populate("creator").populate("propertyId");
    if (!areaToDelete) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Start a session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove the area and update the creator's allProperties
      await areaToDelete.remove({ session });
      areaToDelete.creator.allAreas.pull(areaToDelete);
      await areaToDelete.creator.save({ session });

      await areaToDelete.remove({ session });
      areaToDelete.creator.allAreas.pull(areaToDelete);
      await areaToDelete.creator.save({ session });


      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Respond with success
      res.status(200).json({ message: "Area deleted successfully" });
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
}; 
 */

const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      areaName,
      description,
      features,
      image,   // New image input (can be undefined)
      location,
    } = req.body;

    // Fetch the existing area
    const existingArea = await Area.findById(id);

    if (!existingArea) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Handle area image update
    let updatedImageUrl = existingArea.image;  // Keep the existing image by default
    if (image && !image.startsWith("http")) {
      // Only upload new images (if provided and not already a URL)
      const uploadedImage = await cloudinary.uploader.upload(image);
      updatedImageUrl = uploadedImage.url;
    }

    // Update the area with new data, and set the image if provided
    await Area.findByIdAndUpdate(
      id,
      {
        areaName,
        description,
        features,
        image: updatedImageUrl,
        location,
      },
      { new: true }
    );

    // Optionally delete old images from Cloudinary if a new image was uploaded
    if (updatedImageUrl !== existingArea.image && existingArea.image) {
      const oldImagePublicId = getPublicIdFromUrl(existingArea.image);
      await cloudinary.uploader.destroy(oldImagePublicId);
    }

    res.status(200).json({ message: "Area updated successfully" });
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



const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the area to delete and populate the creator
    const areaToDelete = await Area.findById(id).populate("creator projectId propertyId");
    if (!areaToDelete) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Start a session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Handle the deletion of the single image from Cloudinary (if it exists)
      if (areaToDelete.image) {
        const publicId = areaToDelete.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Remove the developer reference from associated projects
      if (areaToDelete.projectId && areaToDelete.projectId.length > 0) {
        for (let project of areaToDelete.projectId) {
          // Remove the developer reference from the project
          project.area = null; // Assuming developer field is stored as a single reference, adjust if it's an array
          await project.save({ session });
        }
      }

      // Remove the developer reference from associated projects
      if (areaToDelete.propertyId && areaToDelete.propertyId.length > 0) {
        for (let property of areaToDelete.propertyId) {
          // Remove the developer reference from the project
          property.area = null; // Assuming developer field is stored as a single reference, adjust if it's an array
          await property.save({ session });
        }
      }

    
      // Update the creator's allAreas
      areaToDelete.creator.allAreas.pull(areaToDelete);
      await areaToDelete.creator.save({ session });

      // Remove the area
      await areaToDelete.remove({ session });


      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Respond with success
      res.status(200).json({ message: "Area deleted successfully" });
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
};


export {
  getAllAreas,
  getAreaDetail,
  createArea,
  updateArea,
  deleteArea,
};
