import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Title from '../../Components/Frontend/Title';
import { assets } from '../../assets/Frontend/assets';
import CartTotal from '../../Components/Frontend/CartTotal';
import { applyNewsletterDiscount } from "../../utils/discount";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, newsletterDiscount } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const itemId in cartItems) {
        const sizes = cartItems[itemId];
        for (const sizeKey in sizes) {
          const colors = sizes[sizeKey];
          for (const colorKey in colors) {
            const volumes = colors[colorKey];
            for (const volumeKey in volumes) {
              const { quantity } = volumes[volumeKey];
              if (quantity > 0) {
                tempData.push({
                  _id: itemId,
                  size: sizeKey === "defaultSize" ? null : sizeKey,
                  color: colorKey === "defaultColor" ? null : colorKey,
                  volume: volumeKey === "defaultVolume" ? null : volumeKey,
                  quantity,
                });
              }
            }
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);


  return (
    <div className='border-t pt-14 pb-20 bg-gray-50 min-h-screen'>
      <div className='text-3xl font-semibold text-center mb-10'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden'>
        {cartData.length === 0 ? (
          <div className='text-center text-gray-500 py-20 text-lg'>
            Your cart is empty.
          </div>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            // Correctly apply discount only if newsletterDiscount is true
            const discountedPrice = applyNewsletterDiscount(
              Number(productData?.price),
              newsletterDiscount
            );

            return (
              <div
                key={index}
                className='flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-5 border-b last:border-b-0 hover:bg-gray-50 transition'
              >
                {/* Product Info */}
                <div className='flex items-center gap-6 w-full sm:w-auto'>
                  <img
                    className='w-20 h-20 object-cover rounded-lg border'
                    src={
                      productData?.images
                        ? `http://localhost:4000/${Array.isArray(productData.images)
                          ? productData.images[0]
                          : productData.images
                        }`
                        : ''
                    }
                    alt={productData?.name || 'product'}
                  />

                  <div>
                    <h2 className='font-medium text-gray-800 text-lg'>
                      {productData?.name}
                    </h2>

                    <div className='flex items-center gap-3 mt-2 text-gray-600'>
                      <p className='text-sm'>
                        {currency}
                        {(discountedPrice * item.quantity).toFixed(2)}
                      </p>

                      <p className='text-xs px-2 py-1 border rounded-md bg-gray-100'>
                        {item.size && <span>{item.size} </span>}
                        {item.color && <span>{item.color} </span>}
                        {item.volume && <span>{item.volume}</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity + delete */}
                <div className='flex items-center gap-4'>
                  <input
                    onChange={(e) =>
                      e.target.value === '' || e.target.value === '0'
                        ? null
                        : updateQuantity(
                          item._id,
                          item.size,
                          item.color,
                          item.volume,
                          Number(e.target.value)
                        )
                    }
                    type='number'
                    min={1}
                    defaultValue={item.quantity}
                    className='w-16 text-center border rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                  />

                  <img
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.size,    // sizeKey
                        item.color,   // colorKey
                        item.volume,  // volumeKey
                        0             // quantity to delete
                      )
                    }
                    src={assets.bin_icon}
                    className='w-5 cursor-pointer opacity-70 hover:opacity-100 transition'
                    alt='delete'
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary */}
      {cartData.length > 0 && (
        <div className='max-w-5xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-start gap-10'>
          <div className='flex-1'></div>
          <div className='w-full sm:w-[400px] bg-white p-6 rounded-2xl shadow-sm'>
            <CartTotal />
            <button
              onClick={() => navigate('/place-order')}
              className='w-full bg-cyan-600 text-white text-sm font-medium py-3 mt-6 rounded-full hover:bg-cyan-700 transition-all duration-300'
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
