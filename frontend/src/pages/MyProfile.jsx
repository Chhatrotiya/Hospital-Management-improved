import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Appcontext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Myprofile = () => {
  // const [userData,setUserData]=useState({
  //   name:"Edward Vincent",
  //   image: assets.profile_pic,
  //   email:"hello@gmail.com",
  //   phone: "7485691232",
  //   address:{
  //     line1:"57th Cross, Richmond ",
  //     line2:"Circle, Church Road, London",
  //   },
  //   gender:"Male",
  //   dob:"2000-01-20",
  // })

  const {userData,setUserData,token,setToken,backendUrl,loadProfileData}=useContext(Appcontext)
  const [isEdit,setIsEdit]=useState(false);
  const [image,setImage]=useState(false);
  const navigate = useNavigate();

  const upadateUserProfileData=async ()=>{
   try {
    
    const formData=new FormData();
    formData.append('name',userData.name);
    formData.append('phone',userData.phone);
    formData.append('address',JSON.stringify(userData.address));
    formData.append('gender',userData.gender);
    formData.append('dob',userData.dob);

    image && formData.append('image',image)
 
    const {data}=await axios.post(backendUrl + '/api/user/update-profile',formData,{headers:{token}});
    if(data.success){
      toast.success(data.message)
      await loadProfileData();
      setIsEdit(false);
      setImage(false);
    }
     else{
      toast.error(data.message)
     }
   } catch (error) {
     toast.error(error.message);
   }
  }

  const deleteUserAccount = async () => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if(!confirmed) return;

      const { data } = await axios.delete(backendUrl + '/api/user/delete-profile', { headers: { token } });
      if(data.success){
        toast.success(data.message);
        localStorage.removeItem('token');
        setToken('');
        setUserData(false);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  return userData && (
    <div className='bg-transparent min-h-screen py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-stone-900 mb-2'>
            My <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Profile</span>
          </h1>
          <p className='text-stone-500 text-lg'>Manage your personal information</p>
        </div>

        <div className='bg-white border border-stone-200 rounded-2xl p-8 shadow-sm'>
          {/* Profile Image Section */}
          <div className='flex flex-col items-center mb-8'>
            <div className='relative'>
              {
                isEdit ? (
                  <label htmlFor="image" className='cursor-pointer'>
                    <div className='relative'>
                      <img
                        className='w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-stone-200 shadow-sm bg-stone-50'
                        src={image ? URL.createObjectURL(image) : userData.image}
                        alt="Profile"
                      />
                      <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                        <img className='w-8 h-8 invert translate-y-2' src={assets.upload_icon} alt="Upload" />
                      </div>
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} id='image' type='file' hidden />
                  </label>
                ) : (
                  <img
                    className='w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-stone-200 shadow-sm bg-stone-50'
                    src={userData.image}
                    alt="Profile"
                  />
                )
              }
            </div>

            {/* Name Section */}
            <div className='mt-6 text-center'>
              {
                isEdit ? (
                  <input
                    type="text"
                    className='text-2xl md:text-3xl bg-stone-50 border border-stone-300 rounded-lg px-4 py-2 text-stone-900 font-medium text-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm'
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    value={userData.name}
                  />
                ) : (
                  <h2 className='text-2xl md:text-3xl text-stone-900 font-medium'>
                    {userData.name}
                  </h2>
                )
              }
            </div>
          </div>

          {/* Contact Information Section */}
          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-stone-900 mb-6 pb-2 border-b border-stone-200'>
              <svg className='w-5 h-5 inline mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
              </svg> Contact Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='block text-stone-800 font-medium'>Email Address</label>
                <p className='text-primary bg-teal-50 border border-teal-200 rounded-lg px-4 py-3'>
                  {userData.email}
                </p>
              </div>

              <div className='space-y-2'>
                <label className='block text-stone-800 font-medium'>Phone Number</label>
                {
                  isEdit ? (
                    <input
                      type="text"
                      className='w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm'
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      value={userData.phone}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className='text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3'>
                      {userData.phone}
                    </p>
                  )
                }
              </div>
            </div>

            {/* Address Section */}
            <div className='mt-6 space-y-2'>
              <label className='block text-stone-800 font-medium'>Address</label>
              {
                isEdit ? (
                  <div className='space-y-3'>
                    <input
                      type="text"
                      className='w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm'
                      onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                      value={userData.address.line1}
                      placeholder="Address Line 1"
                    />
                    <input
                      type="text"
                      className='w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm'
                      onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                      value={userData.address.line2}
                      placeholder="Address Line 2"
                    />
                  </div>
                ) : (
                  <div className='text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3'>
                    {userData.address.line1}
                    <br />
                    {userData.address.line2}
                  </div>
                )
              }
            </div>
          </div>

          {/* Basic Information Section */}
          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-stone-900 mb-6 pb-2 border-b border-stone-200'>
              <svg className='w-5 h-5 inline mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg> Basic Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='block text-stone-800 font-medium'>Gender</label>
                {
                  isEdit ? (
                    <select
                      value={userData.gender}
                      className='w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-3 text-stone-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm'
                      onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <p className='text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3'>
                      {userData.gender}
                    </p>
                  )
                }
              </div>

              <div className='space-y-2'>
                <label className='block text-stone-800 font-medium'>Date of Birth</label>
                {
                  isEdit ? (
                    <input
                      type="date"
                      className='w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-3 text-stone-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm'
                      value={userData.dob || ""}
                      onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                    />
                  ) : (
                    <p className='text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3'>
                      {userData.dob || 'Not specified'}
                    </p>
                  )
                }
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col items-center gap-4 pt-6 border-t border-stone-200 md:flex-row md:justify-between'>
            {
              isEdit ? (
                <div className='flex flex-col sm:flex-row gap-4 w-full justify-center'>
                  <button
                    className='bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-lg font-medium transition-colors'
                    onClick={upadateUserProfileData}
                  >
                    <svg className='w-5 h-5 inline mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4v6m0 0v6m0-6h6m-6 0H9' />
                    </svg> Save Information
                  </button>
                  <button
                    className='bg-stone-200 hover:bg-stone-300 text-stone-800 px-8 py-3 rounded-lg font-medium transition-colors'
                    onClick={() => setIsEdit(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              ) : (
                <div className='flex flex-col sm:flex-row gap-4 w-full justify-center'>
                  <button
                    className='bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-lg font-medium transition-colors'
                    onClick={() => setIsEdit(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    className='bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors'
                    onClick={deleteUserAccount}
                  >
                    🗑️ Delete Account
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Myprofile