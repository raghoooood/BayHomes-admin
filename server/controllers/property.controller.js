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

const getAllProperties = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
    propId_like = "",
  } = req.query;

  const query = {};

  if (propertyType !== "") {
    query.propertyType = propertyType;
  }

  if (title_like || propId_like) {
    query.$or = [];
    if (title_like) {
      query.$or.push({ title: { $regex: title_like, $options: "i" } });
    }
    if (propId_like) {
      query.$or.push({ propId: { $regex: propId_like, $options: "i" } });
    }
  }

  

  console.log("Constructed Query:", JSON.stringify(query, null, 2));

  try {
    const count = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .limit(Number(_end) - Number(_start))
      .skip(Number(_start))
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getPropertyDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await Property.findOne({ _id: id }).populate("creator").populate("area");

  if (propertyExists) {
    res.status(200).json(propertyExists);
  } else {
    res.status(404).json({ message: "Property not found" });
  }
};


const generatePropId = async (propertyType) => {
  const typeInitials = {
    apartment: 'A',
    villa: 'V',
    office: 'O',
    shop: 'S',
    warehouse: 'W',
    townhouse: 'T',
    penthouse: 'P',
    duplex: 'D',
    studio: 'ST',
    chalet: 'C',
  };

  const initial = typeInitials[propertyType];
  if (!initial) {
    throw new Error(`Invalid property type: ${propertyType}`);
  }

  // Find the latest property of the same type
  const latestProperty = await Property.findOne({ propertyType })
    .sort({ propId: -1 }) // Sort by `propId` descending
    .exec();

  if (latestProperty && latestProperty.propId) {
    // Extract the numeric part and increment
    const currentNumber = parseInt(latestProperty.propId.slice(1)) || 0;
    const newNumber = currentNumber + 1;
    return `${initial}${newNumber.toString().padStart(2, '0')}`; // E.g., A01, V02
  }

  // If no property of this type exists, start with 01
  return `${initial}01`;
};

const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      location,
      price,
      propImages,
      backgroundImage,
      email,
      numOfbathrooms,
      numOfrooms,
      size,
      features,
      permitNo,
      areaName,
      purpose,
      furnishingType,
      classification,
      featured,
      projectName,
      barcode,
      status,
    } = req.body;

    

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    const areana = await Area.findOne({ areaName }).session(session);

    if (!user) throw new Error("User not found");
    if (!areana) throw new Error(`Area '${areaName}' not found`);

    if (!propImages || !Array.isArray(propImages)) {
      throw new Error("images must be an array");
    }

    // Generate propId dynamically
    const propId = await generatePropId(propertyType);

    // Upload all photos to Cloudinary
    const uploadedImages = await Promise.all(
      propImages.map(image => cloudinary.uploader.upload(image))
    );

    // Extract URLs from the uploaded photos
    const imageUrls = uploadedImages.map(image => image.url);

     // Upload a single photo to Cloudinary
     const uploadedImage = await cloudinary.uploader.upload(barcode);
  
     // Extract the URL from the uploaded photo
     const imageUrl = uploadedImage.url;

      // Upload bacground images to Cloudinary
    const uploadedBackImage = await cloudinary.uploader.upload(backgroundImage);
  
    const backImageUrl = uploadedBackImage.url;

    // Create a new property with the photo URLs array
    const newProperty = await Property.create({
      propertyId: new mongoose.Types.ObjectId(),
      propId,
      title,
      description,
      propertyType,
      location,
      price,
      images:{
        propImages: imageUrls,
        backgroundImage: backImageUrl,
      }, // Store the array of URLs directly
      creator: user._id,
      numOfbathrooms,
      numOfrooms,
      size,
      features,
      permitNo,
      area: areana._id,
      purpose,
      furnishingType,
      classification,
      featured,
      projectName,
      barcode: imageUrl,
      status
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });

    areana.propertyId.push(newProperty._id);
    await areana.save({ session });


    await session.commitTransaction();

    res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      propertyType,
      location,
      price,
      propImages,
      backgroundImage,
      email,
      numOfbathrooms,
      numOfrooms,
      size,
      features,
      permitNo,
      areaName,
      purpose,
      furnishingType,
      classification,
      featured,
      projectName,
      barcode,
      status,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    // Fetch the existing property
    const existingProperty = await Property.findById(id).populate("area creator").session(session);
    if (!existingProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    // If status is provided, handle archiving logic
    if (status !== undefined) {
      const updatedProperty = await Property.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: `Property status updated to ${status}`,
        data: updatedProperty,
      });
    }

    let propId = existingProperty.propId;
    try {
      if (!propId || existingProperty.propertyType !== propertyType) {
        propId = await generatePropId(propertyType);
      }
    } catch (err) {
      console.error("Error generating propId:", err);
      throw new Error("Failed to generate propId");
    }

    const newArea = await Area.findOne({ areaName }).session(session);
    if (!newArea) {
      throw new Error("Specified area does not exist");
    }

    // If the area is changing, update the property ID in both areas
    if (!existingProperty.area.equals(newArea._id)) {
      existingProperty.area.propertyId.pull(existingProperty._id);
      await existingProperty.area.save({ session });

      newArea.propertyId.push(existingProperty._id);
      await newArea.save({ session });
    }

    // Handle propImages update
    let imageUrls = [];
    if (propImages && Array.isArray(propImages) && propImages.length > 0) {
      const newImages = propImages.filter(image => !image.startsWith("http"));
      const uploadedImages = await Promise.all(
        newImages.map(image => cloudinary.uploader.upload(image))
      );
      imageUrls = uploadedImages.map(image => image.url);
    }

    // Handle background image update
    let backImageUrl = "";
    if (backgroundImage && !backgroundImage.startsWith("http")) {
      const uploadedBackImage = await cloudinary.uploader.upload(backgroundImage);
      backImageUrl = uploadedBackImage.url;
    }

    // Handle barcode update
    let imageUrl = "";
    if (barcode && !barcode.startsWith("http")) {
      const uploadedImage = await cloudinary.uploader.upload(barcode);
      imageUrl = uploadedImage.url;
    }

    // Update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        propId,
        description,
        propertyType,
        location,
        price,
        images: {
          propImages: imageUrls.length > 0 ? imageUrls : existingProperty.images.propImages,
          backgroundImage: backImageUrl || existingProperty.images.backgroundImage,
        },
        numOfbathrooms,
        numOfrooms,
        size,
        features,
        permitNo,
        purpose,
        furnishingType,
        classification,
        featured,
        projectName,
        barcode: imageUrl || existingProperty.barcode,
        area: newArea._id,
      },
      { new: true }
    ).session(session);

    // Update the creator field in the property and push to the user's allProperties field
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new Error("User not found");
    }

    user.allProperties.push(updatedProperty._id);
    await user.save({ session });

    updatedProperty.creator = user._id;
    await updatedProperty.save({ session });

    // Optionally, delete old images from Cloudinary
    if (imageUrls.length > 0) {
      const oldImages = existingProperty.images.propImages.filter(image => !propImages.includes(image));
      await Promise.all(oldImages.map(image => {
        const publicId = getPublicIdFromUrl(image);
        return cloudinary.uploader.destroy(publicId);
      }));
    }

    res.status(200).json({ message: "Property updated successfully", updatedProperty });
    await session.commitTransaction();
    session.endSession();

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


 const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the property to delete and populate the creator
    const propertyToDelete = await Property.findById(id).populate("creator area");
    if (!propertyToDelete) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Start a session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

     // Extract public IDs of all images from Cloudinary URLs
     const propImagePublicIds = propertyToDelete.images.propImages.map(getPublicIdFromUrl);
     const backgroundImagePublicId = getPublicIdFromUrl(propertyToDelete.images.backgroundImage);
     const barcodePublicId = getPublicIdFromUrl(propertyToDelete.barcode);

    try {
      // Remove the property and update the creator's allProperties
      await propertyToDelete.remove({ session });
      propertyToDelete.creator.allProperties.pull(propertyToDelete._id);
      await propertyToDelete.creator.save({ session });

      propertyToDelete.area.propertyId.pull(propertyToDelete._id);
      await propertyToDelete.area.save({ session });

       // Delete images from Cloudinary
       await Promise.all([
        ...propImagePublicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
        cloudinary.uploader.destroy(backgroundImagePublicId),
        cloudinary.uploader.destroy(barcodePublicId),
      ]);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Respond with success
      res.status(200).json({ message: "Property deleted successfully" });
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
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};
