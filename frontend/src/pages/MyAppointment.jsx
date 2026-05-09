import React, { useContext } from 'react'
import {Appcontext} from '../context/AppContext.jsx'
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyAppointment = () => {
   const navigate=useNavigate()
  const {backendUrl,token,getAllDoctors}=useContext(Appcontext);
  const [appointments,setAppointments]=useState([]);
  const months=[" ",'Jan','Fab','Mar','Apr',"May",'Jun',"Jul",'Aug',"Sep","Oct",'Nov','Dec'];

  const slotFormateDate=(slotDate)=>{
    const dateArray=slotDate.split('_');
    return dateArray[0]+ " " + months[Number(dateArray[1])]+ " "+ dateArray[2];
  }

  const getUserAppointments=async()=>{
    try {

      const {data}=await axios.get(backendUrl + '/api/user/appointments',{headers:{token}});

      if(data.success){
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);

      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

const cancelAppointment=async(appointmentId)=>{
  try {
    const {data}=await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})

    if(data.success){
      toast.success(data.message);
      getUserAppointments()
      getAllDoctors()
    }
    else{
      toast.error(data.message)
    }

  } catch (error) {
         console.log(error);
      toast.error(error.message);
  }
}

const initPay= async (order)=>{
const options={
  key:import.meta.env.VITE_RAZORPAY_KEY_ID,
 amount:order.amount,
 currency:order.currency,
 name:'Appointment payment',
 description:'Appointment payment',
 order_id:order.id,
 receipt:order.receipt,
 handler:async (response)=>{
  console.log(response);

  try {
    
    const {data}=await axios.post(backendUrl + '/api/user/varifyRazorpay',response,{headers:{token}});
    if(data.success){
      getUserAppointments(),
      navigate('/my-appointment')
      toast.success(data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error(error.message)
  }
  
 }
}
const rzp=new window.Razorpay(options)
rzp.open()
}

const appointmentRazorpay=async(appointmentId)=>{
try {
  
  const {data}=await axios.post(backendUrl + '/api/user/payment-razorpay',{appointmentId},{headers:{token}});
if(data.success){
  console.log(data.order)
  initPay(data.order);
}
} catch (error) {
    console.log(error);
      toast.error(error.message);
}
}

  useEffect(()=>{
    if(token){
      getUserAppointments()
    }
  },[token])

  return (
    <div className='bg-transparent min-h-screen py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-stone-900 mb-2'>
            My <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Appointments</span>
          </h1>
          <p className='text-stone-500 text-lg'>Manage your healthcare appointments</p>
        </div>

        {/* Appointments List */}
        <div className='space-y-6'>
          {appointments.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-stone-500 text-lg mb-4'>No appointments found</div>
              <button
                onClick={() => navigate('/doctors')}
                className='bg-primary hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg'
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            appointments.map((item, index) => (
              <div key={index} className='bg-white border border-stone-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md'>
                <div className='flex flex-col lg:flex-row gap-6 items-start lg:items-center'>

                  {/* Doctor Image */}
                  <div className='flex-shrink-0'>
                    <img
                      className='w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover bg-stone-50 border border-stone-200'
                      src={item.docData.image}
                      alt={item.docData.name}
                    />
                  </div>

                  {/* Appointment Details */}
                  <div className='flex-1 space-y-3'>
                    <div>
                      <h3 className='text-xl font-bold text-stone-900 mb-1'>{item.docData.name}</h3>
                      <p className='text-stone-500 text-sm mb-2'>{item.speciality}</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {/* Address */}
                      <div>
                        <h4 className='text-stone-800 font-medium mb-2'><svg className='w-5 h-5 inline mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>Address</h4>
                        <div className='text-stone-600 text-sm space-y-1'>
                          <p>{item.docData.address.line1}</p>
                          <p>{item.docData.address.line2}</p>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div>
                        <h4 className='text-stone-800 font-medium mb-2'><svg className='w-5 h-5 inline mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>Date & Time</h4>
                        <p className='text-stone-600 text-sm'>
                          {slotFormateDate(item.slotDate)} | {item.slotTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col gap-3 w-full lg:w-auto lg:min-w-[200px]'>

                    {/* Status Indicators */}
                    {item.cancelled && !item.isCompleted && (
                      <div className='flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2'>
                        <span className='text-lg'>❌</span>
                        <span className='text-sm font-medium'>Appointment Cancelled</span>
                      </div>
                    )}

                    {item.isCompleted && (
                      <div className='flex items-center gap-2 text-teal-600 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2'>
                        <span className='text-lg'>✅</span>
                        <span className='text-sm font-medium'>Completed</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {!item.cancelled && item.payment && !item.isCompleted && (
                      <button className='w-full bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-lg font-medium transition-colors'>
                        <svg className='w-5 h-5 inline mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg> Paid
                      </button>
                    )}

                    {!item.cancelled && !item.payment && !item.isCompleted && (
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className='w-full bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg font-medium transition-colors'
                      >
                        <svg className='w-5 h-5 inline mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h8m4 0h.01M7 19h8m4 0h.01M4 7h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z' />
                        </svg> Pay Online
                      </button>
                    )}

                    {!item.cancelled && !item.isCompleted && (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className='w-full bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 hover:text-red-700 transition-colors'
                      >
                        ❌ Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {appointments.length > 0 && (
          <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white border border-stone-200 rounded-xl p-6 text-center shadow-sm'>
              <div className='text-3xl font-bold text-primary mb-2'>{appointments.length}</div>
              <div className='text-stone-500'>Total Appointments</div>
            </div>
            <div className='bg-white border border-stone-200 rounded-xl p-6 text-center shadow-sm'>
              <div className='text-3xl font-bold text-teal-600 mb-2'>
                {appointments.filter(apt => apt.isCompleted).length}
              </div>
              <div className='text-stone-500'>Completed</div>
            </div>
            <div className='bg-white border border-stone-200 rounded-xl p-6 text-center shadow-sm'>
              <div className='text-3xl font-bold text-primary mb-2'>
                {appointments.filter(apt => apt.payment && !apt.cancelled).length}
              </div>
              <div className='text-stone-500'>Paid</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointment