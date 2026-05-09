import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { Appcontext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const { token, setToken } = useContext(Appcontext)

    const logOut = () => {
        setToken(false);
        localStorage.removeItem('token')
    }

    const closeMenu = () => setShowMenu(false);

  return (
    <>
      {/* ── Navbar Bar ── */}
      <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-stone-200 bg-white sticky top-0 z-50 rounded-lg px-6 shadow-sm'>
        <h1 onClick={() => navigate('/')} className='text-primary text-xl sm:text-2xl font-bold cursor-pointer'>mediVerse</h1>

        {/* Desktop links */}
        <ul className='hidden md:flex items-start gap-5 font-medium text-stone-600'>
          <NavLink to='/'><li className='py-1 hover:text-primary transition-colors'>Home</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/></NavLink>
          <NavLink to='/doctors'><li className='py-1 hover:text-primary transition-colors'>All Doctors</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/></NavLink>
          <NavLink to='/about'><li className='py-1 hover:text-primary transition-colors'>About</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/></NavLink>
          <NavLink to='/contact'><li className='py-1 hover:text-primary transition-colors'>Contact</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/></NavLink>
        </ul>

        {/* Desktop right side */}
        <div className='flex items-center gap-4'>
          {token
            ? <div className='hidden md:flex items-center gap-2 cursor-pointer group relative'>
                <img className='w-8 rounded-lg' src={assets.profile_pic} alt="" />
                <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-stone-600 z-20 hidden group-hover:block'>
                  <div className='min-w-48 bg-white shadow-xl rounded-lg flex flex-col gap-4 p-4 border border-stone-100'>
                    <p onClick={() => navigate('/my-profile')} className='hover:text-primary cursor-pointer transition-colors'>My Profile</p>
                    <p onClick={() => navigate('/my-appointment')} className='hover:text-primary cursor-pointer transition-colors'>My Appointment</p>
                    <p onClick={logOut} className='hover:text-red-500 cursor-pointer transition-colors'>Logout</p>
                  </div>
                </div>
              </div>
            : <button onClick={() => navigate('/login')} className='hidden md:block bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-lg font-medium transition-colors'>
                Create Account
              </button>
          }

          {/* Hamburger – mobile only */}
          <button onClick={() => setShowMenu(true)} className='md:hidden p-1' aria-label='Open menu'>
            <img src={assets.menu_icon} className='w-6 invert' alt='Menu' />
          </button>
        </div>
      </div>

      {/* ── Mobile Backdrop ── rendered outside navbar so z-index is clean */}
      {showMenu && (
        <div
          className='fixed inset-0 bg-black/40 z-[90] md:hidden'
          onClick={closeMenu}
        />
      )}

      {/* ── Mobile Slide-in Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-[100] shadow-2xl
          flex flex-col md:hidden
          transition-transform duration-300 ease-in-out
          ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className='flex items-center justify-between px-5 py-5 border-b border-stone-100 bg-white'>
          <h1 onClick={() => { navigate('/'); closeMenu(); }} className='text-primary text-lg font-bold cursor-pointer'>
            Hospital Management
          </h1>
          <button onClick={closeMenu} className='p-1' aria-label='Close menu'>
            <img src={assets.cross_icon} className='w-5 invert' alt='Close' />
          </button>
        </div>

        {/* Nav links */}
        <nav className='flex-1 overflow-y-auto bg-white'>
          <NavLink
            to='/' onClick={closeMenu}
            className={({ isActive }) => `block w-full py-4 px-5 text-base font-medium border-b border-stone-100 transition-colors ${isActive ? 'text-primary bg-teal-50' : 'text-stone-700 hover:text-primary hover:bg-stone-50'}`}
          >Home</NavLink>
          <NavLink
            to='/doctors' onClick={closeMenu}
            className={({ isActive }) => `block w-full py-4 px-5 text-base font-medium border-b border-stone-100 transition-colors ${isActive ? 'text-primary bg-teal-50' : 'text-stone-700 hover:text-primary hover:bg-stone-50'}`}
          >All Doctors</NavLink>
          <NavLink
            to='/about' onClick={closeMenu}
            className={({ isActive }) => `block w-full py-4 px-5 text-base font-medium border-b border-stone-100 transition-colors ${isActive ? 'text-primary bg-teal-50' : 'text-stone-700 hover:text-primary hover:bg-stone-50'}`}
          >About Us</NavLink>
          <NavLink
            to='/contact' onClick={closeMenu}
            className={({ isActive }) => `block w-full py-4 px-5 text-base font-medium border-b border-stone-100 transition-colors ${isActive ? 'text-primary bg-teal-50' : 'text-stone-700 hover:text-primary hover:bg-stone-50'}`}
          >Contact Us</NavLink>
        </nav>

        {/* Auth section */}
        <div className='p-5 border-t border-stone-100 bg-white'>
          {token
            ? <div className='flex flex-col gap-3 text-sm font-medium text-stone-700'>
                <div className='flex items-center gap-3 mb-1'>
                  <img className='w-9 rounded-lg border border-stone-200' src={assets.profile_pic} alt='Profile' />
                  <span className='text-stone-500 text-xs'>My Account</span>
                </div>
                <p onClick={() => { navigate('/my-profile'); closeMenu(); }} className='hover:text-primary cursor-pointer transition-colors'>My Profile</p>
                <p onClick={() => { navigate('/my-appointment'); closeMenu(); }} className='hover:text-primary cursor-pointer transition-colors'>My Appointments</p>
                <p onClick={() => { logOut(); closeMenu(); }} className='hover:text-red-500 cursor-pointer transition-colors'>Logout</p>
              </div>
            : <button
                onClick={() => { navigate('/login'); closeMenu(); }}
                className='w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-lg font-medium transition-colors'
              >
                Create Account / Login
              </button>
          }
        </div>
      </div>
    </>
  )
}

export default Navbar