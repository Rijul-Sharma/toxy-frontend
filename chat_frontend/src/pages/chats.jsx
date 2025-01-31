import React, { useState } from 'react'
import { useEffect } from 'react'
import backgroundimg from '../assets/4K-Minimalist-Wallpaper-HD-82745.jpg'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'
import Messages from './messages.jsx'
import { updateSelectedRoom, updateRooms } from '../../store/userSlice.js'
import socket from '../socket.js'
import Modal from '../components/modal.jsx'
import _fetch from '../fetch.js'
import Dropdown from '../components/Dropdown.jsx'


const Chats = () => {

  const [cookie, setCookie] = useCookies('userinfo')
  // console.log(cookie.userInfo.rooms)
  const { _id: userId, rooms, name } = useSelector((st) => st.user)
  console.log(rooms)
  const [selectedRoom, setSelectedRoom] = useState()
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const toggleJoinModal = () => setIsJoinModalOpen(!isJoinModalOpen);
  const toggleCreateModal = () => setIsCreateModalOpen(!isCreateModalOpen);
  const [ipRoomId, setIpRoomId] = useState('')
  const [ipRoomName, setIpRoomName] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [roomSearchQuery, setRoomSearchQuery] = useState('')

  const dispatch = useDispatch();

  const dropdownOptions = [
    { label: "Create New Room", className: "text-gray-700 hover:bg-gray-100" },
    { label : "Join Existing Room" , className: "text-gray-700 hover:bg-gray-100"}
  ];

  const handleDropdownSelect = (s) => {
    console.log(s.label)
    if(s.label=="Create New Room"){
      setIsCreateModalOpen(true)
      console.log('hi')
    }
    else{
      setIsJoinModalOpen(true)
    }
    setShowDropdown(false)
  }

  const handlechange = (e) => {
    setIpRoomId(e.target.value);
  }

  const handlechange2 = (e) => {
    setIpRoomName(e.target.value)
  }

  const handleOk = async () => {
    let res = await _fetch(`http://localhost:5000/api/room/join`, 'POST', {
      user_id: userId,
      room_id: ipRoomId
    })
    const a = await res.json();
    console.log(a)
    dispatch(updateRooms(a.response))
    setIpRoomId('')
    setIsJoinModalOpen(false)
    setSelectedRoom(a.response)

    const updatedCookie = {
      ...cookie.userInfo,
      rooms: [...(cookie.userInfo?.rooms || []), a.response],
    };

    setCookie('userInfo', updatedCookie)
  }


  const handleOk2 = async () => {
    let res = await _fetch(`http://localhost:5000/api/room/create`,'POST', {
      user_id: userId,
      room_name: ipRoomName
    })
    const a = await res.json();
    console.log(a);
    dispatch(updateRooms(a.response))
    setIpRoomName('');
    setIsCreateModalOpen(false)
    setSelectedRoom(a.response)

    const updatedCookie = {
      ...cookie.userInfo,
      rooms: [...(cookie.userInfo?.rooms || []), a.response],
    };

    setCookie('userInfo', updatedCookie)
  }

  const resetRoom = () => {
    setSelectedRoom(rooms[0])
  }

  useEffect(() => {
    socket.emit('joinRoom', userId, rooms)
  }, [userId, rooms])

  
  const handleSearch = (e) => {
    setRoomSearchQuery(e.target.value)
  }


  const handleclick = (item) => {
    console.log(`Clicked ${item.name}`)
    dispatch(updateSelectedRoom(item))
    setSelectedRoom(item)
  }

  const filteredRooms = rooms.filter(room => {
     return room.name.toLowerCase().includes(roomSearchQuery.toLowerCase())
  })

  return (
    <div className="bg-cover bg-center h-screen flex justify-center items-center" style={{ backgroundImage: `url(${backgroundimg})` }}>
      <div className='container h-[90vh] w-[90vw] bg-gray-700 text-white flex justify-evenly items-center rounded-md'>
        <div className="left w-[30%] h-full border-r-gray-500 border-r-[2px] rounded-tl-md flex flex-col">
          <div className='min-h-20 bg-gray-400 rounded-tl-md'>{name}</div>

          <div className='overflow-auto flex flex-col'>
            <div className='mt-5 text-lg bg-blue-500 rounded-tl-md rounded-tr-md mx-auto cursor-pointer relative' >
              <div className='p-2' onClick={() => setShowDropdown(true)}>+ Add New Room</div>
            <Dropdown
              options={dropdownOptions}
              isOpen={showDropdown}
              className='text-base absolute top-11 left-0'
              containerClassName=''
              onClose={() => setShowDropdown(false)}
              onSelect={handleDropdownSelect}
            />
            </div>

            <div className='flex justify-center mt-4'>
              <input className='bg-transparent p-2 w-[85%] border-gray-500 border-[1px] rounded-full' type="text" placeholder='Search Rooms..' onChange={handleSearch}/>
            </div>

            {filteredRooms.map((item, index) => (
              <div key={index} className='p-7 border-b-2 border-gray-500' onClick={() => handleclick(item)}>
                <span className='text-lg'>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="right w-[70%] h-full">
          <Messages selectedRoom={selectedRoom} resetRoom={resetRoom}/>
        </div>

      </div>

      <Modal isOpen={isJoinModalOpen} onClose={toggleJoinModal}>
        <div className='flex flex-col gap-8'>
          <div className='text-center text-xl font-semibold'>Join New Room</div>
          <div className='flex justify-center items-center gap-10'>
            <div className='text-lg'>Room ID :</div>
            <input onChange={(e) => handlechange(e)} className='px-2 border-[2px] border-black' type="text" placeholder='Enter Room ID' />
          </div>
          <div className='flex self-end mr-4 gap-5'>
            <div onClick={toggleJoinModal} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Cancel</div>
            <div onClick={handleOk} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Join</div>

          </div>
        </div>
      </Modal>

      <Modal isOpen={isCreateModalOpen} onClose={toggleCreateModal}>
        <div className='flex flex-col gap-8'>
          <div className='text-center text-xl font-semibold'>Create New Room</div>
          <div className='flex justify-center items-center gap-10'>
            <div className='text-lg'>Room Name :</div>
            <input onChange={(e) => handlechange2(e)} className='px-2 border-[2px] border-black' type="text" placeholder='Enter Room Name' />
          </div>
          <div className='flex self-end mr-4 gap-5'>
            <div onClick={toggleCreateModal} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Cancel</div>
            <div onClick={handleOk2} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Create Room</div>

          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Chats
