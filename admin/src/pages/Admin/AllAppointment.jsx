import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointment = () => {
   const {calculateAge,slotFormateDate}=useContext(AppContext)
  const {atoken,appointments,getAllAppointments,cancelAppointment}=useContext(AdminContext);

  useEffect(()=>{
    getAllAppointments()
  },[atoken])

  return (
    <div className='w-full max-w-6xl m-5 text-stone-800'>
      
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-black'>All Appointments</h1>
        <p className='text-stone-500 mt-1'>Manage and track all patient appointments</p>
      </div>

      <div className='bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-4 px-6 border-b border-stone-200 bg-stone-50'>
          <p className='text-stone-600 font-semibold'>#</p>
          <p className='text-stone-600 font-semibold'>Patient</p>
          <p className='text-stone-600 font-semibold'>Age</p>
          <p className='text-stone-600 font-semibold'>Date & Time</p>
          <p className='text-stone-600 font-semibold'>Doctor</p>
          <p className='text-stone-600 font-semibold'>Fees</p>
          <p className='text-stone-600 font-semibold'>Status</p>
        </div>
           
           {
            appointments.map((item,index)=>(
              <div className='flex flex-wrap justify-between max-sm:gap-4 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-stone-700 py-4 px-6 border-b border-stone-100 hover:bg-stone-50 hover:border-primary/30 transition-all duration-200' key={index}>
                    <p className='max-sm:hidden font-medium text-stone-500'>{index+1}</p>
                    <div className='flex items-center gap-3'>
                      <img className='w-10 h-10 rounded-full border-2 border-stone-200' src={item.userData.image} alt="" />
                      <div>
                        <p className='font-medium text-stone-800'>{item.userData.name}</p>
                        <p className='text-xs text-stone-500 max-sm:hidden'>Patient</p>
                      </div>
                    </div>
                    <p className='max-sm:hidden font-medium'>{calculateAge(item.userData.dob)}</p>
                    <div className='max-sm:col-span-2'>
                      <p className='font-medium text-primary'>{slotFormateDate(item.slotDate)}</p>
                      <p className='text-sm text-stone-500'>{item.slotTime}</p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <img className='w-10 h-10 rounded-full border-2 border-stone-200' src={item.docData.image} alt="" />
                      <div>
                        <p className='font-medium text-stone-800'>{item.docData.name}</p>
                        <p className='text-xs text-stone-500 max-sm:hidden'>Doctor</p>
                      </div>
                    </div>
                    <p className='font-semibold text-teal-600'>${item.amount}</p>
                    <div className='max-sm:col-span-2 max-sm:mt-2'>
                      {
                        item.cancelled ? (
                          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200'>
                            <div className='w-2 h-2 rounded-full bg-red-500 mr-2'></div>
                            Cancelled
                          </span>
                        ) : item.isCompleted ? (
                          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200'>
                            <div className='w-2 h-2 rounded-full bg-green-500 mr-2'></div>
                            Completed
                          </span>
                        ) : (
                          <button 
                            onClick={()=>cancelAppointment(item._id)} 
                            className='px-4 py-2 rounded-lg text-sm font-semibold bg-black hover:bg-gray-900 text-white shadow-md hover:shadow-lg transition-all duration-200'
                          >
                            Cancel
                          </button>
                        )
                      }
                    </div>
                    
              </div>
            ))
           }

      </div>
       
    </div>
  )
}

export default AllAppointment