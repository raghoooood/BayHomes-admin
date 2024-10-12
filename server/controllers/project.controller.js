import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import Area from "../mongodb/models/Area.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Project from "../mongodb/models/project.js";
import Developer from "../mongodb/models/developer.js";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get All Projects
const getAllProjects = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    projectName_like = "",
    projectType = "",
  } = req.query;

  const query = {};

  if (projectType !== "") {
    query.projectType = projectType;
  }

  if (projectName_like) {
    query.projectName = { $regex: projectName_like, $options: "i" };
  }

  try {
    const count = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Project Detail
const getProjectDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const projectExists = await Project.findOne({ _id: id })
      .populate("area")
      .populate("developer")
      .populate("creator");

    if (projectExists) {
      res.status(200).json(projectExists);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a New Project
const createProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      projectType,
      startPrice,
      size,
      rooms,
      handoverDate,
      aminities,
      inImages = [],
      outImages = [],
      backgroundImage,
      floorPlans = [],
      developerName,
      areaName,
      location,
      aboutMap,
      mapURL,
      email,
    } = req.body;

    // Generate projectId
    const projectId = new mongoose.Types.ObjectId();

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    // Check if Developer exists
    const developer = await Developer.findOne({ developerName }).session(session);
    if (!developer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Developer not found. Please create the developer first.' });
    }

    // Check if Area exists
    const area = await Area.findOne({ areaName }).session(session);
    if (!area) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Area not found. Please create the area first.' });
    }

    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    // Upload interior images to Cloudinary
    const uploadedInImages = Array.isArray(inImages)
      ? await Promise.all(inImages.map((image) => cloudinary.uploader.upload(image)))
      : [];
    const inImagesUrls = uploadedInImages.map((image) => image.url);

    // Upload exterior images to Cloudinary
    const uploadedOutImages = Array.isArray(outImages)
      ? await Promise.all(outImages.map((image) => cloudinary.uploader.upload(image)))
      : [];
    const outImagesUrls = uploadedOutImages.map((image) => image.url);

    // Upload background image to Cloudinary
    const uploadedBackImage = await cloudinary.uploader.upload(backgroundImage);
    const backImageUrl = uploadedBackImage.url;

    // Prepare Floor Plans
    const floorPlansWithImages = await Promise.all(
      floorPlans.map(async (plan) => {
        const { floorImage, numOfrooms, floorSize, floorType } = plan;

        let imageUrl = '';
        if (floorImage) {
          try {
            const uploadedImage = await cloudinary.uploader.upload(floorImage, { resource_type: 'image' });
            imageUrl = uploadedImage.url;
          } catch (uploadError) {
            console.error('Error uploading floor image:', uploadError);
          }
        }

        return {
          floorType,
          floorSize,
          floorImage: imageUrl,
          numOfrooms,
        };
      })
    );

    // Create new project document
    const newProject = new Project({
      projectId,
      projectName,
      description,
      projectType,
      startPrice: startPrice || null,
      size: size || null,
      rooms: rooms || null,
      handoverDate: handoverDate || null,
      aminities: aminities || [],
      images: {
        inImages: inImagesUrls,
        outImages: outImagesUrls,
        backgroundImage: backImageUrl,
      },
      floorPlans: floorPlansWithImages,
      area: area._id,
      developer: developer._id,
      location,
      aboutMap,
      mapURL,
      creator: user._id,
    });

    // Save the project
    await newProject.save({ session });

    // Update the Developer and Area documents
    developer.projectId.push(newProject._id);
    await developer.save({ session });

    area.projectId.push(newProject._id);
    await area.save({ session });

    user.allProjects.push(newProject._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectName,
      description,
      projectType,
      startPrice,
      size,
      rooms,
      handoverDate,
      aminities,
      inImages = [],
      outImages = [],
      backgroundImage,
      floorPlans = [],
      developerName,
      areaName,
      location,
      aboutMap,
      mapURL,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    // Fetch the existing project
    const existingProject = await Project.findById(id);

    if (!existingProject) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if Developer exists
    const developer = await Developer.findOne({ developerName }).session(session);
    if (!developer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Developer not found. Please create the developer first.' });
    }

    // Check if Area exists
    const area = await Area.findOne({ areaName }).session(session);
    if (!area) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Area not found. Please create the area first.' });
    }

    // Handle inImages update
    let inImagesUrls = existingProject.images.inImages;
    if (inImages && Array.isArray(inImages) && inImages.length > 0) {
      const newInImages = await Promise.all(inImages.map((image) => cloudinary.uploader.upload(image)));
      inImagesUrls = newInImages.map((image) => image.url);
    }

    // Handle outImages update
    let outImagesUrls = existingProject.images.outImages;
    if (outImages && Array.isArray(outImages) && outImages.length > 0) {
      const newOutImages = await Promise.all(outImages.map((image) => cloudinary.uploader.upload(image)));
      outImagesUrls = newOutImages.map((image) => image.url);
    }

    // Handle backgroundImage update
    let backImageUrl = existingProject.images.backgroundImage;
    if (backgroundImage) {
      const uploadedBackImage = await cloudinary.uploader.upload(backgroundImage);
      backImageUrl = uploadedBackImage.url;
    }

    // Prepare Floor Plans
    const updatedFloorPlans = await Promise.all(
      floorPlans.map(async (plan) => {
        const { floorImage, numOfrooms, floorSize, floorType } = plan;

        let imageUrl = '';
        if (floorImage) {
          const uploadedImage = await cloudinary.uploader.upload(floorImage, { resource_type: 'image' });
          imageUrl = uploadedImage.url;
        }

        return {
          floorType,
          floorSize,
          floorImage: imageUrl,
          numOfrooms,
        };
      })
    );

    // Update the project document
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        projectName,
        description,
        projectType,
        startPrice,
        size,
        rooms,
        handoverDate,
        aminities,
        images: {
          inImages: inImagesUrls,
          outImages: outImagesUrls,
          backgroundImage: backImageUrl,
        },
        floorPlans: updatedFloorPlans,
        area: area._id,
        developer: developer._id,
        location,
        aboutMap,
        mapURL,
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export { getAllProjects, getProjectDetail, createProject, updateProject };
