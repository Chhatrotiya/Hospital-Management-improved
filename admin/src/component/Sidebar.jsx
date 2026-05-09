import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
  const {atoken}=useContext(AdminContext);
  const {dtoken}=useContext(DoctorContext)
  return (
    <div className='min-h-screen bg-stone-50 border-r border-stone-200 flex flex-col'>
      <div className='px-6 py-4 border-b border-stone-200 bg-white'>
        <h2 className='text-lg font-bold text-primary'>Admin Panel</h2>
      </div>
      <div className='flex-1 overflow-auto'>
      {
        atoken && <ul className='text-stone-600 mt-5 space-y-1'>

          <NavLink className={({isActive})=>`flex items-center px-4 py-3.5 md:px-8 md:min-w-72 cursor-pointer transition-colors ${isActive? 'bg-primary/10 border-l-4 border-primary text-primary font-medium' : 'hover:bg-stone-100 hover:text-stone-800'}`} to={'/admin-dashboard'}>
            <p className=''>Dashboard</p>
          </NavLink>
           <NavLink className={({isActive})=>`flex items-center px-4 py-3.5 md:px-8 md:min-w-72 cursor-pointer transition-colors ${isActive? 'bg-primary/10 border-l-4 border-primary text-primary font-medium' : 'hover:bg-stone-100 hover:text-stone-800'}`} to={'/all-appointments'}>
            <p>Appointments</p>
          </NavLink>
           <NavLink className={({isActive})=>`flex items-center px-4 py-3.5 md:px-8 md:min-w-72 cursor-pointer transition-colors ${isActive? 'bg-primary/10 border-l-4 border-primary text-primary font-medium' : 'hover:bg-stone-100 hover:text-stone-800'}`} to={'/add-doctor'}>
            <p>Add Doctor</p>
          </NavLink> 
          <NavLink className={({isActive})=>`flex items-center px-4 py-3.5 md:px-8 md:min-w-72 cursor-pointer transition-colors ${isActive? 'bg-primary/10 border-l-4 border-primary text-primary font-medium' : 'hover:bg-stone-100 hover:text-stone-800'}`} to={'/doctors-list'}>
            <p>Doctor List</p>
          </NavLink>
        </ul>
      }
      {
        dtoken && <ul className='text-stone-600 mt-5 space-y-1'>

          <NavLink className={({isActive})=>`flex items-center px-4 py-3.5 md:px-8 md:min-w-72 cursor-pointer transition-colors ${isActive? 'bg-primary/10 border-l-4 border-primary text-primary font-medium' : 'hover:bg-stone-100 hover:text-stone-800'}`} to={'/doctor-dashboard'}>
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
           <NavLink className={({isActive})=>`flex items-center px-4 py-3.5 md:px-8 md:min-w-72 cursor-pointer transition-colors ${isActive? 'bg-primary/10 border-l-4 border-primary text-primary font-medium' : 'hover:bg-stone-100 hover:text-stone-800'}`} to={'/doctor-appointments'}>
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink className={({isActive})=>`flex items-center px-4 py-3.5 md:px-8 md:min-w-72 cursor-pointer transition-colors ${isActive? 'bg-primary/10 border-l-4 border-primary text-primary font-medium' : 'hover:bg-stone-100 hover:text-stone-800'}`} to={'/doctor-profile'}>
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      }
      </div>
    </div>
  )
}

export default Sidebar