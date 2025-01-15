require("dotenv").config(); // Ensure dotenv is configured
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const {
  cloudinary,
  storage: cloudinaryStorage,
} = require("../config/cloudConfig");

let upload; // Define upload middleware dynamically

if (process.env.STORAGE_TYPE === "cloudinary") {
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  upload = multer({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.")
        );
      }
      cb(null, true);
    },
  });
} else {
  // Local storage configuration
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../public/uploads");
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (err) {
        cb(err, null);
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.")
        );
      }
      cb(null, true);
    },
  });
}

// Upload function
async function uploadFile(file) {
  if (process.env.STORAGE_TYPE === "cloudinary") {
    return {
      url: file.path, // Cloudinary file URL
      publicId: file.filename,
    };
  } else {
    const filePath = path.join("/uploads", file.filename); // Relative path for local file
    return {
      url: filePath,
      publicId: file.filename,
    };
  }
}

module.exports = { upload, uploadFile };
