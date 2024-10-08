import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import Area from "../mongodb/models/Area.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Project from "../mongodb/models/project.js";
import Developer from "../mongodb/models/developer.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const count = await Project.countDocuments({ query });

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

const getProjectDetail = async (req, res) => {
  const { id } = req.params;
  const projectExists = await Project.findOne({ _id: id }).populate("area").populate("developer").populate("creator");

  if (projectExists) {
    res.status(200).json(projectExists);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};


const createProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      projectType,
      startPrice, // Optional
      size, // Optional
      rooms, // Optional
      handoverDate, // Optional
      aminities, // Optional
      inImages = [], // Optional; separate for interior images
      outImages = [], // Optional; separate for exterior images
      backgroundImage,
      floorPlans = [], // Optional; default to an empty array if not provided
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

    // Upload bacground images to Cloudinary
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
          floorImage: imageUrl, // Use imageUrl obtained from Cloudinary
          numOfrooms
        };
      })
    );

    // Create new project document
    const newProject = new Project({
      projectId,
      projectName,
      description,
      projectType,
      startPrice: startPrice || null, // Set default value if not provided
      size: size || null, // Set default value if not provided
      rooms: rooms || null, // Set default value if not provided
      handoverDate: handoverDate || null, // Set default value if not provided
      aminities: aminities || [], // Default to an empty array if not provided
      images: {
        inImages: inImagesUrls,
        outImages: outImagesUrls,
        backgroundImage: backImageUrl
      },
      floorPlans: floorPlansWithImages,
      area: area._id, // Reference to the Area
      developer: developer._id, // Reference to the Developer
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






/* const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      projectName,
      description,
      projectType,
      startPrice, // Optional
      size, // Optional
      rooms, // Optional
      handoverDate, // Optional
      aminities, // Optional
      inImages = [], // Optional; separate for interior images
      outImages = [], // Optional; separate for exterior images
      backgroundImage,
      floorPlans = [], // Optional; default to an empty array if not provided
      developerName,
      areaName,
      location,
      aboutMap,
      mapURL,


    } = req.body;
    
    // Start a session to handle transactions (optional, if needed)
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

    try {
      // Find the area document by areaName
      const area = await Area.findOne({ areaName }).session(session);
      if (!area) throw new Error("Area not found");

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

  // Upload bacground images to Cloudinary
  const uploadedBackImage = await cloudinary.uploader.upload(backgroundImage);

  const backImageUrl = uploadedBackImage.url;

      // Prepare Floor Plans
    const floorPlansWithImages = await Promise.all(
      floorPlans.map(async (plan) => {
        const { floorImage, numOfrooms, floorSize, floorType } = plan;

        let imageUrl = '';
        if (floorImage) {
          try {
            console.log('Uploading image:', floorImage); // Log the base64 string
            const uploadedImage = await cloudinary.uploader.upload(floorImage, { resource_type: 'image' });
            imageUrl = uploadedImage.url;
          } catch (uploadError) {
            console.error('Error uploading floor image:', uploadError);
          }
        } else {
          console.log('No floorImage provided.');
        }

        // Return the new FloorPlans document with the projectId
        return {
          floorType,
          floorSize,
          floorImage: imageUrl, // Use imageUrl obtained from Cloudinary
          numOfrooms
        };
      })
    );

     
      // Update the project document in the database
      const updatedProject = await Project.findByIdAndUpdate(
        { _id: id },
        {
          projectName,
          description,
          projectType,
          startPrice: startPrice || null, // Set default value if not provided
          size: size || null, // Set default value if not provided
          rooms: rooms || null, // Set default value if not provided
          handoverDate: handoverDate || null, // Set default value if not provided
          aminities: aminities || [], // Default to an empty array if not provided
          images: {
            inImages: inImagesUrls,
            outImages: outImagesUrls,
            backgroundImage: backImageUrl
          },
          floorPlans: floorPlansWithImages,
          area: area._id, // Reference to the Area
          developer: developer._id, // Reference to the Developer
          location,
          aboutMap,
          mapURL,

        },
        { new: true }  // Return the updated document
      ).session(session);

      if (!updatedProject) {
        throw new Error("Project not found");
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Send a success response with the updated project
      res.status(200).json({ success: true, data: updatedProject });

    } catch (innerError) {
      // Rollback the transaction in case of an error
      await session.abortTransaction();
      session.endSession();
      throw innerError;
    }

  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}; */

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
 // Start a session to handle transactions (optional, if needed)
 const session = await mongoose.startSession();
 session.startTransaction();
    // Fetch the existing project
    const existingProject = await Project.findById(id);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

     // Check if Developer exists
 const developer = await Developer.findOne({ developerName }).session(session);
 if (!developer) {
   await session.abortTransaction();
   session.endSession();
   return res.status(400).json({ success: false, message: 'Developer not found. Please create the developer first.' });
 }

    // Handle inImages update
    let inImagesUrls = existingProject.images.inImages;
    if (inImages && Array.isArray(inImages) && inImages.length > 0) {
      const newInImages = inImages.filter(image => !image.startsWith("http"));
      const uploadedInImages = await Promise.all(
        newInImages.map((image) => cloudinary.uploader.upload(image))
      );
      const newInImageUrls = uploadedInImages.map((image) => image.url);
      inImagesUrls = [...inImages.filter(image => image.startsWith("http")), ...newInImageUrls];
    }

    // Handle outImages update
    let outImagesUrls = existingProject.images.outImages;
    if (outImages && Array.isArray(outImages) && outImages.length > 0) {
      const newOutImages = outImages.filter(image => !image.startsWith("http"));
      const uploadedOutImages = await Promise.all(
        newOutImages.map((image) => cloudinary.uploader.upload(image))
      );
      const newOutImageUrls = uploadedOutImages.map((image) => image.url);
      outImagesUrls = [...outImages.filter(image => image.startsWith("http")), ...newOutImageUrls];
    }

    // Handle background image update
    let backImageUrl = existingProject.images.backgroundImage;
    if (backgroundImage && !backgroundImage.startsWith("http")) {
      const uploadedBackImage = await cloudinary.uploader.upload(backgroundImage);
      backImageUrl = uploadedBackImage.url;
    }

    // Handle floorPlans update
    const floorPlansWithImages = await Promise.all(
      floorPlans.map(async (plan) => {
        const { floorImage, numOfrooms, floorSize, floorType } = plan;

        let imageUrl = '';
        if (floorImage && !floorImage.startsWith("http")) {
          const uploadedImage = await cloudinary.uploader.upload(floorImage, { resource_type: 'image' });
          imageUrl = uploadedImage.url;
        } else {
          imageUrl = floorImage;
        }

        return {
          floorType,
          floorSize,
          floorImage: imageUrl,
          numOfrooms,
        };
      })
    );

    // Update the project with the new data
    await Project.findByIdAndUpdate(
      { _id: id },
      {
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
        area: areaName,
        developer: developer._id,
        location,
        aboutMap,
        mapURL,
      },
      { new: true }
    );

    // Optionally, delete old images from Cloudinary
    if (inImagesUrls.length > 0) {
      const oldInImages = existingProject.images.inImages.filter(image => !inImages.includes(image));
      await Promise.all(oldInImages.map(image => {
        const publicId = getPublicIdFromUrl(image);
        return cloudinary.uploader.destroy(publicId);
      }));
    }

    if (outImagesUrls.length > 0) {
      const oldOutImages = existingProject.images.outImages.filter(image => !outImages.includes(image));
      await Promise.all(oldOutImages.map(image => {
        const publicId = getPublicIdFromUrl(image);
        return cloudinary.uploader.destroy(publicId);
      }));
    }

    res.status(200).json({ message: "Project updated successfully" });
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


 const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the property to delete and populate the creator
    const projectToDelete = await Project.findById(id);
    if (!projectToDelete) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Start a session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await projectToDelete.remove({ session });
     

      // Delete images from Cloudinary
      const deleteImagesFromCloudinary = async (urls) => {
        const publicIds = urls.map((url) => {
          const parts = url.split('/');
          const publicIdWithExtension = parts[parts.length - 1];
          return publicIdWithExtension.split('.')[0];
        });
        await Promise.all(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
      };

      if (projectToDelete.images.backgroundImage) {
        await deleteImagesFromCloudinary([projectToDelete.images.backgroundImage]);
      }

      if (projectToDelete.images.inImages) {
        await deleteImagesFromCloudinary(projectToDelete.images.inImages);
      }

      if (projectToDelete.images.outImages) {
        await deleteImagesFromCloudinary(projectToDelete.images.outImages);
      }

      if (projectToDelete.floorPlans) {
        const floorImages = projectToDelete.floorPlans
          .map((plan) => plan.floorImage)
          .filter((img) => img);
        await deleteImagesFromCloudinary(floorImages);
      }
      await projectToDelete.remove({ session });
      projectToDelete.creator.allProjects.pull(projectToDelete);
      await projectToDelete.creator.save({ session });

      projectToDelete.area.projectId.pull(projectToDelete);
      await projectToDelete.area.save({ session });

      projectToDelete.developer.projectId.pull(projectToDelete);
      await projectToDelete.developer.save({ session });



      // Commit the transaction
      await session.commitTransaction();
      session.endSession();


      // Respond with success
      res.status(200).json({ message: "Project deleted successfully" });
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
  getAllProjects,
  getProjectDetail,
  createProject,
  updateProject,
  deleteProject,
  
};
