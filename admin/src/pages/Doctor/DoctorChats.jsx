import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const DoctorChats = () => {
  const { backendUrl, dtoken, socket } = useContext(DoctorContext)
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const visibleChats = chats
    .filter((chat) => chat.latestMessage)
    .filter((chat) => chat.userName?.toLowerCase().includes(searchQuery.trim().toLowerCase()))

  const loadChats = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/chats', { headers: { dtoken } })
      if (data.success) setChats(data.chats)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dtoken) loadChats()
  }, [dtoken])

  useEffect(() => {
    if (!socket || !dtoken) return

    const refreshChats = () => {
      loadChats()
    }

    socket.on('newMessage', refreshChats)
    socket.on('messageStatusUpdate', refreshChats)

    return () => {
      socket.off('newMessage', refreshChats)
      socket.off('messageStatusUpdate', refreshChats)
    }
  }, [socket, dtoken])

  return (
    <div className='relative max-w-6xl w-full m-5 text-stone-800'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-black'>Patient Chats</h1>
        <p className='text-stone-500 mt-1'>View all conversations with patients and unread messages.</p>
      </div>

      <div className='mb-6'>
        <input
          type='search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search patients by name'
          className='w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-200'
        />
      </div>

      <div className='space-y-4 pb-24'>
        {loading ? (
          <div className='text-stone-500 text-center py-10'>Loading chats...</div>
        ) : visibleChats.length === 0 ? (
          <div className='text-center py-12 text-stone-500'>No chat sessions started yet.</div>
        ) : (
          visibleChats.map((chat) => (
              <div
                key={chat._id}
                role='button'
                tabIndex={0}
                onClick={() => navigate(`/doctor-chat/${chat._id}`)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/doctor-chat/${chat._id}`)}
                className='bg-white border border-stone-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:bg-stone-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40'
              >
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <img className='w-14 h-14 rounded-2xl object-cover border border-stone-200' src={chat.userImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt={chat.userName} />
                  <div>
                    <h2 className='text-xl font-semibold text-stone-900'>{chat.userName}</h2>
                    <p className='text-sm text-stone-500'>Appointment: {chat.slotDate} | {chat.slotTime}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  {chat.unreadCount > 0 && (
                    <span className='inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold'>
                      {chat.unreadCount} unread
                    </span>
                  )}
                </div>
              </div>

              {chat.latestMessage && (
                <div className='mt-4 text-sm text-stone-600'>
                  <span className='font-medium'>Last:</span> {chat.latestMessage.text}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => navigate('/doctor-patients')}
        className='fixed bottom-10 right-10 z-20 inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary text-black shadow-2xl shadow-black/10 hover:bg-teal-200 transition'
        aria-label='Start new chat'
      >
        <span className='text-3xl font-bold leading-none'>+</span>
      </button>
    </div>
  )
}

export default DoctorChats
