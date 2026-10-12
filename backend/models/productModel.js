import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  longDescription: {
    overview: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    specifications: { type: [{ key: String, value: String }], default: [] },
    directions: { type: String, default: "" },
    keyFeatures: { type: [String], default: [] },
    importantInfo: { type: String, default: "" },
    productDetails: [{ key: String, value: String }]
  },

  price: { type: Number, required: true },
  images: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: [String], default: [] },
  colors: [
    {
      name: { type: String, required: true },
      hex: { type: String, required: true }
    }
  ],
  mlOptions: { type: [String], default: [] },
  attributes: { type: Map, of: String, default: {} },
  productType: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  brand: { type: String, default: "" },
  bestseller: { type: Boolean, required: true },

  // ✅ NEW: Individual WhatsApp Number for confirming this product's orders
  whatsappNumber: { type: String, required: true },

  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.products || mongoose.model("products", productSchema);

export default productModel;