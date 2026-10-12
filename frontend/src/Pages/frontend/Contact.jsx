import React from 'react'
import Title from '../../Components/Frontend/Title'
import { assets } from '../../assets/Frontend/assets'
import NewSletterBox from '../../Components/Frontend/NewSletterBox'
import SEO from '../../Components/Frontend/SEO'

const Contact = () => {
  return (
    <div className='px-6 md:px-20 lg:px-32'>
      <SEO 
        title="Contact Us" 
        description="Get in touch with MSE Zone customer support, wholesale partnerships, and business inquiry teams. We are here to help you."
        keywords="contact MSE Zone, email support, wholesale clothing inquiries, customer service UAE"
      />
      {/* Title */}
      <div className='text-center text-3xl pt-12 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Intro */}
      <div className='text-center my-8 text-gray-700'>
        <p className='text-lg sm:text-xl'>
          We'd love to hear from you! 💬 Whether you have a question about our products, need help with an order, or want to explore wholesale opportunities, the MSE Zone team is here to assist.
        </p>
      </div>

      {/* Info Sections */}
      <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-gray-700'>
        {/* Image */}
        <div className='flex justify-center items-start'>
          <img
            src={assets.contact_img}
            className='w-full max-w-[460px] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500'
            alt='Contact'
          />
        </div>

        {/* Contact Details */}
        <div className='flex flex-col gap-6'>
          <div>
            <h3 className='text-xl font-semibold mb-1'>📧 General Inquiries</h3>
            <p>
              For product questions, order support, or general feedback, please email us at: <br />
              <span className='text-teal-500 font-medium'>info@msezone.com</span>
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-1'>🏢 Wholesale & Business Partnerships</h3>
            <p>
              Interested in stocking MSE Zone products or placing a bulk order? <br />
              Reach out to our wholesale team at: <br />
              <span className='text-teal-500 font-medium'>wholesale@msezone.com</span>
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-1'>🛒 Order & Return Support</h3>
            <p>
              If you've placed an order through Amazon or Noon and need assistance with returns, exchanges, or delivery updates, please contact: <br />
              <span className='text-teal-500 font-medium'>support@msezone.com</span>
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-1'>📍 Business Address</h3>
            <p>
              MSE Zone Trading <br />
              Industrial Area 6, Sharjah <br />
              United Arab Emirates
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-1'>⏰ Business Hours</h3>
            <p>
              Sunday - Thursday: 9:00 AM – 6:00 PM <br />
              Friday & Saturday: Closed
            </p>
          </div>

          <p className='text-gray-600 italic'>
            We aim to respond to all inquiries within 24-48 business hours. Thank you for choosing MSE Zone – we're here to help make your experience seamless and satisfying.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewSletterBox />
    </div>
  )
}

export default Contact
