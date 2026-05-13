import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Appcontext } from '../context/AppContext.jsx'
import axios from 'axios'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const ChatThread = () => {
  const { chatId } = useParams()
  const { backendUrl, token, loadChatCount } = useContext(Appcontext)
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
      const { data } = await axios.get(backendUrl + `/api/user/chat/${chatId}`, { headers: { token } })
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
    if (!token || !chatId) return
    loadChat()
  }, [token, chatId])

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
    if (!token) return
    const socketClient = io(backendUrl, { auth: { token } })
    setSocket(socketClient)

    socketClient.on('connect', () => {
      socketClient.emit('joinUser')
      socketClient.emit('joinChat', { chatId, role: 'user' })
    })

    socketClient.on('chatMessage', ({ message }) => {
      if (message.sender === 'doctor') {
        loadChatCount?.()
      }
      setMessages((prev) => {
        if (prev.some((item) => item._id === message._id)) return prev

        const pendingIndex = prev.findIndex(
          (item) => item.tempId && message.tempId && item.tempId === message.tempId
        )
        if (pendingIndex !== -1) {
          const updated = [...prev]
          updated[pendingIndex] = message
          return updated
        }

        const fallbackIndex = prev.findIndex(
          (item) => item._id?.startsWith('temp-') && item.sender === message.sender && item.text === message.text
        )
        if (fallbackIndex !== -1) {
          const updated = [...prev]
          updated[fallbackIndex] = message
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
      if (loadChatCount) {
        loadChatCount()
      }
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
  }, [backendUrl, token, chatId, loadChatCount])

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return
    const messageText = newMessage.trim()
    const tempId = `temp-${Date.now()}`
    const optimisticMessage = {
      _id: tempId,
      tempId,
      sender: 'user',
      text: messageText,
      status: 'sent',
      createdAt: Date.now()
    }
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage('')
    socket.emit('sendMessage', { chatId, text: messageText, sender: 'user', tempId })
    setTimeout(scrollToBottom, 50)
  }

  return (
    <div className='bg-transparent min-h-screen py-8 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-stone-900 mb-1'>Chat with Dr. {chatInfo?.docName || 'Doctor'}</h1>
            <p className='text-stone-500'>{chatInfo?.slotDate} | {chatInfo?.slotTime}</p>
          </div>
        </div>

        <div className='bg-white border border-stone-200 rounded-3xl shadow-sm h-[70vh] overflow-hidden flex flex-col'>
          <div ref={messageListRef} className='flex-1 overflow-y-auto p-5 space-y-4'>
            {loading ? (
              <div className='text-stone-500 text-center py-10'>Loading conversation…</div>
            ) : messages.length === 0 ? (
              <div className='text-center text-stone-500 py-10'>No messages yet. Send the first message.</div>
            ) : (
              messages.map((message) => {
                const isUser = message.sender === 'user'
                return (
                  <div key={message._id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm ${isUser ? 'bg-primary/10 text-stone-800 border border-primary/20' : 'bg-stone-100 text-stone-800 border border-stone-200'}`}>
                      <p className='text-sm leading-6 break-words whitespace-pre-wrap'>{message.text}</p>
                      <div className='mt-2 text-[11px] text-stone-400 flex items-center justify-between gap-2'>
                        <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isUser && (
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
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
    </div>
  )
}

export default ChatThread
