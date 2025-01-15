const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger")("deleteImageService");

// Environment Configuration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Utility function to delete a file from Cloudinary
async function deleteFromCloudinary(publicId) {
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  
  if (!cloudinary.config().cloud_name) {
    throw new Error("Cloudinary not configured. Ensure cloud_name, api_key, and api_secret are set.");
  }

  try {
    console.info(`Deleting file from Cloudinary with public ID: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new Error(
        `Failed to delete file from Cloudinary: ${result.result}`
      );
    }
    console.info(
      `Successfully deleted file from Cloudinary with public ID: ${publicId}`
    );
  } catch (error) {
    console.error(
      `Error deleting file from Cloudinary with public ID: ${publicId}`,
      error
    );
    throw new Error("Error deleting file from Cloudinary.");
  }
}

// Utility function to delete a file from local storage
function deleteFromLocal(filePath) {
  try {
    const uploadFolder = "public";
    const absoluteFilePath = path.resolve(
      uploadFolder,
      filePath.startsWith("/") ? filePath.slice(1) : filePath
    );

    console.info(
      `Deleting file from local storage at path: ${absoluteFilePath}`
    );
    if (!fs.existsSync(absoluteFilePath)) {
      throw new Error("File does not exist in local storage.");
    }
    fs.unlinkSync(absoluteFilePath);
    console.info(
      `Successfully deleted file from local storage at path: ${absoluteFilePath}`
    );
  } catch (error) {
    console.error(
      `Error deleting file from local storage at path: ${filePath}`,
      error
    );
    throw new Error("Error deleting file from local storage.");
  }
}

// Service to delete an image based on STORAGE_TYPE
// async function deleteImage(image) {
//   const storageType = process.env.STORAGE_TYPE || "local";

//   if (!image) {
//     console.warn("No image provided for deletion.");
//     return;
//   }

//   try {
//     if (storageType === "cloudinary" && image.publicId) {
//       await deleteFromCloudinary(image.publicId);
//     } else if (storageType === "local" && image.url) {
//       // Directly pass the relative file path to deleteFromLocal
//       deleteFromLocal(image.url);
//     } else {
//       console.warn(
//         "Unsupported storage type or missing image data for deletion."
//       );
//     }
//   } catch (error) {
//     console.error(`Failed to delete image: ${error.message}`, error);
//     throw error; // Re-throw the error for upstream handling
//   }
// }

async function deleteImage(image) {
  if (!image) {
    console.warn("No image provided for deletion.");
    return;
  }

  try {
    // Determine the storage type based on the image URL
    const isCloudinary = image.url.startsWith("https://res.cloudinary.com/");
    const isLocal = image.url.startsWith("/uploads/");

    if (isCloudinary && image.publicId) {
      await deleteFromCloudinary(image.publicId);
    } else if (isLocal) {
      deleteFromLocal(image.url);
    } else {
      console.warn(
        "Unsupported storage type or missing image data for deletion."
      );
    }
  } catch (error) {
    console.error(`Failed to delete image: ${error.message}`, error);
    throw error; // Re-throw the error for upstream handling
  }
}

module.exports = { deleteImage };
