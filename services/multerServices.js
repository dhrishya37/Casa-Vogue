const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define file filter function
const fileFilter = (req, file, cb) => {
  console.log("Uploaded File Type:", file.mimetype);
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."),
      false
    );
  }
};
// Correct path to uploads inside public
const uploadDir = path.join(__dirname, "../public/uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Make sure multer saves files in the correct directory
  },
  filename: function (req, file, cb) {
    cb(null, "cropped_" + Date.now() + "_" + file.originalname);
  },
});
console.log("storage: ", storage);

// const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // Increase field size limit (10MB)
  },
});

module.exports = upload;
