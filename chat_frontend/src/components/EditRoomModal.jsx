import React, {useState} from 'react'
import Modal from './modal.jsx'
import _fetch from '../fetch.js'

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
        const res = await _fetch(`http://localhost:5000/api/room/edit`, 'POST',{
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
        onClose()
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className='flex flex-col gap-8'>
          <div className='text-center text-xl font-semibold'>Edit Room</div>
          <div className='flex justify-between items-center gap-10'>
            <div className='text-lg'>Room Name :</div>
            <input value={roomName} onChange={(e) => handleNameChange(e)} className='px-2 border-[2px] border-black' type="text" placeholder='Enter Room Name..' />
          </div>
          <div className='flex justify-between items-center gap-10'>
            <div className='text-lg'>Description :</div>
            <input value={roomDesc} onChange={(e) => handleDescChange(e)} className='px-2 border-[2px] border-black' type="text" placeholder='Enter Room Description..' />
          </div>
          <div className='flex self-end mr-4 gap-5'>
            <div onClick={onClose} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Cancel</div>
            <div onClick={() => handleOk()} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Update Room</div>

          </div>
        </div>
      </Modal>
  )
}

export default EditRoomModal
