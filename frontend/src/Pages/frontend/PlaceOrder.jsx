import React, { useContext, useState } from 'react';
import Title from '../../Components/Frontend/Title';
import CartTotal from '../../Components/Frontend/CartTotal';
import { assets } from '../../assets/Frontend/assets';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { applyNewsletterDiscount } from "../../utils/discount";

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod'); // Default checkout option
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    navigate,
    backendURL,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    newsletterDiscount,
    currency
  } = useContext(ShopContext);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Gather Cart Items
      let orderItems = [];
      for (const itemId in cartItems) {
        const sizes = cartItems[itemId];
        for (const sizeKey in sizes) {
          const colors = sizes[sizeKey];
          for (const colorKey in colors) {
            const volumes = colors[colorKey];
            for (const volumeKey in volumes) {
              const quantity = volumes[volumeKey].quantity || 0;
              if (quantity > 0) {
                const productData = products.find(p => p._id === itemId);
                if (!productData) continue;
                orderItems.push({
                  ...productData,
                  size: sizeKey === "defaultSize" ? null : sizeKey,
                  color: colorKey === "defaultColor" ? null : colorKey,
                  volume: volumeKey === "defaultVolume" ? null : volumeKey,
                  quantity
                });
              }
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setLoading(false);
        return;
      }

      // 2. Compute Discounts & Totals
      const rawAmount = getCartAmount() + delivery_fee;
      const discountedAmount = applyNewsletterDiscount(rawAmount, newsletterDiscount);

      // Save Order Payload
      const orderPayload = {
        address: formData,
        items: orderItems,
        amount: discountedAmount,
        paymentMethod: method === 'cod' ? 'COD' : 'WhatsApp'
      };

      // 3. Post to Order Processing Engine
      const response = await axios.post(`${backendURL}/api/order/place`, orderPayload, { headers: { token } });

      if (response.data.success) {
        const orderId = response.data.orderId;

        // If checkout is via WhatsApp, trigger the dynamic routing sequence
        if (method === 'whatsapp') {
          // Group items by each product's specific target phone number
          const groups = {};
          orderItems.forEach(item => {
            const number = item.whatsappNumber || "923001234567"; // Fallback number
            if (!groups[number]) {
              groups[number] = [];
            }
            groups[number].push(item);
          });

          toast.info("Opening WhatsApp to confirm items with respective departments...");

          // Iterate through groups and launch target confirmation endpoints
          const phoneNumbers = Object.keys(groups);
          phoneNumbers.forEach((phone, idx) => {
            const itemsInGroup = groups[phone];

            // Format a highly professional message
            let message = `🛒 *NEW ORDER PLACED! (Order ID: #${orderId})*\n\n`;
            message += `*👤 Customer Details:*\n`;
            message += `Name: ${formData.firstName} ${formData.lastName}\n`;
            message += `Phone: ${formData.phone}\n`;
            message += `Address: ${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipcode}, ${formData.country}\n\n`;

            message += `*📦 Items to Confirm:*\n`;
            let subtotal = 0;
            itemsInGroup.forEach((item, index) => {
              const itemPrice = applyNewsletterDiscount(item.price, newsletterDiscount);
              const lineTotal = itemPrice * item.quantity;
              subtotal += lineTotal;

              message += `${index + 1}. *${item.name}* x ${item.quantity}\n`;
              if (item.size) message += `   Size: ${item.size}\n`;
              if (item.color) message += `   Color: ${item.color}\n`;
              if (item.volume) message += `   Volume: ${item.volume}\n`;
              message += `   Price: ${currency}${itemPrice.toFixed(2)} each\n`;
            });

            message += `\n*💵 Department Subtotal:* ${currency}${subtotal.toFixed(2)}\n`;
            message += `*🚚 Est. Delivery Charge:* ${currency}${delivery_fee.toFixed(2)}\n`;
            message += `_Please confirm my order availability and dispatch!_`;

            // Open window with slight delay if handling multi-vendor redirects to prevent pop-up block rules
            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            setTimeout(() => {
              window.open(waUrl, '_blank');
            }, idx * 1000);
          });
        }

        // Reset frontend shopping status
        setCartItems({});
        toast.success("Order Placed Successfully!");
        navigate('/orders');
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row justify-between gap-10 pt-10 min-h-[80vh] border-t px-4 sm:px-8">

      {/* DELIVERY INFO */}
      <div className="flex flex-col w-full lg:w-1/2 max-w-[520px] bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        <div className="mt-5 flex gap-4">
          <input required onChange={onChangeHandler} value={formData.firstName} name="firstName" type="text" placeholder="First Name" className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
          <input required onChange={onChangeHandler} value={formData.lastName} name="lastName" type="text" placeholder="Last Name" className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
        </div>
        <input required onChange={onChangeHandler} value={formData.email} name="email" type="email" placeholder="Email Address" className="mt-3 border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
        <input required onChange={onChangeHandler} value={formData.street} name="street" type="text" placeholder="Street" className="mt-3 border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
        <div className="mt-3 flex gap-4">
          <input required onChange={onChangeHandler} value={formData.city} name="city" type="text" placeholder="City" className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
          <input required onChange={onChangeHandler} value={formData.state} name="state" type="text" placeholder="State" className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="mt-3 flex gap-4">
          <input required onChange={onChangeHandler} value={formData.zipcode} name="zipcode" type="number" placeholder="Zip Code" className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
          <input required onChange={onChangeHandler} value={formData.country} name="country" type="text" placeholder="Country" className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
        </div>
        <input required onChange={onChangeHandler} value={formData.phone} name="phone" type="number" placeholder="Phone Number" className="mt-3 border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500" />
      </div>

      {/* PAYMENT SUMMARY & METHOD PANEL */}
      <div className="flex flex-col justify-between w-full lg:w-[45%]">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <CartTotal />
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <p className="text-gray-500 text-sm mt-2">All routing orders are logged for admin record keeping.</p>

          <div className="flex flex-col gap-4 mt-5">
            {/* WhatsApp Option */}
            <div onClick={() => setMethod('whatsapp')} className={`flex items-center gap-3 border rounded-lg p-3 px-4 cursor-pointer transition ${method === 'whatsapp' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
              <p className={`w-3.5 h-3.5 border rounded-full ${method === 'whatsapp' ? 'bg-teal-500' : ''}`}></p>
              <img src={assets.whatsapp_logo || "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"} className="h-5 mx-2 object-contain" alt="WhatsApp" />
              <span className="text-gray-600 text-sm font-medium">Order & Pay via WhatsApp</span>
            </div>

            {/* COD Option */}
            <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border rounded-lg p-3 px-4 cursor-pointer transition ${method === 'cod' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
              <p className={`w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-teal-500' : ''}`}></p>
              <p className="text-gray-600 text-sm font-medium">Cash on Delivery</p>
            </div>

            <label className="flex items-center gap-2 mt-3 text-gray-600 text-sm">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-500" />
              Use shipping address as billing address
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="w-full mt-6 text-end">
            <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-3 text-sm font-medium rounded-full transition active:bg-gray-400 disabled:opacity-50">
              {loading ? 'Processing...' : method === 'whatsapp' ? 'CONFIRM ON WHATSAPP' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;