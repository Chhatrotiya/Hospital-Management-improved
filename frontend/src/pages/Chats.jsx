import React, { useContext, useEffect, useState } from 'react'
import { Appcontext } from '../context/AppContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Chats = () => {
  const { backendUrl, token, socket } = useContext(Appcontext)
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const loadChats = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/chats', { headers: { token } })
      if (data.success) {
        setChats(data.chats)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadChats()
  }, [token])

  useEffect(() => {
    if (!socket || !token) return

    const refreshChats = () => {
      loadChats()
    }

    socket.on('newMessage', refreshChats)
    socket.on('messageStatusUpdate', refreshChats)

    return () => {
      socket.off('newMessage', refreshChats)
      socket.off('messageStatusUpdate', refreshChats)
    }
  }, [socket, token])

  const visibleChats = chats
    .filter(chat => chat.latestMessage)
    .filter(chat => chat.docName?.toLowerCase().includes(searchQuery.trim().toLowerCase()))

  return (
    <div className='bg-transparent min-h-screen py-8 px-4'>
      <div className='max-w-5xl mx-auto relative'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-stone-900 mb-2'>Doctor Conversations</h1>
          <p className='text-stone-500'>All your doctor chats with unread message counts.</p>
        </div>

        <div className='mb-6'>
          <input
            type='search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search chats by doctor name'
            className='w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-200'
          />
        </div>

        <div className='space-y-4'>
          {loading ? (
            <div className='text-stone-500 text-center py-10'>Loading chats...</div>
          ) : visibleChats.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-stone-500 mb-4'>No chat sessions yet.</p>
              <button
                onClick={() => navigate('/my-appointment')}
                className='bg-primary text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition'
              >
                Start a chat from an appointment
              </button>
            </div>
          ) : (
            visibleChats.map((chat) => (
              <div
                key={chat._id}
                role='button'
                tabIndex={0}
                onClick={() => navigate(`/chat/${chat._id}`)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/chat/${chat._id}`)}
                className='bg-white border border-stone-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:bg-stone-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40'
              >
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div className='flex items-center gap-4'>
                    <img className='w-14 h-14 rounded-2xl object-cover border border-stone-200' src={chat.docImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt={chat.docName} />
                    <div>
                      <h2 className='text-xl font-semibold text-stone-900'>{chat.docName}</h2>
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
          onClick={() => navigate('/doctors')}
          className='fixed bottom-10 right-10 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black shadow-2xl shadow-black/10 hover:bg-teal-200 transition'
          aria-label='Browse doctors'
        >
          <span className='text-3xl font-bold leading-none'>+</span>
        </button>
      </div>
    </div>
  )
}

export default Chats
