import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  // getCartAmount() should already return discounted total
  const subTotal = Number(getCartAmount(true)) || 0;
  const shippingFee = Number(delivery_fee) || 0;
  const totalAmount = subTotal + shippingFee;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTAL'} />
      </div>
      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Sub-Total</p>
          <p>{currency} {subTotal.toFixed(2)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency} {shippingFee.toFixed(2)}</p>
        </div>
        <div className='flex justify-between'>
          <b>Total</b>
          <p>{currency} {totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
