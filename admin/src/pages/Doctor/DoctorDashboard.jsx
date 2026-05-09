import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
  
  const {dtoken,setDashData,dashData,getDashData,cancelAppointment,completeAppointment}=useContext(DoctorContext)
  const {slotFormateDate}=useContext(AppContext)

  useEffect(()=>{
    if (dtoken) {
      getDashData()
    }
  },[dtoken])

  return dashData && (
    <div className='m-5 text-stone-800'>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-black'>Doctor Dashboard</h1>
        <p className='text-stone-500 mt-2'>Welcome back! Here's your practice overview</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>

        <div className='bg-gradient-to-br from-teal-500/10 to-teal-600/10 border border-teal-500/20 p-6 rounded-2xl hover:border-teal-400/40 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 group'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-teal-500/20 rounded-xl group-hover:bg-teal-500/30 transition-colors'>
              <svg className='w-8 h-8 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
              </svg>
            </div>
            <div>
              <p className='text-3xl font-bold text-stone-800 group-hover:text-teal-600 transition-colors'>${dashData.earnings}</p>
              <p className='text-stone-500 font-medium'>Total Earnings</p>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-primary/10 to-teal-500/10 border border-primary/20 p-6 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors'>
              <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6' />
              </svg>
            </div>
            <div>
              <p className='text-3xl font-bold text-stone-800 group-hover:text-primary transition-colors'>{dashData.appointments}</p>
              <p className='text-stone-500 font-medium'>Total Appointments</p>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-stone-100 to-stone-200 border border-stone-200 p-6 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors'>
              <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
            <div>
              <p className='text-3xl font-bold text-stone-800 group-hover:text-primary transition-colors'>{dashData.patients}</p>
              <p className='text-stone-500 font-medium'>Total Patients</p>
            </div>
          </div>
        </div>

      </div>

      <div className='bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden'>
        <div className='flex items-center gap-3 px-6 py-5 border-b border-stone-200 bg-stone-50'>
          <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
          </svg>
          <p className='text-stone-800 font-semibold text-lg'>Latest Appointments</p>
        </div>

        <div className='max-h-96 overflow-y-auto'>
          {
            dashData.latestAppointments.map((item,index)=>(
              <div className='flex items-center px-6 py-4 gap-4 hover:bg-stone-50 border-b border-stone-100 last:border-b-0 transition-all duration-200' key={index}>
                <img className='rounded-full w-12 h-12 border-2 border-stone-200' src={item.userData.image} alt="" />
                <div className='flex-1'>
                  <p className='text-stone-800 font-semibold text-base'>{item.userData.name}</p>
                  <p className='text-stone-500 text-sm'>{slotFormateDate(item.slotDate)}</p>
                </div>
                <div className='text-right'>
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
                      <div className='flex gap-2'>
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

export default DoctorDashboard