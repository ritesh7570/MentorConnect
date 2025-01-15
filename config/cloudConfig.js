const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Debugging: Log configuration initialization
console.log("Initializing storage configuration...");

// Read storage type from environment variable
const storageType = process.env.STORAGE_TYPE || "local";

// Configure Cloudinary only if storage type is 'cloudinary'
let storage;
if (storageType === "cloudinary") {
  console.log("Using Cloudinary for storage.");

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  // Ensure environment variables are loaded
  if (
    !process.env.CLOUD_NAME ||
    !process.env.CLOUD_API_KEY ||
    !process.env.CLOUD_API_SECRET
  ) {
    console.error(
      "Error inside cloudConfig file: Missing Cloudinary configuration in environment variables."
    );
    throw new Error("Cloudinary configuration is incomplete.");
  }

  // Define Cloudinary storage
  const uploadFolder = process.env.CLOUD_FOLDER || "connexus_dev";
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: uploadFolder,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  // Debugging: Log Cloudinary storage details
  console.log("'Cloudinary' storage configured successfully.");
  console.log("Images will be uploaded to the folder:-> ", uploadFolder);
} else if (storageType === "local") {
  console.log("Using local storage.");

  // Define local storage
  const uploadFolder =
    process.env.LOCAL_UPLOAD_FOLDER || path.join(__dirname, "uploads");
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  // Debugging: Log local storage details
  console.log("'Local' storage configured successfully.");
  console.log("Images will be saved to the folder:->  ", uploadFolder);
} else {
  throw new Error(
    `Invalid STORAGE_TYPE: ${storageType}. Use 'local' or 'cloudinary'.`
  );
}

module.exports = { cloudinary, storage };