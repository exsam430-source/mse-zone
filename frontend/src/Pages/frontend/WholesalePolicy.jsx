import React from "react";
import Title from "../../Components/Frontend/Title";
import NewSletterBox from "../../Components/Frontend/NewSletterBox";
import SEO from "../../Components/Frontend/SEO";

const WholesalePolicy = () => {
  return (
    <div className="px-6 md:px-20 lg:px-32 text-gray-700">
      <SEO 
        title="Wholesale Policy" 
        description="Learn about MSE Zone's Wholesale Policy. We partner with retailers, resellers, and distributors in the UAE. Check MOQs and requirements."
        keywords="wholesale clothing, bulk purchase, MSE Zone wholesale, distributor UAE"
      />
      <div className="text-center pt-12 border-t">
        <Title text1={"WHOLESALE"} text2={"POLICY"} />
      </div>

      <div className="my-8 space-y-4">
        <p>🏬 MSE Zone welcomes wholesale partnerships with retailers, resellers, and bulk buyers across the UAE and beyond.</p>
        <p>✅ <strong>Eligibility:</strong> Registered businesses, resellers, and distributors with valid trade license or business registration.</p>
        <p>📦 <strong>Minimum Order Quantities (MOQ):</strong> Vary by product; custom orders may have higher MOQ.</p>
        <p>💰 <strong>Pricing & Discounts:</strong> Based on volume, product category, and order frequency. All prices in AED.</p>
        <p>📝 <strong>Ordering Process:</strong> Orders via email or wholesale inquiry form. Confirmed once payment received.</p>
        <p>💳 <strong>Payment Terms:</strong> First-time customers pay in full; returning partners may have credit terms.</p>
        <p>🚚 <strong>Shipping & Delivery:</strong> Costs based on weight, volume, and destination. Partners responsible for customs duties.</p>
        <p>🔄 <strong>Returns & Claims:</strong> Wholesale orders non-returnable except defective/damaged. Claims within 3 business days.</p>
        <p>🖌 <strong>Private Label & Custom Orders:</strong> 50% deposit required; MOQ and lead time depend on product complexity.</p>
        <p>🔒 <strong>Brand Integrity:</strong> Trademarks and product designs protected; no unauthorized rebranding.</p>
        <p>❗ <strong>Right to Refuse:</strong> MSE Zone may refuse wholesale service to non-compliant parties.</p>
      </div>


    </div>
  );
};

export default WholesalePolicy;
