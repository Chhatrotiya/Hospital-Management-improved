import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='bg-transparent min-h-screen py-12 px-4'>

      {/* Header Section */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold text-stone-900 mb-4'>
          Contact <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Us</span>
        </h1>
        <p className='text-stone-500 text-lg max-w-2xl mx-auto'>Get in touch with our healthcare management team</p>
      </div>

      {/* Main Content */}
      <div className='flex flex-col lg:flex-row gap-12 items-center justify-center max-w-6xl mx-auto mb-16'>

        {/* Image Section */}
        <div className='flex-1 max-w-md'>
          <img className='w-full rounded-2xl shadow-md border border-stone-200 bg-stone-50' src={assets.contact_image} alt="Contact Hospital Management" />
        </div>

        {/* Contact Information */}
        <div className='flex-1 space-y-8'>

          {/* Office Information */}
          <div className='bg-white border border-stone-200 rounded-xl p-8 hover:border-primary/50 transition-all duration-300 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center'>
                <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-stone-900'>Our Office</h3>
            </div>
            <div className='space-y-2 text-stone-700'>
              <p className='text-lg'>54709 Willms Station</p>
              <p className='text-stone-500'>Suite 350, Washington, USA</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className='bg-white border border-stone-200 rounded-xl p-8 hover:border-primary/50 transition-all duration-300 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center'>
                <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-stone-900'>Get in Touch</h3>
            </div>
            <div className='space-y-2 text-stone-700'>
              <p className='text-lg'>Tel: (415) 555-0132</p>
              <p className='text-stone-500'>Email: hospitalmanagement@gmail.com</p>
            </div>
          </div>

          {/* Careers Section */}
          <div className='bg-white border border-stone-200 rounded-xl p-8 hover:border-primary/50 transition-all duration-300 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center'>
                <span className='text-primary text-xl'>💼</span>
              </div>
              <h3 className='text-xl font-bold text-stone-900'>Careers at Hospital Management</h3>
            </div>
            <p className='text-stone-600 mb-6'>Join our innovative team and help shape the future of healthcare management</p>
      
          </div>

        </div>
      </div>

      {/* Additional Contact Methods */}
      <div className='max-w-4xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white border border-stone-200 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 shadow-sm'>
            <div className='w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-primary text-2xl'>💬</span>
            </div>
            <h4 className='text-stone-900 font-semibold mb-2'>Live Chat</h4>
            <p className='text-stone-500 text-sm'>Get instant support from our healthcare specialists</p>
          </div>

          <div className='bg-white border border-stone-200 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 shadow-sm'>
            <div className='w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-primary text-2xl'>📧</span>
            </div>
            <h4 className='text-stone-900 font-semibold mb-2'>Email Support</h4>
            <p className='text-stone-500 text-sm'>Send us your queries and we'll respond within 24 hours</p>
          </div>

          <div className='bg-white border border-stone-200 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 shadow-sm'>
            <div className='w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-primary text-2xl'>📱</span>
            </div>
            <h4 className='text-stone-900 font-semibold mb-2'>Mobile App</h4>
            <p className='text-stone-500 text-sm'>Download our app for on-the-go healthcare management</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Contact