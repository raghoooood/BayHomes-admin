import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import Area from "../mongodb/models/Area.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all areas with pagination and sorting
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
    const count = await Area.countDocuments(query); // Fixed the count query

    const areas = await Area.find(query)
      .limit(Number(_end))  // Ensure these are numbers
      .skip(Number(_start))
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get area details by ID
const getAreaDetail = async (req, res) => {
  const { id } = req.params;
  const areaExists = await Area.findOne({ _id: id }).populate("creator");

  if (areaExists) {
    res.status(200).json(areaExists);
  } else {
    res.status(404).json({ message: "Area not found" });
  }
};

// Create a new area
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

    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image);
    const imageUrl = uploadedImage.url;

    // Create a new area
    const newArea = await Area.create([{
      areaId: new mongoose.Types.ObjectId(),
      areaName,
      description,
      features,
      image: imageUrl,
      location,
      creator: user._id,
      propertyId: [] // Empty array initially
    }], { session });

    user.allAreas.push(newArea[0]._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Area created successfully", area: newArea });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing area
const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      areaName,
      description,
      features,
      image, // New image input (can be undefined)
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
      const uploadedImage = await cloudinary.uploader.upload(image);
      updatedImageUrl = uploadedImage.url;
    }

    // Update the area with new data
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

// Delete an existing area
const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the area to delete
    const areaToDelete = await Area.findById(id).populate("creator projectId propertyId");
    if (!areaToDelete) {
      return res.status(404).json({ message: "Area not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the image from Cloudinary
      if (areaToDelete.image) {
        const publicId = getPublicIdFromUrl(areaToDelete.image);
        await cloudinary.uploader.destroy(publicId);
      }

      // Remove references from associated properties
      for (const property of areaToDelete.propertyId) {
        property.area = null; // Remove area reference
        await property.save({ session });
      }

      // Update the creator's allAreas
      areaToDelete.creator.allAreas.pull(areaToDelete);
      await areaToDelete.creator.save({ session });

      // Remove the area
      await Area.findByIdAndRemove(id, { session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Area deleted successfully" });
    } catch (transactionError) {
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
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

export {
  getAllAreas,
  getAreaDetail,
  createArea,
  updateArea,
  deleteArea,
};
