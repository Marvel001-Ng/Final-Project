const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetypeIsImage = file.mimetype.startsWith("image/");
    const extensionIsAllowed = allowedExtensions.includes(ext);

    if (mimetypeIsImage || extensionIsAllowed) {
      cb(null, true);
    } else {
      cb(new Error(`Only jpg, png, and webp images are allowed (got ${file.mimetype})`));
    }
  },
});

module.exports = upload;