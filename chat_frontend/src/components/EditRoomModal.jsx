import React, {useState} from 'react'
import Modal from './modal.jsx'
import _fetch from '../fetch.js'
import socket from '../socket.js'

const EditRoomModal = ({isOpen, onClose, room , updateRoom, fetchRooms}) => {
    const [roomName,setRoomName] = useState(room?.name)
    const [roomDesc, setRoomDesc] = useState(room?.description)

    const handleNameChange = (e) => {
        setRoomName(e.target.value)
        }

    const handleDescChange = (e) => {
        setRoomDesc(e.target.value)
    }


    const handleOk =  async () => {
        const res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/edit`, 'POST',{
            roomId : room?._id,
            newName: roomName,
            newDesc: roomDesc
        })
        // setRoomName('')
        // setRoomDesc('')
        const a = await res.json();
        console.log(a)
        updateRoom()
        fetchRooms()
        socket.emit('roomUpdate', room._id)
        onClose()
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose} width='w-[75vw] sm:w-[370px]'>
        <div className='flex flex-col gap-8'>
          <div className='text-center text-xl font-semibold'>Edit Room</div>
          <div className='flex justify-between items-center gap-1 sm:gap-10 flex-wrap'>
            <div className='text-base sm:text-lg'>Room Name :</div>
            <input value={roomName} onChange={(e) => handleNameChange(e)} className='px-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent' type="text" placeholder='Enter Room Name..' />
          </div>
          <div className='flex justify-between items-center gap-1 sm:gap-10 flex-wrap'>
            <div className='text-base sm:text-lg'>Description :</div>
            <input value={roomDesc} onChange={(e) => handleDescChange(e)} className='px-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent' type="text" placeholder='Enter Room Description..' />
          </div>
          <div className='flex self-end gap-5'>
            <div onClick={onClose} className='text-center text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer px-2 py-1'>Cancel</div>
            <div onClick={() => handleOk()} className='text-center text-white bg-[#8a3fff] rounded-md px-2 py-1 cursor-pointer'>Update Room</div>

          </div>
        </div>
      </Modal>
  )
}

export default EditRoomModal
