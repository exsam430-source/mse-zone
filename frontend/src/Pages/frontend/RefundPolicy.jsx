import React from "react";
import Title from "../../Components/Frontend/Title";
import NewSletterBox from "../../Components/Frontend/NewSletterBox";
import SEO from "../../Components/Frontend/SEO";

const RefundPolicy = () => {
  return (
    <div className="px-6 md:px-20 lg:px-32 text-gray-700">
      <SEO 
        title="Refund Policy" 
        description="Review the MSE Zone Refund Policy. Find out about refund methods, processing times, and conditions for cancellations."
        keywords="refund policy MSE Zone, order cancellations UAE, money back clothing"
      />
      <div className="text-center pt-12 border-t">
        <Title text1={"REFUND"} text2={"POLICY"} />
      </div>

      <div className="my-8 space-y-4">
        <p>💰 Once we receive and inspect your returned item, we will process your refund promptly.</p>
        <p>🏦 <strong>Refund Method:</strong> Refunds will be issued to your original payment method.</p>
        <p>⏳ <strong>Processing Time:</strong> Please allow 5-7 business days for the refund to reflect in your account after the return is approved.</p>
        <p>🔹 <strong>Partial Refunds:</strong> If the returned item is not in original condition, a partial refund may be issued.</p>
        <p>❌ <strong>Order Cancellations:</strong> Orders can be canceled before they are shipped. Once shipped, follow the return process.</p>
      </div>


    </div>
  );
};

export default RefundPolicy;
