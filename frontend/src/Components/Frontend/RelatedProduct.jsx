import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { applyNewsletterDiscount } from '../../utils/discount';

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
const { newsletterDiscount } = useContext(ShopContext);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filtered.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24 px-4 sm:px-8 md:px-16">
      {/* Section Title */}
      <div className="text-center mb-10">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mt-3">
          Handpicked items you might like based on your interests.
        </p>
        <div className="h-1 w-24 bg-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {related.map((item, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 p-3"
          >
            <ProductItem
              id={item._id}
              images={item.images}
              name={item.name}
              price={item.price} 
              backendUrl={backendUrl}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {related.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>No related products found.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedProduct;
