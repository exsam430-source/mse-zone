import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/Frontend/assets";
import RelatedProduct from "../../Components/Frontend/RelatedProduct";
import { applyNewsletterDiscount } from "../../utils/discount";
import ReviewSection from "../../Components/Frontend/ReviewSection";
import SEO from "../../Components/Frontend/SEO";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const {
    currency,
    addToCart,
    newsletterDiscount,
    token,
  } = useContext(ShopContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [productData, setProductData] = useState({
    images: [],
    sizes: [],
    colors: [],
    mlOptions: [],
    reviews: [],
    attributes: {},
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMl, setSelectedMl] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [allReviews, setAllReviews] = useState([]);
  const recordViewRef = useRef(false);

  // ===== FETCH PRODUCT =====
  const fetchProductData = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/product/single/${productId}`
      );
      const data = await res.json();
      if (!data.success) return;

      const product = data.product;

      const imagesArray = Array.isArray(product.images)
        ? product.images.filter(Boolean)
        : product.images
        ? [product.images]
        : [];

      // ✅ Convert attributes Map to plain object safely
      let attributesObj = {};
      if (product.attributes) {
        if (product.attributes instanceof Map) {
          product.attributes.forEach((v, k) => {
            attributesObj[k] = v;
          });
        } else {
          attributesObj = { ...product.attributes };
        }
      }

      setProductData({
        ...product,
        images: imagesArray,
        sizes: product.sizes || [],
        colors: product.colors || [],
        mlOptions: product.mlOptions || [],
        attributes: attributesObj,
        longDescription: product.longDescription || {
          overview: "",
          highlights: [],
          specifications: [],
          directions: "",
          keyFeatures: [],
          importantInfo: "",
          productDetails: [],
        },
      });

      setSelectedImage(imagesArray[0] || null);

      // ✅ Reset selections when product changes
      setSize("");
      setSelectedColor("");
      setSelectedMl("");
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  // ===== FETCH REVIEWS =====
  const fetchAllReviews = async () => {
    try {
      const res = await fetch(`${backendUrl}/reviews/${productId}`);
      const data = await res.json();
      if (data.success) {
        setAllReviews(data.reviews || []);
        const avg = data.reviews?.length
          ? data.reviews.reduce((acc, r) => acc + r.rating, 0) /
            data.reviews.length
          : 0;
        setAverageRating(avg);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchAllReviews();
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (!productId || recordViewRef.current) return;
    recordViewRef.current = true;
  }, [productId]);

  // ===== HANDLE ADD TO CART with smart validation =====
  const handleAddToCart = () => {
    // ✅ Only validate if product HAS that option
    if (
      productData.sizes &&
      productData.sizes.length > 0 &&
      !size
    ) {
      toast.error("Please select a size");
      return;
    }

    if (
      productData.colors &&
      productData.colors.length > 0 &&
      !selectedColor
    ) {
      toast.error("Please select a color");
      return;
    }

    if (
      productData.mlOptions &&
      productData.mlOptions.length > 0 &&
      !selectedMl
    ) {
      toast.error("Please select a volume");
      return;
    }

    // ✅ Add to cart with defaults for missing variants
    addToCart(
      productData._id,
      size || "default",
      selectedColor || "defaultColor",
      selectedMl || "defaultVolume"
    );

    toast.success("Added to cart!");
  };

  const discountedPrice =
    Number(
      applyNewsletterDiscount(productData.price, newsletterDiscount)
    ) || 0;

  const {
    overview = "",
    highlights = [],
    specifications = [],
    directions = "",
    keyFeatures = [],
    importantInfo = "",
  } = productData.longDescription || {};

  // ✅ Convert attributes to array for rendering
  const attributeEntries = Object.entries(productData.attributes || {});

  const currencyCode = currency === "$" ? "USD" : currency === "AED" ? "AED" : "PKR";

  return (
    <div className="border-t pt-10 transition-opacity duration-500 ease-in opacity-100">
      {productData.name && (
        <SEO 
          title={productData.name}
          description={productData.description || `Buy ${productData.name} online at MSE Zone. Discover high quality clothes, fashion trends and more.`}
          keywords={`${productData.name}, buy ${productData.name}, ${productData.category || ''}, ${productData.subCategory || ''}, MSE Zone`}
          ogImage={productData.images && productData.images[0] ? `${backendUrl}/${productData.images[0]}` : null}
          ogType="product"
          schema={{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productData.name,
            "description": productData.description || overview || productData.name,
            "image": productData.images?.map(img => `${backendUrl}/${img}`) || [],
            "category": productData.category,
            "brand": {
              "@type": "Brand",
              "name": productData.brand || "MSE Zone"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": currencyCode,
              "price": discountedPrice || productData.price,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": productData.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              "url": typeof window !== "undefined" ? window.location.href : ""
            },
            ...(averageRating > 0 ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": averageRating,
                "reviewCount": allReviews.length || 1
              }
            } : {})
          }}
        />
      )}

      {/* ===== TOP SECTION ===== */}
      <div className="flex flex-col sm:flex-row gap-10">

        {/* Left: Images */}
        <div className="flex flex-col-reverse sm:flex-row flex-1 gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-3 sm:w-[18%]">
            {productData.images.map((img, index) =>
              img ? (
                <img
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  src={`${backendUrl}/${img}`}
                  alt={productData.name || "product"}
                  className={`cursor-pointer rounded-xl border-2 transition-all duration-200 w-[24%] sm:w-full sm:mb-2 flex-shrink-0 object-cover ${
                    selectedImage === img
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              ) : null
            )}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            {selectedImage && (
              <img
                src={`${backendUrl}/${selectedImage}`}
                alt={productData.name || "product"}
                className="w-full rounded-2xl shadow-md"
              />
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Name */}
          <div>
            <h1 className="text-3xl font-semibold">{productData.name}</h1>

            {/* ✅ Brand, Type, Category badges */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {productData.brand && (
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  🏷️ {productData.brand}
                </span>
              )}
              {productData.productType && (
                <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full">
                  📦 {productData.productType}
                </span>
              )}
              {productData.category && (
                <span className="bg-cyan-50 text-cyan-600 text-xs px-3 py-1 rounded-full">
                  {productData.category}
                </span>
              )}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={assets.star_icon}
                  alt="star"
                  className={`w-4 ${
                    i < Math.round(averageRating) ? "" : "opacity-30"
                  }`}
                />
              ))}
              <p
                className="pl-2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => setActiveTab("reviews")}
              >
                ({allReviews.length} reviews)
              </p>
            </div>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-gray-800">
            {currency}
            {discountedPrice.toFixed(2)}
          </p>

          {/* Short Description */}
          <p className="text-gray-500 leading-relaxed sm:w-4/5">
            {productData.description}
          </p>

          {/* ✅ SIZES - Only show if product has sizes */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-700">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`border px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      item === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ✅ COLORS - Only show if product has colors */}
          {productData.colors && productData.colors.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-700">Select Color</p>
              <div className="flex gap-2 flex-wrap">
                {productData.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedColor(color.name || color)
                    }
                    className={`border px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedColor === (color.name || color)
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{
                        backgroundColor:
                          color.hex || color.code || color.name,
                      }}
                    />
                    {color.name || color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ✅ ML / VOLUME - Only show if product has mlOptions */}
          {productData.mlOptions && productData.mlOptions.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-700">
                Select Volume / ML
              </p>
              <div className="flex gap-2 flex-wrap">
                {productData.mlOptions.map((ml, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMl(ml)}
                    className={`border px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      selectedMl === ml
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {ml}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ✅ ADD TO CART - Smart validation */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-10 py-3 rounded-3xl mt-5 text-sm hover:bg-gray-800 active:bg-gray-600 transition-all duration-200"
          >
            ADD TO CART
          </button>

          <hr className="mt-2 sm:w-4/5 border-gray-300" />

          {/* ✅ Custom Attributes - Only show if product has them */}
          {attributeEntries.length > 0 && (
            <div className="mt-2">
              <h3 className="font-bold italic text-base mb-3">
                Product Attributes
              </h3>
              <div className="flex flex-wrap gap-2">
                {attributeEntries.map(([key, value]) => (
                  <span
                    key={key}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    <span className="font-semibold">{key}:</span> {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Product Details Table - Only show if exists */}
          {Array.isArray(productData.longDescription?.productDetails) &&
            productData.longDescription.productDetails.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold italic text-base mb-4">
                  Product Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-gray-700 text-sm rounded-xl overflow-hidden shadow">
                    <tbody>
                      {productData.longDescription.productDetails.map(
                        (d, i) => (
                          <tr
                            key={d._id || i}
                            className={`transition-colors duration-200 ${
                              i % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100`}
                          >
                            <td className="px-4 py-3 font-semibold text-gray-800 border-b border-gray-200 w-1/3">
                              {d.key}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200">
                              {d.value}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Trust badges */}
          <div className="text-sm text-gray-500 mt-2 flex flex-col gap-1">
            <p>✅ 100% Original Product</p>
            <p>💵 Cash On Delivery Available</p>
            <p>↩️ Easy Return & Exchange Policy</p>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="mt-16">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 border-t border-l border-r text-sm transition-colors ${
              activeTab === "description"
                ? "bg-gray-100 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 border-t border-r text-sm transition-colors ${
              activeTab === "reviews"
                ? "bg-gray-100 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews ({allReviews.length})
          </button>
        </div>

        <div className="border border-t-0 p-6 text-sm text-gray-600 leading-relaxed">
          {activeTab === "description" ? (
            <div className="space-y-6">

              {/* Overview */}
              {overview && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold italic text-gray-800 pb-1">
                    Description
                  </h3>
                  <p className="text-gray-700">{overview}</p>
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold italic text-gray-800 pb-1">
                    About this item
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Directions */}
              {directions && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold italic text-gray-800 pb-1">
                    Directions
                  </h3>
                  <p className="text-gray-700">{directions}</p>
                </div>
              )}

              {/* Key Features */}
              {keyFeatures.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold italic text-gray-800 pb-1">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {keyFeatures.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Info */}
              {importantInfo && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold italic text-gray-800 pb-1">
                    Important Info
                  </h3>
                  <p className="text-gray-700">{importantInfo}</p>
                </div>
              )}

              {/* Specifications */}
              {specifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold italic text-gray-800 border-b pb-1 mb-3">
                    Specifications
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-gray-700 text-sm rounded-xl overflow-hidden shadow-sm">
                      <tbody>
                        {specifications.map((item, i) => (
                          <tr
                            key={i}
                            className={`${
                              i % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100 transition-colors`}
                          >
                            <td className="px-4 py-3 font-medium w-1/3 border-b border-gray-200">
                              {typeof item === "object"
                                ? item.key
                                : "Specification"}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200">
                              {typeof item === "object"
                                ? item.value
                                : item}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ✅ Custom Attributes in Description Tab */}
              {attributeEntries.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold italic text-gray-800 border-b pb-1 mb-3">
                    Additional Details
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-gray-700 text-sm rounded-xl overflow-hidden shadow-sm">
                      <tbody>
                        {attributeEntries.map(([key, value], i) => (
                          <tr
                            key={key}
                            className={`${
                              i % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100 transition-colors`}
                          >
                            <td className="px-4 py-3 font-medium w-1/3 border-b border-gray-200">
                              {key}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <ReviewSection
              productId={productData._id}
              onReviewAdded={fetchAllReviews}
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      {productData.category && productData.subCategory && (
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
        />
      )}
    </div>
  );
};

export default Product;