// src/config/categoryConfig.js
// ✅ This is the MASTER config for all product types
// Add any new category here and it will automatically work everywhere

const categoryConfig = {

  // ========== FASHION ==========
  "Men": {
    subCategories: ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"],
    attributes: {
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      hasSizes: true,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  "Women": {
    subCategories: ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories", "Bags"],
    attributes: {
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      hasSizes: true,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  "Kids": {
    subCategories: ["Topwear", "Bottomwear", "Footwear", "School", "Toys"],
    attributes: {
      sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y", "9-10Y"],
      hasSizes: true,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== FOOTWEAR ==========
  "Footwear": {
    subCategories: ["Slippers", "Sneakers", "Formal Shoes", "Sandals", "Boots", "Sports Shoes"],
    attributes: {
      sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
      hasSizes: true,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== BEAUTY & FRAGRANCE ==========
  "Perfumes": {
    subCategories: ["Men Perfume", "Women Perfume", "Unisex", "Body Spray", "Deodorant"],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: false,
      hasMlOptions: true,
      mlOptions: ["15ml", "30ml", "50ml", "75ml", "100ml", "150ml", "200ml", "250ml"],
    }
  },

  "Beauty": {
    subCategories: ["Skincare", "Makeup", "Haircare", "Nailcare", "Face Wash", "Moisturizer"],
    attributes: {
      sizes: ["Small", "Medium", "Large"],
      hasSizes: false,
      hasColors: false,
      hasMlOptions: true,
      mlOptions: ["30ml", "50ml", "100ml", "150ml", "200ml", "250ml", "500ml"],
    }
  },

  // ========== ELECTRONICS ==========
  "Electronics": {
    subCategories: [
      "Mobile Phones",
      "Laptops",
      "Tablets",
      "Headphones",
      "Earbuds",
      "Smart Watches",
      "Cameras",
      "Gaming",
      "Accessories"
    ],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== TOYS ==========
  "Toys": {
    subCategories: [
      "Action Figures",
      "Board Games",
      "Educational",
      "Outdoor",
      "Stuffed Animals",
      "Remote Control",
      "Puzzles",
      "Art & Craft"
    ],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== HOME & LIVING ==========
  "Home & Living": {
    subCategories: [
      "Furniture",
      "Kitchen",
      "Bedding",
      "Decor",
      "Lighting",
      "Storage",
      "Bathroom",
      "Garden"
    ],
    attributes: {
      sizes: ["Small", "Medium", "Large", "XL"],
      hasSizes: false,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== SPORTS ==========
  "Sports": {
    subCategories: [
      "Cricket",
      "Football",
      "Badminton",
      "Gym & Fitness",
      "Swimming",
      "Cycling",
      "Running",
      "Outdoor Sports"
    ],
    attributes: {
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      hasSizes: true,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== GROCERIES ==========
  "Groceries": {
    subCategories: [
      "Fruits & Vegetables",
      "Dairy",
      "Bakery",
      "Beverages",
      "Snacks",
      "Spices",
      "Frozen Food",
      "Canned Food"
    ],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: false,
      hasMlOptions: true,
      mlOptions: ["100g", "250g", "500g", "1kg", "2kg", "5kg", "250ml", "500ml", "1L", "2L"],
    }
  },

  // ========== BOOKS ==========
  "Books": {
    subCategories: [
      "Fiction",
      "Non-Fiction",
      "Educational",
      "Children Books",
      "Comics",
      "Religion",
      "Science",
      "History"
    ],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: false,
      hasMlOptions: false,
    }
  },

  // ========== AUTOMOTIVE ==========
  "Automotive": {
    subCategories: [
      "Car Accessories",
      "Bike Accessories",
      "Car Care",
      "Tools",
      "Lights",
      "Tyres"
    ],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== FOOD ==========
  "Food": {
    subCategories: [
      "Pakistani Food",
      "Fast Food",
      "Desserts",
      "Breakfast",
      "Healthy",
      "Sweets",
      "Dry Fruits"
    ],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: false,
      hasMlOptions: true,
      mlOptions: ["100g", "250g", "500g", "1kg", "2kg", "Small Pack", "Large Pack"],
    }
  },

  // ========== JEWELRY ==========
  "Jewelry": {
    subCategories: [
      "Rings",
      "Necklaces",
      "Earrings",
      "Bracelets",
      "Watches",
      "Anklets"
    ],
    attributes: {
      sizes: ["Free Size", "S", "M", "L"],
      hasSizes: false,
      hasColors: true,
      hasMlOptions: false,
    }
  },

  // ========== STATIONERY ==========
  "Stationery": {
    subCategories: [
      "Pens & Pencils",
      "Notebooks",
      "Art Supplies",
      "Office Supplies",
      "School Supplies"
    ],
    attributes: {
      sizes: [],
      hasSizes: false,
      hasColors: true,
      hasMlOptions: false,
    }
  },

};

export default categoryConfig;