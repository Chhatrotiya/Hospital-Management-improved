import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {

  const {profileData,setProfileData,dtoken,getProfileData,backendUrl}=useContext(DoctorContext);
  const [isEdit,setIsEdit]=useState(false);

const updateprofile= async()=>{
  try {
    const updateData={
      address:profileData.address,
      fees:profileData.fees,
      available:profileData.available
    }
    const {data}=await axios.post(backendUrl + '/api/doctor/update-profile',updateData,{headers:{dtoken}})
    if(data.success){
      toast.success(data.message);
      setIsEdit(false);
      getProfileData()
    }
  } catch (err) {
     toast.error(err.message);
  }
}
  
  useEffect(()=>{
    if(dtoken){
      getProfileData()
    }
  },[dtoken])

  return profileData && (
    <div className='m-5 text-stone-800'>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-black'>Doctor Profile</h1>
        <p className='text-stone-500 mt-2'>Manage your professional information and availability</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

        {/* Profile Image Section */}
        <div className='lg:col-span-1'>
          <div className='bg-white border border-stone-200 rounded-2xl p-6 shadow-lg'>
            <div className='flex flex-col items-center'>
              <div className='relative'>
                <img
                  className='w-48 h-48 rounded-2xl object-cover border-4 border-stone-200 shadow-lg'
                  src={profileData.image}
                  alt={profileData.name}
                />
                <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
              </div>
              <div className='mt-4 text-center'>
                <h3 className='text-xl font-bold text-stone-800'>{profileData.name}</h3>
                <p className='text-stone-500 mt-1'>{profileData.degree} - {profileData.speciality}</p>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mt-2'>
                  {profileData.experience} years experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className='lg:col-span-2'>
          <div className='bg-white border border-stone-200 rounded-2xl p-8 shadow-lg'>

            {/* About Section */}
            <div className='mb-8'>
              <h4 className='text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
                <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                About
              </h4>
              <p className='text-stone-600 leading-relaxed'>{profileData.about}</p>
            </div>

            {/* Appointment Fee */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-stone-600 mb-2'>Appointment Fee</label>
              <div className='flex items-center gap-3'>
                <span className='text-2xl font-bold text-teal-600'>$</span>
                {isEdit ? (
                  <input
                    type="number"
                    value={profileData.fees}
                    onChange={(e)=>setProfileData((prev)=>({...prev,fees:e.target.value}))}
                    className='flex-1 px-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  />
                ) : (
                  <span className='text-2xl font-bold text-stone-800'>{profileData.fees}</span>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-stone-600 mb-2'>Address</label>
              <div className='space-y-3'>
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={profileData.address.line1}
                      onChange={(e)=>setProfileData((prev)=>({...prev,address:{...prev.address,line1:e.target.value}}))}
                      className='w-full px-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={profileData.address.line2}
                      onChange={(e)=>setProfileData((prev)=>({...prev,address:{...prev.address,line2:e.target.value}}))}
                      className='w-full px-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    />
                  </>
                ) : (
                  <div className='text-stone-600'>
                    <p>{profileData.address.line1}</p>
                    <p>{profileData.address.line2}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className='mb-8'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  checked={profileData.available}
                  onChange={()=>isEdit && setProfileData(prev=>({...prev,available:!prev.available}))}
                  type="checkbox"
                  className='w-5 h-5 text-primary bg-stone-50 border-stone-300 rounded focus:ring-primary focus:ring-2 accent-primary'
                />
                <span className='text-stone-600 font-medium'>Available for appointments</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  profileData.available
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    profileData.available ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {profileData.available ? 'Available' : 'Unavailable'}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              {isEdit ? (
                <>
                  <button
                    onClick={updateprofile}
                    className='px-6 py-2 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200'
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={()=>setIsEdit(false)}
                    className='px-6 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-lg transition-all duration-200'
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={()=>setIsEdit(true)}
                  className='px-6 py-2 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200'
                >
                  Edit Profile
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

export default DoctorProfile