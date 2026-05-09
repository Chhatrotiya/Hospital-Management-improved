import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Appcontext } from '../context/AppContext';

const TopDoctors = () => {
  const {doctors}=useContext(Appcontext);
    const navigate=useNavigate();
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-stone-800 md:mx-10'>
<h1 className='text-3xl font-medium text-stone-900'>Top Doctors to <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Book</span></h1>
<p className='sm:w-1/3 text-center text-sm text-stone-600'>Simply browse through our extensive list of trusted doctors.</p>
<div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0 '>
    {
        doctors.slice(0,10).map((item,index)=>(
         <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='bg-white border border-stone-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 group' key={index}>
           <div className='relative overflow-hidden'>
             <img className='w-full h-48 object-cover bg-stone-50 group-hover:scale-105 transition-transform duration-300' src={item.image} alt={item.name} />
             <div className='absolute inset-0 bg-gradient-to-t from-stone-100/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
           </div>
           <div className='p-5 space-y-3'>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${item.available? 'bg-teal-50 text-teal-600':'bg-red-50 text-red-500'}`}>
                <div className={`w-2 h-2 ${item.available? 'bg-teal-500':'bg-red-500'} rounded-full`}></div>
                <span>{item.available? 'Available':'Not Available'}</span>
            </div>
            <p className='text-stone-900 text-lg font-semibold group-hover:text-primary transition-colors'>{item.name}</p>
            <p className='text-stone-600 text-sm font-medium'>{item.speciality}</p>
           </div>
         </div>
        ))
    }
</div>
<button onClick={()=>{navigate('/doctors');scrollTo(0,0)}} className='bg-stone-900 text-white hover:bg-stone-800 px-12 py-3 rounded-lg mt-10 transition-colors font-medium'>View More Doctors</button>
    </div>
  )
}

export default TopDoctors