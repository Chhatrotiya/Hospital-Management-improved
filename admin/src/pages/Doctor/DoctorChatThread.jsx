import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const DoctorChatThread = () => {
  const { chatId } = useParams()
  const { backendUrl, dtoken, loadChatCount } = useContext(DoctorContext)
  const [messages, setMessages] = useState([])
  const [chatInfo, setChatInfo] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const messageListRef = useRef(null)
  const hasPositionedInitialScrollRef = useRef(false)

  const scrollToBottom = (behavior = 'smooth') => {
    const container = messageListRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' })
  }

  const loadChat = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/doctor/chat/${chatId}`, { headers: { dtoken } })
      if (data.success) {
        setChatInfo(data.chat)
        setMessages(data.chat.messages || [])
        hasPositionedInitialScrollRef.current = false
        loadChatCount?.()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!dtoken || !chatId) return
    loadChat()
  }, [dtoken, chatId])

  useEffect(() => {
    if (!chatInfo) return
    if (!hasPositionedInitialScrollRef.current) {
      scrollToBottom('auto')
      hasPositionedInitialScrollRef.current = true
      return
    }
    scrollToBottom('smooth')
  }, [messages, chatInfo])

  useEffect(() => {
    if (!loading && !hasPositionedInitialScrollRef.current) {
      scrollToBottom('auto')
      hasPositionedInitialScrollRef.current = true
    }
  }, [loading])

  useEffect(() => {
    if (!dtoken) return
    const socketClient = io(backendUrl, { auth: { token: dtoken } })
    setSocket(socketClient)

    socketClient.on('connect', () => {
      socketClient.emit('joinUser', { role: 'doctor' })
      socketClient.emit('joinChat', { chatId, role: 'doctor' })
    })

    socketClient.on('chatMessage', ({ message }) => {
      if (message.sender === 'user') {
        loadChatCount?.()
      }
      setMessages((prev) => {
        if (prev.some((item) => item._id === message._id)) return prev

        const pendingIndex = prev.findIndex(
          (item) => item._id?.startsWith('temp-') && item.sender === message.sender && item.text === message.text
        )
        if (pendingIndex !== -1) {
          const updated = [...prev]
          updated[pendingIndex] = message
          return updated
        }

        return [...prev, message]
      })
    })

    socketClient.on('messageStatusUpdate', ({ messageId, tempId, status }) => {
      if (!messageId && !tempId) return
      setMessages((prev) => prev.map((item) => {
        if (item._id === messageId || (tempId && item.tempId === tempId)) {
          return { ...item, status }
        }
        return item
      }))
      loadChatCount?.()
    })

    socketClient.on('connect_error', (error) => {
      toast.error(error.message || 'Unable to connect to chat server')
    })

    socketClient.on('error', (error) => {
      const message = typeof error === 'string' ? error : error?.message || 'Chat error'
      toast.error(message)
    })

    return () => {
      socketClient.disconnect()
    }
  }, [backendUrl, dtoken, chatId, loadChatCount])

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return
    const messageText = newMessage.trim()
    const tempId = `temp-${Date.now()}`
    const optimisticMessage = {
      _id: tempId,
      tempId,
      sender: 'doctor',
      text: messageText,
      status: 'sent',
      createdAt: Date.now()
    }
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage('')
    socket.emit('sendMessage', { chatId, text: messageText, sender: 'doctor', tempId })
  }

  return (
    <div className='max-w-5xl w-full m-5 text-stone-800'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-black'>Chat with {chatInfo?.userName || 'Patient'}</h1>
        <p className='text-stone-500 mt-1'>Appointment: {chatInfo?.slotDate} | {chatInfo?.slotTime}</p>
      </div>

      <div className='bg-white border border-stone-200 rounded-3xl shadow-sm h-[70vh] overflow-hidden flex flex-col'>
        <div ref={messageListRef} className='flex-1 overflow-y-auto p-5 space-y-4'>
          {loading ? (
            <div className='text-stone-500 text-center py-10'>Loading conversation…</div>
          ) : messages.length === 0 ? (
            <div className='text-center text-stone-500 py-10'>No messages yet. Send your first message.</div>
          ) : (
            messages.map((message) => {
              const isDoctor = message.sender === 'doctor'
              return (
                <div key={message._id} className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm ${isDoctor ? 'bg-primary/10 text-stone-800 border border-primary/20' : 'bg-stone-100 text-stone-800 border border-stone-200'}`}>
                    <p className='text-sm leading-6 break-words whitespace-pre-wrap'>{message.text}</p>
                    <div className='mt-2 text-[11px] text-stone-400 flex items-center justify-between gap-2'>
                      <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isDoctor && (
                        <span className='font-semibold'>
                          {message.status === 'sent' && 'Sent'}
                          {message.status === 'received' && 'Received'}
                          {message.status === 'read' && 'Read'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className='border-t border-stone-200 p-4 bg-stone-50'>
          <div className='flex items-center gap-3'>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type='text'
              placeholder='Write a message...'
              className='flex-1 rounded-full border border-stone-200 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className='rounded-full bg-primary px-5 py-3 text-black font-semibold hover:bg-teal-200 transition'
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorChatThread
