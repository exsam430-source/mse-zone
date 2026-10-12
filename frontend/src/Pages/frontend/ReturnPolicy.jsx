import React from "react";
import Title from "../../Components/Frontend/Title";
import NewSletterBox from "../../Components/Frontend/NewSletterBox";
import SEO from "../../Components/Frontend/SEO";

const ReturnPolicy = () => {
  return (
    <div className="px-6 md:px-20 lg:px-32 text-gray-700">
      <SEO 
        title="Return Policy" 
        description="Read the MSE Zone Return Policy. Learn about our 7-day return window, eligible item conditions, and how to start a return or exchange."
        keywords="return policy MSE Zone, returns UAE, e-commerce return, refund clothes"
      />
      <div className="text-center pt-12 border-t">
        <Title text1={"RETURN"} text2={"POLICY"} />
      </div>

      <div className="my-8 space-y-4">
        <p>📦 At MSE Zone, customer satisfaction is our top priority. If you're not completely happy with your purchase, we're here to help.</p>
        <p>⏱ <strong>Return Window:</strong> You may return most items within 7 days of delivery.</p>
        <p>📝 <strong>Condition:</strong> Items must be unused, unopened, and in their original packaging to be eligible for return.</p>
        <p>🚫 <strong>Non-Returnable Items:</strong> Cosmetics, personal care products, and opened food-related items are non-returnable unless defective.</p>
        <p>🔄 <strong>Return Process:</strong> Follow the platform's return instructions (Amazon or Noon). Ensure secure packaging to avoid damage.</p>
        <p>🚚 <strong>Return Shipping:</strong> Usually free if defective or incorrect. Otherwise, costs may apply.</p>
      </div>


    </div>
  );
};

export default ReturnPolicy;
