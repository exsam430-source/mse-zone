import userModel from "../models/userModel.js";

// ------------------ ADD TO CART ------------------
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, color, volume } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    const sizeKey = size || "defaultSize";
    const colorKey = color || "defaultColor";
    const volumeKey = volume || "defaultVolume";

    if (!cartData[itemId]) cartData[itemId] = {};
    if (!cartData[itemId][sizeKey]) cartData[itemId][sizeKey] = {};
    if (!cartData[itemId][sizeKey][colorKey]) cartData[itemId][sizeKey][colorKey] = {};
    if (!cartData[itemId][sizeKey][colorKey][volumeKey])
      cartData[itemId][sizeKey][colorKey][volumeKey] = { quantity: 0 };

    cartData[itemId][sizeKey][colorKey][volumeKey].quantity += 1;

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------ UPDATE CART ------------------
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, color, volume, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    const sizeKey = size || "defaultSize";
    const colorKey = color || "defaultColor";
    const volumeKey = volume || "defaultVolume";

    if (!cartData[itemId]) cartData[itemId] = {};
    if (!cartData[itemId][sizeKey]) cartData[itemId][sizeKey] = {};
    if (!cartData[itemId][sizeKey][colorKey]) cartData[itemId][sizeKey][colorKey] = {};

    if (quantity > 0) {
      cartData[itemId][sizeKey][colorKey][volumeKey] = { quantity };
    } else {
      delete cartData[itemId][sizeKey][colorKey][volumeKey];

      if (Object.keys(cartData[itemId][sizeKey][colorKey]).length === 0)
        delete cartData[itemId][sizeKey][colorKey];
      if (Object.keys(cartData[itemId][sizeKey]).length === 0)
        delete cartData[itemId][sizeKey];
      if (Object.keys(cartData[itemId]).length === 0)
        delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------ GET USER CART ------------------
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    // Cleanup empty nodes
    for (const itemId in cartData) {
      const sizes = cartData[itemId];
      for (const sizeKey in sizes) {
        const colors = sizes[sizeKey];
        for (const colorKey in colors) {
          const volumes = colors[colorKey];
          for (const volumeKey in volumes) {
            if (!volumes[volumeKey] || typeof volumes[volumeKey] !== "object") {
              delete volumes[volumeKey];
            }
          }
          if (Object.keys(colors[colorKey]).length === 0) delete colors[colorKey];
        }
        if (Object.keys(sizes[sizeKey]).length === 0) delete sizes[sizeKey];
      }
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    }

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
