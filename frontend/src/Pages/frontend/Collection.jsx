import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/Frontend/assets";
import Title from "../../Components/Frontend/Title";
import ProductItem from "../../Components/Frontend/ProductItem";
import SEO from "../../Components/Frontend/SEO";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // ✅ Dynamic categories from products in DB
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Extract unique categories/subCategories dynamically from products
  useEffect(() => {
    if (products.length > 0) {
      const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
      const subCats = [
        ...new Set(products.map((p) => p.subCategory).filter(Boolean)),
      ];
      setAvailableCategories(cats);
      setAvailableSubCategories(subCats);
    }
  }, [products]);

  // ✅ Toggle category filter
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // ✅ Toggle subCategory filter
  const toggleSubCategory = (sub) => {
    setSelectedSubCategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  // ✅ Apply filters dynamically
  const applyFilter = () => {
    let productsCopy = products.slice();

    // Search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    // SubCategory filter
    if (selectedSubCategories.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        selectedSubCategories.includes(item.subCategory)
      );
    }

    // Sort
    if (sortType === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [
    selectedCategories,
    selectedSubCategories,
    products,
    sortType,
    search,
    showSearch,
  ]);

  return (
    <section className="border-t pt-12 pb-20 bg-gray-50 min-h-screen">
      <SEO 
        title="Our Collection"
        description="Browse the latest fashion collections and clothes online at MSE Zone. Filter by category, type, price, and discover trendy outfits tailored for you."
        keywords="latest clothing collection, buy clothes online, MSE Zone clothing, online apparel UAE"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row gap-8">
        
        {/* ===== SIDEBAR FILTERS ===== */}
        <aside className="sm:w-64">
          <div
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center justify-between sm:justify-start gap-2 text-xl font-semibold text-gray-800 cursor-pointer mb-4"
          >
            <span>Filters</span>
            <img
              src={assets.dropdown_icon}
              className={`h-3 transition-transform sm:hidden ${
                showFilter ? "rotate-90" : ""
              }`}
              alt=""
            />
          </div>

          <div
            className={`space-y-6 ${
              showFilter ? "block" : "hidden sm:block"
            }`}
          >
            {/* ✅ Dynamic Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="mb-3 text-sm font-medium text-gray-800">
                Categories
              </p>
              {availableCategories.length === 0 ? (
                <p className="text-xs text-gray-400">No categories found</p>
              ) : (
                <div className="flex flex-col gap-3 text-sm text-gray-600">
                  {availableCategories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 cursor-pointer hover:text-cyan-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-cyan-600"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Dynamic SubCategories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="mb-3 text-sm font-medium text-gray-800">
                Sub Category
              </p>
              {availableSubCategories.length === 0 ? (
                <p className="text-xs text-gray-400">No sub categories found</p>
              ) : (
                <div className="flex flex-col gap-3 text-sm text-gray-600">
                  {availableSubCategories.map((sub) => (
                    <label
                      key={sub}
                      className="flex items-center gap-2 cursor-pointer hover:text-cyan-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(sub)}
                        onChange={() => toggleSubCategory(sub)}
                        className="accent-cyan-600"
                      />
                      {sub}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Clear Filters Button */}
            {(selectedCategories.length > 0 ||
              selectedSubCategories.length > 0) && (
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSubCategories([]);
                }}
                className="w-full text-sm text-red-500 border border-red-300 rounded-lg py-2 hover:bg-red-50 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* ===== PRODUCTS SECTION ===== */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
              <Title text1={"ALL"} text2={"COLLECTION"} />
            </div>

            {/* Sort */}
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          {/* ✅ Active filter tags */}
          {(selectedCategories.length > 0 ||
            selectedSubCategories.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  {cat}
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="font-bold hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedSubCategories.map((sub) => (
                <span
                  key={sub}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  {sub}
                  <button
                    onClick={() => toggleSubCategory(sub)}
                    className="font-bold hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Product Grid */}
          {filterProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  id={item._id}
                  images={item.images}
                  name={item.name}
                  price={item.price}
                  backendUrl={backendUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20 text-lg">
              No products found.
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Collection;