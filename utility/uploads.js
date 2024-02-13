const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/project/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100000 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.includes("png") ||
      file.mimetype.includes("jpeg") ||
      file.mimetype.includes("jpg")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG && JPG && JPEG accepted!"));
    }
  },
});

module.exports = { upload };
