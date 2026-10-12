import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { applyNewsletterDiscount } from "../../utils/discount";

const ProductItem = ({ id, images, name, price, backendUrl }) => {
  const { currency, newsletterDiscount } = useContext(ShopContext);

  // Ensure price is a number
  const originalPrice = Number(price) || 0;

  // Apply newsletter discount safely
  const discountedPrice = Number(applyNewsletterDiscount(originalPrice, newsletterDiscount)) || originalPrice;

  const imageArray = Array.isArray(images) ? images : [images];
  const firstImage = imageArray?.[0] ? `${backendUrl}/${imageArray[0]}` : null;

  const hasDiscount = newsletterDiscount && discountedPrice < originalPrice;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer duration-300"
    >
     <Link
  to={`/product/${id}`}
  className="block"
  onClick={() => {
    fetch(`${backendUrl}/api/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "click",
        productId: id,
        userId: user?._id || null,
        userAgent: navigator.userAgent
      })
    }).catch((err) => console.log("Click event error:", err));
  }}
>
        <div className="relative overflow-hidden group">
          {firstImage && (
            <img
              src={firstImage}
              alt={name || "product"}
              className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500 ease-out"
            />
          )}
        </div>

        <div className="p-4 text-center">
          <h3 className="text-gray-800 font-semibold text-base truncate">{name}</h3>

          {hasDiscount && (
            <p className="text-gray-600 text-sm mt-1 line-through">
              {currency}{originalPrice.toFixed(2)}
            </p>
          )}

          <p
            className={`font-bold text-sm mt-1 ${hasDiscount ? "text-green-600" : "text-gray-800"}`}
          >
            {currency}{discountedPrice.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
