import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-stone-800 bg-stone-50' id='speciality'>
        <h1 className='text-3xl font-medium text-stone-900'>Find by <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Speciality</span></h1>
        <p className='sm:w-1/3 text-center text-sm text-stone-600'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free</p>
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
           {
            specialityData.map((item,index)=>(
                <Link onClick={()=>scrollTo(0,0)} key={index} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 group' to={`/doctors/${item.speciality}`}>
                   <div className='w-16 sm:w-24 h-16 sm:h-24 mb-2 rounded-full bg-white border-2 border-stone-200 shadow-sm group-hover:border-primary transition-all duration-300 flex items-center justify-center group-hover:bg-teal-50'>
                     <img className='w-8 sm:w-12' src={item.image} alt="" />
                   </div>
                   <p className='text-stone-700 group-hover:text-primary font-medium transition-colors'>{item.speciality}</p>
                </Link>
            ))
           }
        </div>
    </div>
  )
}

export default SpecialityMenu