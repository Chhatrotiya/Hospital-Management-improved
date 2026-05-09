import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate=useNavigate()
  return (
    <div className='md:mx-10 bg-transparent border-t border-stone-200'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div className=''>
               <h1 onClick={()=>navigate('/')} className='text-primary text-2xl mb-5 font-bold hover:text-teal-700 transition-colors cursor-pointer'>Hospital Management</h1>
               <p className='w-full md:w-2/3 leading-6 text-stone-600'>Transforming healthcare accessibility through innovative technology. We connect patients with trusted healthcare professionals, making quality care convenient, affordable, and accessible to everyone, everywhere.</p>
            </div>


            <div>
              <p className='font-semibold text-lg mb-5 text-stone-900'>COMPANY</p>
              <ul className='flex flex-col text-stone-600 gap-2'>
                <li className='hover:text-primary transition-colors cursor-pointer'>Home</li>
                <li className='hover:text-primary transition-colors cursor-pointer'>About Us</li>
                <li className='hover:text-primary transition-colors cursor-pointer'>Contact Us</li>
                <li className='hover:text-primary transition-colors cursor-pointer'>Privacy Policy</li>
              </ul>
            </div>


            <div>
               <p className='font-semibold text-lg mb-5 text-stone-900'>GET IN TOUCH</p>
               <ul className='flex flex-col text-stone-600 gap-2'>
                <li className='hover:text-primary transition-colors cursor-pointer'>+91 98563214701</li>
                <li className='hover:text-primary transition-colors cursor-pointer'>hellohospital@gmail.com</li>
               </ul>
            </div>
        </div>

        <div className='border-t border-stone-200'>
            <p className='text-sm py-5 text-center text-stone-500'>Copyright © 2025 Hospital Management - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer