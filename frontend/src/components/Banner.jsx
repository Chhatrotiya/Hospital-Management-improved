import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate=useNavigate();
  return (
    <div className='relative overflow-hidden rounded-lg border border-teal-200 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 shadow-lg shadow-teal-100/30 my-16 mx-4 md:mx-10'>
      {/* Background decorative elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10'></div>

      <div className='flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32 text-center'>
        {/* Main Content Section */}
        <div className='max-w-3xl mx-auto z-10 space-y-8'>
          <div className='space-y-6'>
            <h2 className='text-5xl md:text-6xl font-bold text-stone-800 leading-tight'>
              Quality Healthcare at Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Fingertips</span>
            </h2>
            <p className='text-stone-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed'>
              Join thousands of patients who trust us for convenient, affordable, and professional healthcare services. Your wellness journey starts here.
            </p>
          </div>

          {/* Feature List */}
          <div className='space-y-4 py-4'>
            <div className='flex items-center justify-center gap-4 text-stone-700'>
              <div className='w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0'>
                <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <span className='text-lg font-medium'>24/7 Appointment Booking</span>
            </div>
            <div className='flex items-center justify-center gap-4 text-stone-700'>
              <div className='w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0'>
                <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <span className='text-lg font-medium'>Verified Healthcare Professionals</span>
            </div>
            <div className='flex items-center justify-center gap-4 text-stone-700'>
              <div className='w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0'>
                <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <span className='text-lg font-medium'>Secure Health Records</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 py-4'>
            <div className='bg-white/70 border border-stone-200 rounded-lg px-6 py-4 shadow-sm hover:shadow-md transition-all duration-300'>
              <p className='text-3xl md:text-4xl font-bold text-primary'>100%</p>
              <p className='text-sm text-stone-500 mt-1'>Verified Doctors</p>
            </div>
            <div className='bg-white/70 border border-stone-200 rounded-lg px-6 py-4 shadow-sm hover:shadow-md transition-all duration-300'>
              <p className='text-3xl md:text-4xl font-bold text-teal-600'>Instant</p>
              <p className='text-sm text-stone-500 mt-1'>Confirmations</p>
            </div>
            <div className='bg-white/70 border border-stone-200 rounded-lg px-6 py-4 shadow-sm hover:shadow-md transition-all duration-300'>
              <p className='text-3xl md:text-4xl font-bold text-primary'>Easy</p>
              <p className='text-sm text-stone-500 mt-1'>Rescheduling</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => { navigate('/login'); scrollTo(0, 0); }}
            className='inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-10 py-4 rounded-lg font-medium transition-colors'
          >
            Start Your Journey Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner