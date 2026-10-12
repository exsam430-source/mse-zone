import fs from "fs";
import path from "path";
import productModel from "../models/productModel.js";

// Helper to delete local images
const deleteLocalImages = (images) => {
  if (!images || images.length === 0) return;
  images.forEach((imgPath) => {
    const fullPath = path.join(process.cwd(), imgPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });
};

// ✅ Add Product Function with Dynamic Fields & WhatsApp configuration
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      mlOptions,
      bestseller,
      longDescription,
      attributes,
      productType,
      stock,
      brand,
      whatsappNumber, // ✅ Extract WhatsApp field
    } = req.body;

    // Validate WhatsApp number input
    if (!whatsappNumber || whatsappNumber.trim() === "") {
      return res.json({ success: false, message: "A contact WhatsApp number is required for product confirmation" });
    }

    // Collect uploaded files
    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];
    const images = [image1, image2, image3, image4].filter(Boolean);

    // Store local paths
    const imagePaths = images.map(
      (item) => `Images/ProductImages/${item.filename}`
    );

    const parsedSizes = sizes ? JSON.parse(sizes) : [];
    const parsedColors = colors ? JSON.parse(colors) : [];
    const parsedMl = mlOptions ? JSON.parse(mlOptions) : [];

    let parsedAttributes = {};
    if (attributes) {
      try {
        parsedAttributes = JSON.parse(attributes);
      } catch (err) {
        parsedAttributes = {};
      }
    }

    let parsedLongDescription = {};
    if (longDescription) {
      try {
        parsedLongDescription = JSON.parse(longDescription);
      } catch (err) {
        parsedLongDescription = {};
      }
    }

    const productData = {
      name,
      description,
      price: Number(price),
      images: imagePaths,
      category,
      subCategory,
      sizes: parsedSizes,
      colors: parsedColors,
      mlOptions: parsedMl,
      attributes: parsedAttributes,
      productType: productType || "",
      stock: Number(stock) || 0,
      brand: brand || "",
      bestseller: bestseller === "true",
      whatsappNumber: whatsappNumber.replace(/[\s\+\-\(\)]/g, ""), // ✅ Sanitize number inputs
      longDescription: {
        overview: parsedLongDescription.overview || "",
        highlights: parsedLongDescription.highlights || [],
        specifications: parsedLongDescription.specifications || [],
        directions: parsedLongDescription.directions || "",
        keyFeatures: parsedLongDescription.keyFeatures || [],
        importantInfo: parsedLongDescription.importantInfo || "",
        productDetails: parsedLongDescription.productDetails || "",
      },
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Uploaded Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (!product)
      return res.json({ success: false, message: "Product not found" });

    deleteLocalImages(product.images);
    await productModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getLatestImages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const products = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("name description images");

    const updatedProducts = products.map((prod) => ({
      ...prod._doc,
      images: prod.images.map((img) => `/Images/ProductImages/${img}`),
    }));

    res.status(200).json({ success: true, products: updatedProducts });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch latest images" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    const subCategories = await productModel.distinct("subCategory");
    const productTypes = await productModel.distinct("productType");

    res.json({
      success: true,
      categories,
      subCategories,
      productTypes,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  getLatestImages,
  getCategories,
};