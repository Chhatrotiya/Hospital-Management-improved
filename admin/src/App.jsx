import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AddDoctor from './pages/Admin/AddDoctor';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import DoctorsList from './pages/Admin/DoctorsList';
import PatientsList from './pages/Admin/PatientsList';
import PatientsEdit from './pages/Admin/PatientsEdit';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const {atoken}=useContext(AdminContext)
  const {dtoken}=useContext(DoctorContext)
  return atoken || dtoken?(
    <div className='bg-stone-100 text-stone-800 min-h-screen flex flex-col'>
      <ToastContainer theme="dark"/>
      <Navbar/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar className='w-64 flex-shrink-0'/>
        <main className='flex-1 p-6 overflow-auto'>
          <Routes>
            <Route path='/' element={<></>}/>
            <Route path='/add-doctor' element={<AddDoctor/>}/>
            <Route path='/admin-dashboard' element={<Dashboard/>}/>
            <Route path='/all-appointments' element={<AllAppointment/>}/>
            <Route path='/doctors-list' element={<DoctorsList/>}/>
            <Route path='/patients' element={<PatientsList/>}/>
            <Route path='/patients/:id/edit' element={<PatientsEdit/>}/>

            <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
            <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
            <Route path='/doctor-profile' element={<DoctorProfile/>}/>
          </Routes>
        </main>
      </div>
    </div>
  ):(
    <>
    <Login/>
      <ToastContainer/>
    </>
  )
}

export default App