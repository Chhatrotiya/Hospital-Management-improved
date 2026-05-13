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
  const [menuState, setMenuState] = useState(null)
  const [editingMessage, setEditingMessage] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)
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

    socketClient.on('messageEdited', ({ message }) => {
      if (!message?._id) return
      setMessages((prev) => prev.map((item) => item._id === message._id ? message : item))
      setEditingMessage((current) => current?._id === message._id ? null : current)
    })

    socketClient.on('messageDeleted', ({ messageId }) => {
      if (!messageId) return
      setMessages((prev) => prev.filter((item) => item._id !== messageId))
      setEditingMessage((current) => current?._id === messageId ? null : current)
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

  useEffect(() => {
    const closeMenu = () => setMenuState(null)
    window.addEventListener('click', closeMenu)
    window.addEventListener('scroll', closeMenu, true)
    return () => {
      window.removeEventListener('click', closeMenu)
      window.removeEventListener('scroll', closeMenu, true)
    }
  }, [])

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return
    const messageText = newMessage.trim()

    if (editingMessage) {
      socket.emit('editMessage', { chatId, messageId: editingMessage._id, text: messageText })
      setMessages((prev) => prev.map((item) => (
        item._id === editingMessage._id ? { ...item, text: messageText, editedAt: Date.now() } : item
      )))
      setEditingMessage(null)
      setNewMessage('')
      return
    }

    const tempId = `temp-${Date.now()}`
    const replyTo = replyingTo ? {
      messageId: replyingTo._id,
      sender: replyingTo.sender,
      text: replyingTo.text
    } : undefined
    const optimisticMessage = {
      _id: tempId,
      tempId,
      sender: 'doctor',
      text: messageText,
      status: 'sent',
      createdAt: Date.now(),
      replyTo
    }
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage('')
    setReplyingTo(null)
    socket.emit('sendMessage', { chatId, text: messageText, sender: 'doctor', tempId, replyToMessageId: replyingTo?._id })
  }

  const openMessageMenu = (event, message) => {
    event.stopPropagation()
    const buttonRect = event.currentTarget.getBoundingClientRect()
    setMenuState({
      message,
      x: buttonRect.right - 160,
      y: buttonRect.bottom + 6
    })
  }

  const startReplyMessage = (message) => {
    if (message._id?.startsWith('temp-')) {
      toast.info('You can reply after this message is saved')
      return
    }
    setReplyingTo(message)
    setEditingMessage(null)
    setMenuState(null)
  }

  const startEditMessage = (message) => {
    if (message.sender !== 'doctor' || message._id?.startsWith('temp-')) {
      toast.info('You can edit your sent messages after they are saved')
      return
    }
    setEditingMessage(message)
    setReplyingTo(null)
    setNewMessage(message.text)
    setMenuState(null)
  }

  const deleteMessage = (message) => {
    if (message.sender !== 'doctor' || message._id?.startsWith('temp-')) {
      toast.info('You can delete your sent messages after they are saved')
      return
    }
    const confirmed = window.confirm('Delete this message?')
    if (!confirmed) return
    socket?.emit('deleteMessage', { chatId, messageId: message._id })
    setMessages((prev) => prev.filter((item) => item._id !== message._id))
    setMenuState(null)
  }

  const cancelEdit = () => {
    setEditingMessage(null)
    setNewMessage('')
  }

  const cancelReply = () => {
    setReplyingTo(null)
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
                  <div className={`relative max-w-[80%] rounded-3xl px-4 py-3 pr-10 shadow-sm ${isDoctor ? 'bg-primary/10 text-stone-800 border border-primary/20' : 'bg-stone-100 text-stone-800 border border-stone-200'}`}>
                    <button
                      type='button'
                      onClick={(event) => openMessageMenu(event, message)}
                      className='absolute right-3 top-2 flex h-7 w-7 items-center justify-center rounded-full text-stone-500 hover:bg-white/70 hover:text-stone-800'
                      aria-label='Message options'
                    >
                      <span className='text-lg leading-none'>...</span>
                    </button>
                    {message.replyTo?.text && (
                      <div className={`mb-2 rounded-2xl border-l-4 px-3 py-2 text-xs ${isDoctor ? 'border-primary bg-white/70 text-stone-600' : 'border-stone-300 bg-white text-stone-600'}`}>
                        <p className='font-semibold'>{message.replyTo.sender === 'doctor' ? 'You' : 'Patient'}</p>
                        <p className='mt-1 max-h-9 overflow-hidden break-words'>{message.replyTo.text}</p>
                      </div>
                    )}
                    <p className='text-sm leading-6 break-words whitespace-pre-wrap'>{message.text}</p>
                    <div className='mt-2 text-[11px] text-stone-400 flex items-center justify-between gap-2'>
                      <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.editedAt && <span>Edited</span>}
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

        {menuState && (
          <div
            className='fixed z-50 w-40 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg'
            style={{ left: menuState.x, top: menuState.y }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              onClick={() => startReplyMessage(menuState.message)}
              className='w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100'
            >
              Reply
            </button>
            {menuState.message.sender === 'doctor' && (
              <button
                type='button'
                onClick={() => startEditMessage(menuState.message)}
                className='w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100'
              >
                Edit
              </button>
            )}
            {menuState.message.sender === 'doctor' && (
              <button
                type='button'
                onClick={() => deleteMessage(menuState.message)}
                className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50'
              >
                Delete
              </button>
            )}
          </div>
        )}

        <div className='border-t border-stone-200 p-4 bg-stone-50'>
          {replyingTo && (
            <div className='mb-3 flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600'>
              <div className='min-w-0'>
                <p className='font-semibold text-stone-700'>Replying to {replyingTo.sender === 'doctor' ? 'your message' : 'Patient'}</p>
                <p className='mt-1 truncate'>{replyingTo.text}</p>
              </div>
              <button
                type='button'
                onClick={cancelReply}
                className='shrink-0 font-semibold text-stone-500 hover:text-stone-800'
              >
                Cancel
              </button>
            </div>
          )}
          {editingMessage && (
            <div className='mb-3 flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm text-stone-600'>
              <span className='truncate'>Editing message</span>
              <button
                type='button'
                onClick={cancelEdit}
                className='font-semibold text-stone-500 hover:text-stone-800'
              >
                Cancel
              </button>
            </div>
          )}
          <div className='flex items-center gap-3'>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type='text'
              placeholder={replyingTo ? 'Write a reply...' : 'Write a message...'}
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
              {editingMessage ? 'Update' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorChatThread
