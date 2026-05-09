import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='bg-transparent min-h-screen py-12 px-4'>

     
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold text-stone-900 mb-4'>
          About <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Us</span>
        </h1>
        <p className='text-stone-500 text-lg max-w-2xl mx-auto'>Leading the future of healthcare management with innovation and excellence</p>
      </div>

     
      <div className='my-16 flex flex-col lg:flex-row gap-12 items-center max-w-6xl mx-auto'>
        <div className='flex-1'>
          <img className='w-full rounded-2xl shadow-md border border-stone-200 bg-stone-50' src={assets.about_image} alt="About Hospital Management" />
        </div>
        <div className='flex-1 flex flex-col justify-center gap-8'>
          <div>
            <h2 className='text-3xl font-bold text-stone-900 mb-4'>Welcome to Hospital Management</h2>
            <p className='text-stone-600 text-lg leading-relaxed mb-4'>
              Your trusted partner in revolutionizing healthcare delivery. We are dedicated to bridging the gap between patients and healthcare providers, making quality healthcare accessible, affordable, and convenient.
            </p>
            <p className='text-stone-500 text-base leading-relaxed'>
              With cutting-edge technology and a patient-centric approach, Hospital Management empowers millions of users to manage their health journey seamlessly. From scheduling appointments to maintaining health records, we've got you covered.
            </p>
          </div>
          
          <div className='bg-teal-50 border border-teal-200 rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-primary mb-3'>Our Mission</h3>
            <p className='text-stone-700'>
              To transform healthcare accessibility by providing an intuitive platform that empowers patients and healthcare professionals to collaborate effectively and deliver superior care outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className='my-16 bg-white rounded-2xl p-12 max-w-6xl mx-auto border border-stone-200 shadow-sm'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-stone-900 mb-2'>Our Vision</h2>
          <div className='h-1 w-20 bg-gradient-to-r from-teal-800 to-teal-950 mx-auto rounded'></div>
        </div>
        <p className='text-stone-600 text-lg text-center max-w-3xl mx-auto leading-relaxed'>
          We envision a world where every individual has instant access to quality healthcare services, regardless of their location or background. By leveraging technology and innovation, we strive to create a healthcare ecosystem that is transparent, efficient, and patient-first.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className='my-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-stone-900 mb-2'>
            Why <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Choose Us</span>
          </h2>
          <p className='text-stone-500 max-w-xl mx-auto'>Discover what makes us the preferred healthcare management platform</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <div className='group bg-white border border-stone-200 rounded-xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer shadow-sm'>
            <div className='w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors'>
              <span className='text-2xl text-primary'>⚡</span>
            </div>
            <h3 className='text-xl font-bold text-stone-900 mb-3'>Lightning Fast</h3>
            <p className='text-stone-600 leading-relaxed'>
              Experience seamless appointment scheduling with our optimized platform designed for speed and reliability.
            </p>
          </div>

          <div className='group bg-white border border-stone-200 rounded-xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer shadow-sm'>
            <div className='w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors'>
              <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-3-3v6' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-stone-900 mb-3'>Vast Network</h3>
            <p className='text-stone-600 leading-relaxed'>
              Access a comprehensive network of qualified healthcare professionals and trusted medical institutions.
            </p>
          </div>

          <div className='group bg-white border border-stone-200 rounded-xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer shadow-sm'>
            <div className='w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors'>
              <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-stone-900 mb-3'>Secure & Private</h3>
            <p className='text-stone-600 leading-relaxed'>
              Your health data is protected with enterprise-grade security and HIPAA-compliant infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Benefits */}
      <div className='my-16 bg-teal-50 border border-teal-200 rounded-2xl p-12 max-w-6xl mx-auto'>
        <h3 className='text-2xl font-bold text-stone-900 mb-8 text-center'>Additional Features</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex items-start gap-4'>
            <svg className='w-6 h-6 text-teal-600 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <div>
              <h4 className='text-stone-900 font-semibold mb-1'>24/7 Support</h4>
              <p className='text-stone-600'>Round-the-clock customer support to assist with your healthcare needs</p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <svg className='w-6 h-6 text-teal-600 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <div>
              <h4 className='text-stone-900 font-semibold mb-1'>Easy Cancellation</h4>
              <p className='text-stone-600'>Flexible appointment management with hassle-free rescheduling and cancellation</p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <svg className='w-6 h-6 text-teal-600 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <div>
              <h4 className='text-stone-900 font-semibold mb-1'>Health Records</h4>
              <p className='text-stone-600'>Maintain comprehensive digital health records accessible anytime, anywhere</p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <svg className='w-6 h-6 text-teal-600 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <div>
              <h4 className='text-stone-900 font-semibold mb-1'>Smart Reminders</h4>
              <p className='text-stone-600'>Intelligent notifications to never miss an appointment or medication schedule</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default About