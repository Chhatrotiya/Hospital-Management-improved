import React from 'react'
// import './App.css'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Myprofile from './pages/Myprofile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import Chats from './pages/Chats'
import ChatThread from './pages/ChatThread'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
 import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <>
    <div className='bg-stone-100 text-stone-800 min-h-screen font-sans'>
      <div className='mx-4 sm:mx-[10%]'>
        <Navbar/>
         <ToastContainer theme="light" />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/doctors' element={<Doctors/>}/>
          <Route path='/doctors/:speciality' element={<Doctors/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/my-appointment' element={<MyAppointment/>}/>
          <Route path='/my-profile' element={<Myprofile/>}/>
          <Route path='/chats' element={<Chats/>}/>
          <Route path='/chat/:chatId' element={<ChatThread/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/appointment/:docId' element={<Appointment/>}/>
        </Routes>
          <Footer/>
      </div>
    </div>
    </>
  )
}

export default App
