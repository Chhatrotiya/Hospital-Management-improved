import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const {atoken,doctors,getAllDoctors,changeAvailability,deleteDoctor}=useContext(AdminContext);

  useEffect(()=>{
     if(atoken){
      getAllDoctors()
     }
  },[atoken])

  return (
    <div className='m-5 overflow-y-scroll max-h-[90vh] text-stone-800'>
     <div className='mb-6'>
       <h1 className='text-2xl font-bold text-black'>All Doctors</h1>
       <p className='text-stone-500 mt-1'>Manage doctor profiles and availability</p>
     </div>
     <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5'>
      {
        doctors.map((item,index)=>(
          <div className='bg-white border border-stone-200 rounded-2xl overflow-hidden cursor-pointer group hover:border-primary hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300' key={index}>
            <div className='relative'>
              <div className='w-full h-48 bg-stone-50 flex items-center justify-center overflow-hidden'>
                <img className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' src={item.image} alt={item.name} />
              </div>
              <div className='absolute top-3 right-3'>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${item.available ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div className='p-5 space-y-3'>
              <div>
                <p className='text-stone-800 text-lg font-semibold group-hover:text-primary transition-all duration-300'>{item.name}</p>
                <p className='text-stone-500 text-sm font-medium'>{item.speciality}</p>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-stone-400 text-xs'>Experience: {item.experience}</span>
                <div className='flex gap-2'>
                  <button
                    onClick={(e) => { e.stopPropagation(); changeAvailability(item._id); }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${item.available ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    {item.available ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteDoctor(item._id); }}
                    className='px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      }
     </div>
    </div>
  )
}

export default DoctorsList