// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Helper function to make sure folder exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ✅ Dynamic storage for different image types
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // default folder
    let uploadPath = path.join(process.cwd(), "Images/ProductImages");

    // You can expand this later for order/cart if needed
    if (req.baseUrl.includes("order")) {
      uploadPath = path.join(process.cwd(), "Images/OrderImages");
    } else if (req.baseUrl.includes("cart")) {
      uploadPath = path.join(process.cwd(), "Images/CartImages");
    }

    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
