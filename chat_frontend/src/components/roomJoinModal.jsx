import React, { useState } from 'react'
import Modal from './modal.jsx'
import _fetch from '../fetch.js'
import { useDispatch } from 'react-redux'
import { updateRooms } from '../store/userSlice.js'
import { useCookies } from 'react-cookie'
import socket from '../socket.js'

const RoomJoinModal = ({ isOpen, onClose }) => {
  const [selection, setSelection] = useState(1)
  const [ipRoomId, setIpRoomId] = useState('')
  const [ipRoomName, setIpRoomName] = useState('')
  const [ipRoomDesc, setIpRoomDesc] = useState('')
  const dispatch = useDispatch()
  const [cookie, setCookie] = useCookies(['userInfo'])

  const handleSubmit = async () => {
    let res;
    const user = cookie.userInfo;
    
    if (selection === 1) {
      // Join Room
      res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/join`, 'POST', {
        user_id: user._id,
        room_id: ipRoomId
      })
      setIpRoomId('')
    } else {
      // Create Room
      res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/create`, 'POST', {
        user_id: user._id,
        room_name: ipRoomName,
        room_desc: ipRoomDesc
      })
      setIpRoomName('')
      setIpRoomDesc('')
    }

    // console.log(res.status, 'res status')

    if(res.status === 200){
      const a = await res.json();
      dispatch(updateRooms(a.response._id))
      console.log(a.response, 'yeh wala hai')
      socket.emit('roomUpdate', a.response._id)
  
      const updatedCookie = {
        ...cookie.userInfo,
        rooms: [...(cookie.userInfo?.rooms || []), a.response._id],
      };
      setCookie('userInfo', updatedCookie, { path: '/' })
    }
    onClose()
  }

  const resetFields = () => {
    setIpRoomId('')
    setIpRoomName('')
    setIpRoomDesc('')
  }

  const handleClose = () => {
    resetFields()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width='w-[85vw] sm:w-[400px]'>
      <div className='flex flex-col gap-8 w-full max-w-md mx-auto'>
        {/* Tab Selection */}
        <div className='flex w-full border-b-2 border-gray-300'>
          <div 
            className={`flex-1 text-center py-3 cursor-pointer font-semibold ${selection === 1 ? 'border-b-2 border-[#8a3fff] text-[#8a3fff]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelection(1)}
          >
            Join Room
          </div>
          <div 
            className={`flex-1 text-center py-3 cursor-pointer font-semibold ${selection === 2 ? 'border-b-2 border-[#8a3fff] text-[#8a3fff]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelection(2)}
          >
            Create Room
          </div>
        </div>

        {/* Modal Content based on selection */}
        <div className='flex flex-col gap-6 px-4'>
          {selection === 1 ? (
            // Join Room Form
            <div className='flex flex-col gap-4'>
              <h2 className='text-center text-xl font-semibold'>Join Existing Room</h2>
              <div className='flex flex-col gap-2'>
                <label htmlFor="room-id" className='text-gray-700 font-medium'>Room ID</label>
                <input 
                  id="room-id"
                  type="text" 
                  value={ipRoomId}
                  onChange={(e) => setIpRoomId(e.target.value)} 
                  className='px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent' 
                  placeholder='Enter Room ID' 
                />
              </div>
            </div>
          ) : (
            // Create Room Form
            <div className='flex flex-col gap-4'>
              <h2 className='text-center text-xl font-semibold'>Create New Room</h2>
              <div className='flex flex-col gap-2'>
                <label htmlFor="room-name" className='text-gray-700 font-medium'>Room Name</label>
                <input 
                  id="room-name"
                  type="text" 
                  value={ipRoomName}
                  onChange={(e) => setIpRoomName(e.target.value)} 
                  className='px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent' 
                  placeholder='Enter Room Name' 
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor="room-desc" className='text-gray-700 font-medium'>Description</label>
                <input 
                  id="room-desc"
                  type="text" 
                  value={ipRoomDesc}
                  onChange={(e) => setIpRoomDesc(e.target.value)} 
                  className='px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent' 
                  placeholder='Enter Room Description' 
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-4 mt-2'>
          <button
            onClick={handleClose}
            className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 text-white bg-[#8a3fff] rounded-md hover:bg-purple-600 transition-colors'
          >
            {selection === 1 ? 'Join Room' : 'Create Room'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default RoomJoinModal