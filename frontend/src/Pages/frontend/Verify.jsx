import React from "react";
import { useLocation } from "react-router-dom";

const Verify = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const success = query.get("success");
  const orderId = query.get("orderId");

  return (
    <div className="py-10 text-center">
      {success === "true" ? (
        <h2 className="text-green-600">✅ Payment Successful! Order ID: {orderId}</h2>
      ) : (
        <h2 className="text-red-600">❌ Payment Failed or Canceled. Try again.</h2>
      )}
    </div>
  );
};

export default Verify;