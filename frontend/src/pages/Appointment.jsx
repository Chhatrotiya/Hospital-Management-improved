import React, { use, useContext, useEffect, useState } from 'react'
import { data, useNavigate, useParams } from 'react-router-dom'
import { Appcontext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const {docId}=useParams();
  const {doctors,currencySymbol,backendUrl,token,getAllDoctors}=useContext(Appcontext);

  const daysOfWeek=['SUN','MON','WED','TUE','THU','FRI','SAT']
  
  const [docInfo,setDocInfo]=useState({})
  const [docSlots,setDocslots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime,setSlotTime]=useState('');

  const navigate=useNavigate();

  const fetchDocInfo=()=>{
     const docInfo=doctors.find(doc=>doc._id===docId);
     setDocInfo(docInfo);
     console.log(docInfo);
  }

  const getAvailableSlots=async ()=>{
    if (!docInfo || !docInfo.slots_booked) return;
   setDocslots([]);
    let today=new Date();
    for(let i=0;i<7;i++){
    
      let currDate=new Date(today);
      currDate.setDate(today.getDate()+i);

      let endTime=new Date();
      endTime.setDate(today.getDate()+i);
      endTime.setHours(24,0,0,0);

      if(today.getDate()===currDate.getDate()){
         currDate.setHours(currDate.getHours()>10? currDate.getHours()+1:10 );
         currDate.setMinutes(currDate.getMinutes()>30?30:0);
      }
      else{
        currDate.setHours(10);
        currDate.setMinutes(0);
      }
      let timeSlots=[];
      while(currDate<endTime){
        let formattedTime=currDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:true});

        let day=currDate.getDate();
      let month=currDate.getMonth()+1;
      let year=currDate.getFullYear();

      const slotDate=day+ '_' + month + '_' +year
      const slotTime=formattedTime

      const isSlotAvailable= docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)?false:true;
       if(isSlotAvailable) { 
        timeSlots.push({
          datetime:new Date(currDate),
          time:formattedTime,
        })
      }
         currDate.setMinutes(currDate.getMinutes()+30);
      }
   setDocslots(prev=>([...prev,timeSlots]));
    }
  }

  const bookAppointment=async()=>{
    if(!token){
      toast.warn("Login to book appointment");
      return navigate('/login')
    }
    try {
      const date=docSlots[slotIndex][0].datetime
      let day=date.getDate();
      let month=date.getMonth()+1;
      let year=date.getFullYear();

      const slotDate=day+ '_' + month + '_' +year
      console.log(slotDate);

      const {data}=await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}});
      if(data.success){
        toast.success(data.message)
        getAllDoctors()
        navigate('/my-appointment')
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const startChat=async() => {
    if (!token) {
      toast.warn('Login to chat with doctor');
      return navigate('/login')
    }

    try {
      const { data } = await axios.post(backendUrl + '/api/user/chat', { doctorId: docId }, { headers: { token } })
      if (data.success) {
        navigate(`/chat/${data.chat._id}`)
      } else {
        toast.error(data.message || 'Unable to start chat with doctor')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message || 'Unable to start chat with doctor')
    }
  }

  useEffect(()=>
  {
    fetchDocInfo()
  }
  ,[doctors,docId])

  useEffect(()=>{
   getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots]);

  return docInfo && (
    <div className='bg-transparent min-h-screen py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Doctor Profile Section */}
        <div className='flex flex-col lg:flex-row gap-8 mb-8'>

          {/* Doctor Image */}
          <div className='flex-shrink-0'>
            <img
              className='w-full max-w-sm mx-auto lg:mx-0 rounded-2xl shadow-sm border-4 border-stone-200 bg-stone-50'
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          {/* Doctor Information Card */}
          <div className='flex-1 bg-white border border-stone-200 rounded-2xl p-8 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <h1 className='text-3xl font-bold text-stone-900'>{docInfo.name}</h1>
              <img className='w-6 h-6' src={assets.verified_icon} alt="Verified" />
            </div>

            <div className='flex flex-wrap items-center gap-3 mb-4'>
              <span className='text-stone-600 text-lg'>{docInfo.degree} - {docInfo.speciality}</span>
              <span className='bg-teal-50 text-primary px-3 py-1 rounded-lg text-sm border border-teal-200 font-medium'>
                {docInfo.experience}
              </span>
            </div>

            <div className='mb-6'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-stone-900 font-medium'>About</span>
                <img className='w-4 h-4' src={assets.info_icon} alt="Info" />
              </div>
              <p className='text-stone-600 leading-relaxed'>{docInfo.about}</p>
            </div>

            <div className='flex items-center justify-between pt-4 border-t border-stone-200'>
              <div className='text-stone-900'>
                <span className='text-stone-600'>Appointment Fee:</span>
                <span className='text-2xl font-bold text-primary ml-2'>{currencySymbol}{docInfo.fees}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className='bg-white border border-stone-200 rounded-2xl p-8 shadow-sm'>
          <h2 className='text-2xl font-bold text-stone-900 mb-6'><svg className='w-6 h-6 inline mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>Booking Slots</h2>

          {/* Date Selection */}
          <div className='mb-6'>
            <h3 className='text-stone-900 font-medium mb-4'>Select Date</h3>
            <div className='flex gap-3 overflow-x-auto pb-2'>
              {
                docSlots.length && docSlots.map((item, index) => (
                  <div
                    onClick={() => setSlotIndex(index)}
                    className={`flex-shrink-0 text-center py-4 px-6 rounded-xl cursor-pointer transition-all duration-300 min-w-[80px] ${
                      slotIndex === index
                        ? 'bg-stone-900 text-white'
                        : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-900'
                    }`}
                    key={index}
                  >
                    <p className='text-sm font-medium'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p className='text-lg font-bold'>{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Time Selection */}
          <div className='mb-8'>
            <h3 className='text-stone-900 font-medium mb-4'>Select Time</h3>
            <div className='flex flex-wrap gap-3'>
              {
                docSlots.length && docSlots[slotIndex].map((item, index) => (
                  <button
                    onClick={() => setSlotTime(item.time)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      item.time === slotTime
                        ? 'bg-stone-900 text-white'
                        : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-900'
                    }`}
                    key={index}
                  >
                    {item.time}
                  </button>
                ))
              }
            </div>
          </div>

          {/* Book Appointment and Start Chat Buttons */}
          <div className='text-center space-y-4'>
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
              <button
                onClick={bookAppointment}
                className='bg-stone-900 hover:bg-stone-800 text-white text-lg font-medium px-12 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={!slotTime}
              >
                {slotTime ? 'Book Appointment' : 'Select a time slot'}
              </button>
              <button
                onClick={startChat}
                className='bg-white border border-stone-900 text-stone-900 text-lg font-medium px-10 py-4 rounded-lg transition-colors hover:bg-stone-900 hover:text-white flex items-center justify-center gap-2'
              >
                <span className='text-2xl leading-none'>+</span>
                <span>Chat with Doctor</span>
              </button>
            </div>
            {!slotTime && (
              <p className='text-stone-500 text-sm mt-2'>Please select a date and time to continue</p>
            )}
          </div>
        </div>

        {/* Related Doctors */}
        <div className='mt-12'>
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    </div>
  )
}

export default Appointment