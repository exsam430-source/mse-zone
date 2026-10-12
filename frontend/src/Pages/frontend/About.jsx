import React from "react";
import Title from "../../Components/Frontend/Title";
import NewSletterBox from "../../Components/Frontend/NewSletterBox";
import { assets } from "../../assets/Frontend/assets";
import { Link } from "react-router-dom";
import SEO from "../../Components/Frontend/SEO";

const About = () => {
  return (
    <div className="text-gray-700">
      <SEO 
        title="About Us" 
        description="Learn more about MSE Zone, our story, values, and our commitment to bringing high-quality clothing, cosmetics, kitchenware, toys, and lifestyle essentials to UAE households."
        keywords="about MSE Zone, fashion company, UAE shopping story, quality e-commerce"
      />
      {/* Header */}
      <div className="text-center pt-16 border-t border-gray-200">
        <Title text1={"ABOUT"} text2={"US"} />
        <p className="max-w-2xl mx-auto mt-3 text-sm sm:text-base text-gray-500">
          Get to know our story, our values, and what makes us different.
        </p>
      </div>

      {/* About Section */}
      <div className="my-16 flex flex-col md:flex-row items-center gap-16 px-6 sm:px-10">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={assets.about_img}
            className="w-full rounded-2xl shadow-md hover:scale-[1.05] transition-transform duration-500 ease-out"
            alt="About"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 md:w-1/2 leading-relaxed text-gray-600">
          <p>
            About MSE Zone<br />
            At MSE Zone, we believe that everyday essentials should be
            anything but ordinary. Founded with a vision to bring quality,
            variety, and convenience to modern households, MSE Zone is a
            UAE-based brand that offers a thoughtfully curated selection of
            products across multiple categories - including clothing, cosmetics,
            kitchenware, toys, and lifestyle accessories.
          </p>
          <p>
            Our journey began with a simple idea: to make shopping easier and
            more rewarding for customers who value both quality and
            affordability. Today, MSE Zone is proud to serve a growing
            community of customers across leading e-commerce platforms like
            Amazon and Noon. Whether you're searching for clothing that fits your style,
            skincare that suits your daily routine, kitchen tools that simplify your cooking, or
            toys that spark joy and creativity, we're here to deliver products
            that fit seamlessly into your life.
          </p>
          <p>
            What sets us apart is our commitment to excellence. Every item in
            our collection is handpicked and tested to ensure it meets our high
            standards for performance, safety, and design. We work closely with
            trusted manufacturers and suppliers to bring you products that are
            not only reliable but also reflect the latest trends and
            innovations.
          </p>
          <p>
            We understand the fast-paced lifestyle of our customers in the UAE
            and beyond. That's why we focus on providing a smooth,
            hassle-free shopping experience - from product discovery to
            doorstep delivery. Our customer-first approach means we're always
            listening, learning, and improving to better serve your needs.
          </p>
          <p>
            MSE Zone is more than just a brand - it's a promise. A
            promise to offer practical, stylish, and dependable products that
            make your everyday moments better. As we continue to grow, our
            mission remains the same: to be your go-to source for quality
            essentials that bring comfort, joy, and ease into your home.
          </p>
          <p>Thank you for choosing MSE Zone. We're excited to be part of your daily life.</p>
        </div>
      </div>

      {/* Policies Section */}
      <div className="text-center mb-12">
        <Title text1={"OUR"} text2={"POLICIES"} />
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 px-6 sm:px-10 mb-24">
        <Link
          to="/return-policy"
          className="p-8 rounded-2xl border border-cyan-300 bg-cyan-50 shadow-md hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
        >
          <h4 className="font-bold text-gray-900 text-lg mb-2">📦 Return Policy</h4>
          <p className="text-gray-600 text-sm">Learn about how to return items and our conditions.</p>
        </Link>

        <Link
          to="/refund-policy"
          className="p-8 rounded-2xl border border-yellow-300 bg-yellow-50 shadow-md hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
        >
          <h4 className="font-bold text-gray-900 text-lg mb-2">💰 Refund Policy</h4>
          <p className="text-gray-600 text-sm">Read our refund process and timelines for your convenience.</p>
        </Link>

        <Link
          to="/wholesale-policy"
          className="p-8 rounded-2xl border border-purple-300 bg-purple-50 shadow-md hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
        >
          <h4 className="font-bold text-gray-900 text-lg mb-2">🏬 Wholesale Policy</h4>
          <p className="text-gray-600 text-sm">Terms and conditions for wholesale partnerships and bulk purchases.</p>
        </Link>
      </div>

      {/* Newsletter */}
      <NewSletterBox />
    </div>
  );
};

export default About;
