import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorAppointments = () => {
    const {dtoken,appointments,getAppointments,completeAppointment,cancelAppointment}=useContext(DoctorContext);
     const {calculateAge,slotFormateDate}=useContext(AppContext)
    useEffect(()=>{
     if(dtoken){
        getAppointments()
     }
    },[dtoken])
  return (
    <div className='max-w-6xl w-full m-5 text-stone-800'>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-black'>All Appointments</h1>
        <p className='text-stone-500 mt-1'>Manage and track all your patient appointments</p>
      </div>

      <div className='bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-4 px-6 border-b border-stone-200 bg-stone-50'>
          <p className='text-stone-600 font-semibold'>#</p>
          <p className='text-stone-600 font-semibold'>Patient</p>
          <p className='text-stone-600 font-semibold'>Payment</p>
          <p className='text-stone-600 font-semibold'>Age</p>
          <p className='text-stone-600 font-semibold'>Date & Time</p>
          <p className='text-stone-600 font-semibold'>Fees</p>
          <p className='text-stone-600 font-semibold'>Action</p>
        </div>

        <div className='max-h-[80vh] overflow-y-auto'>
          {
            appointments.reverse().map((item,index)=>(
              <div className='flex flex-wrap justify-between max-sm:gap-4 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-stone-700 py-4 px-6 border-b border-stone-100 hover:bg-stone-50 transition-all duration-200' key={index}>
                <p className='max-sm:hidden font-medium text-stone-500'>{index+1}</p>
                <div className='flex items-center gap-3'>
                  <img className='w-10 h-10 rounded-full border-2 border-stone-200' src={item.userData.image} alt="" />
                  <div>
                    <p className='font-medium text-stone-800'>{item.userData.name}</p>
                    <p className='text-xs text-stone-500 max-sm:hidden'>Patient</p>
                  </div>
                </div>
                <div className='max-sm:col-span-2'>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    item.payment
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      item.payment ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {item.payment ? 'Online' : 'Cash'}
                  </span>
                </div>
                <p className='max-sm:hidden font-medium'>{calculateAge(item.userData.dob)}</p>
                <div className='max-sm:col-span-2'>
                  <p className='font-medium text-primary'>{slotFormateDate(item.slotDate)}</p>
                  <p className='text-sm text-stone-500'>{item.slotTime}</p>
                </div>
                <p className='font-semibold text-teal-600'>${item.amount}</p>
                <div className='max-sm:col-span-2'>
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
                      <div className='flex flex-wrap gap-2'>
                        <button
                          onClick={()=>cancelAppointment(item._id)}
                          className='p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 transition-all duration-200'
                          title="Cancel Appointment"
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                          </svg>
                        </button>
                        <button
                          onClick={()=>completeAppointment(item._id)}
                          className='p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 hover:border-green-300 transition-all duration-200'
                          title="Mark as Completed"
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                        </button>
                      </div>
                    )
                  }
                </div>

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments