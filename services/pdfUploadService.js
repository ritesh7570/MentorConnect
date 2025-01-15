const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Configure multer for handling .pdf and similar file types
const pdfStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/allPDF");
    try {
      await fs.mkdir(uploadPath, { recursive: true }); // Ensure the folder exists
      cb(null, uploadPath); // Save the file to this path
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`); // Generate a unique filename
  },
});

// File filter to allow only .pdf and similar files
const pdfFileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only PDF and Word documents are allowed."));
  }
  cb(null, true);
};

// Initialize multer upload middleware
const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Function to handle file upload
async function handlePdfUpload(file) {
  const filePath = path.join("/allPDF", file.filename); // Relative path for the uploaded file
  return {
    url: filePath, // Path to the file
    filename: file.filename, // File name
  };
}

module.exports = { pdfUpload, handlePdfUpload };
