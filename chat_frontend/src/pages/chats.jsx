import React, { useState } from 'react'
import { useEffect } from 'react'
import backgroundimg from '../assets/pexels-instawally-176851.jpg'
import messageBackgroundimg from '../assets/SCR-20250218-uaua.png'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'
import Messages from '../components/messages.jsx'
import { updateSelectedRoom, updateRooms, logout, exitRoom } from '../store/userSlice.js'
import socket from '../socket.js'
import Modal from '../components/modal.jsx'
import _fetch from '../fetch.js'
import Dropdown from '../components/Dropdown.jsx'
import settings from '../assets/settings.svg'
import threeDots from '../assets/threeDots.svg'
import logo from '../assets/logo.svg'
import SettingsModal from '../components/SettingsModal.jsx'
import { useNavigate } from 'react-router-dom'
import RoomJoinModal from '../components/roomJoinModal.jsx'
import search from '../assets/search.svg'


const Chats = () => {

  const [cookie, setCookie, removeCookie] = useCookies('userinfo')
  // console.log(cookie.userInfo.rooms)
  const user = useSelector((st) => st.user)
  const {selectedRoom} = useSelector((st) => st.user)
  const [rooms, setRooms] = useState([])
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const toggleAddRoomModal = () => setShowAddRoomModal(!showAddRoomModal)
  const [ipRoomId, setIpRoomId] = useState('')
  const [ipRoomName, setIpRoomName] = useState('')
  const [ipRoomDesc, setIpRoomDesc] = useState('')
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [roomSearchQuery, setRoomSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserInfoModal, setShowUserInfoModal] = useState(false)
  const toggleUserInfoModal = () => setShowUserInfoModal(!showUserInfoModal)
  const [showRight, setShowRight] = useState(false)


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRooms = async () => {
    const a = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/allrooms`, 'POST', {
      roomIds: user.rooms
    });
    const response = await a.json();
    setRooms(response)
  }

  useEffect(()=> {
    fetchRooms()
  },[user])


  const dropdownOptions = [
    { label: "Settings", className: "text-gray-700 hover:bg-gray-100" },
    { label: "Logout", className: "text-gray-700 hover:bg-gray-100" }
  ]


  const handleDropdownSelect = (s) => {
    if(s.label == "Settings"){
      setShowUserInfoModal(true)
    }
    else if(s.label === 'Logout'){
      removeCookie('userInfo');
      navigate('/login')
      dispatch(logout())
    }
    setShowDropdown(false)
  }


  const resetRoom = () => {
    setRoomSearchQuery('')
    dispatch(updateSelectedRoom(rooms[0]))
    // setSelectedRoom(rooms[0])
  }

  useEffect(() => {
    console.log('joinRoom called')
    socket.emit('joinRoom', user._id, user.rooms)
  }, [user._id, user.rooms])

  useEffect(() => {
    socket.on('roomUpdate', (roomId) => {
      console.log('roomUpdate event received for room:', roomId);
      fetchRooms();
    });
  
    socket.on('userKicked', ({ roomId, userId }) => {
      console.log('userKicked event received for room:', roomId, 'user:', userId);
      if (user._id === userId) {
        dispatch(exitRoom(roomId));
        const updatedRooms = cookie.userInfo.rooms.filter(
          (id) => id !== roomId
        );
        const updatedCookie = { ...cookie.userInfo, rooms: updatedRooms };
        setCookie('userInfo', updatedCookie, { path: '/' });
        // console.log('idharrrr', roomId, selectedRoom._id)
        if(roomId === selectedRoom._id){
          // console.log('reset room called')
          resetRoom()
        }
      } else {
        fetchRooms();
      }
    });
    return () => {
      socket.off('roomUpdate');
      socket.off('userKicked');
    };
  }, [user]);


  const handleSearch = (e) => {
    setRoomSearchQuery(e.target.value)
  }


  const handleclick = (item) => {
    console.log(`Clicked ${item.name}`)
    dispatch(updateSelectedRoom(item))
    // setSelectedRoom(item)
    // console.log(item, 'selected room here')
    setShowRight(true)
  }

  const handleSearchIconClick = () => {
    const inputElement = document.getElementById('searchInput');
    if (inputElement) {
      inputElement.focus();
    }
  };

  const filteredRooms = rooms?.filter(room => {
    return room.name.toLowerCase().includes(roomSearchQuery.toLowerCase())
  })

  return (
    <div className="bg-cover bg-center h-screen flex justify-center items-center" style={{ backgroundImage: `url(${backgroundimg})` }}>
      <div className='h-full w-full sm:h-[95vh] sm:w-[95vw] bg-[#1d1d1d] text-white flex justify-evenly items-center rounded-md'>
        <div className={`left w-full sm:w-[25%] h-full border-r-gray-500 sm:border-r-[1px] rounded-tl-md flex flex-col ${showRight && 'hidden sm:flex'}`}>
          <div className='min-h-[70px] bg-black rounded-tl-md flex items-center justify-between py-3 px-3 sm:px-1 md:px-2 xl:pl-7'>
            {/* {name} */}
            {/* <div className='text-5xl ml-4 font-bree'>Toxy</div> */}
            <div className=''>
              <img className='h-8 md:h-10 invert' src={logo} alt="Logo" />
            </div>
            <div onClick={() => setShowDropdown(!showDropdown)} className='cursor-pointer hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full p-1 relative'>
              <img className='h-10 sm:h-6 md:h-8 xl:h-10' src={threeDots} alt="" />
              <Dropdown
                options={dropdownOptions}
                isOpen={showDropdown}
                className='absolute z-10 w-[140px] right-4'
                onClose={() => setShowDropdown(false)}
                onSelect={handleDropdownSelect}
              >

              </Dropdown>
            </div>
          </div>

          <div className='overflow-auto flex flex-col h-full'>
            <div className='flex mt-4 px-4 sm:px-2 lg:px-4 gap-4 my-4 items-center lg:flex-row sm:flex-col justify-between sm:justify-normal'>
              <div className='pr-2 pt-2 pb-2 pl-[5px] w-[70%] sm:w-full lg:w-[70%] bg-white rounded-full sm:rounded-[10px] h-12 md:rounded-full md:h-12
               flex items-center gap-2'>
                <div className='bg-black p-1 rounded-full h-10 w-12 flex justify-center items-center sm:hidden md:flex' onClick={handleSearchIconClick}>
                  <img src={search} alt="" />
                </div>
                <input value={roomSearchQuery} id="searchInput" className='text-black outline-none w-[100%]' type="text" placeholder='Search Rooms...' onChange={handleSearch}/>
              </div>
              {/* <div className='bg-[#8a3fff] mx-auto cursor-pointer relative rounded-full text-center flex items-center font-oswald py-2' >
                <div className='w-28' onClick={() => setShowAddRoomModal(true)}><div className=''>ADD ROOM</div></div>
                <Dropdown
                  options={addDropdownOptions}
                  isOpen={showAddDropdown}
                  className='text-base absolute top-11 left-0'
                  containerClassName=''
                  onClose={() => setShowAddDropdown(false)}
                  onSelect={handleAddDropdownSelect}
                />
              </div> */}

              <div className='bg-[#8a3fff] sm:mx-auto cursor-pointer relative text-center rounded-full lg:rounded-xl xl:rounded-full flex justify-center items-center font-oswald p-2 w-[81px] lg:w-[25%] h-12 sm:h-10 lg:h-12 sm:text-sm md:text-base lg:text-sm 2xl:text-base' onClick={() => setShowAddRoomModal(true)}>
                  ADD ROOM
              </div>

            </div>

            {filteredRooms?.map((room) => (
              <div key={room._id} 
              className={`px-4 sm:px-1 md:px-2 lg:px-4 py-3 border-[2px] border-transparent hover:border-[#8a3fff] transition-all duration-100 ease-in-out cursor-pointer flex gap-4 items-center ${
                  room._id === selectedRoom?._id ? 'bg-[#312f2f]' : ''
              }`} 
              onClick={() => handleclick(room)}
          >
                {room.icon?.imageData ? (
                  <img
                    src={`data:image/jpeg;base64,${room.icon.imageData}`}
                    alt={room.icon.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-400" />
                )}
                <div className='flex flex-col' style={{ width: `calc(100% - 50px)` }}>
                  <span className='md:text-lg'>{room.name}</span>
                  {room.lastMessage && (<div className='text-gray-400 truncate overflow-hidden whitespace-nowrap sm:text-xs md:text-base'><span>{room?.lastMessage?.sender?.name} : </span><span>{room?.lastMessage?.content}</span></div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`right w-full sm:w-[75%] h-full bg-cover ${!showRight && 'hidden sm:block'}`} style={{ backgroundImage: `url(${messageBackgroundimg})`}}>
          <div className='h-full w-full bg-black bg-opacity-[84%]'>
              <Messages selectedRoom={selectedRoom} resetRoom={resetRoom} fetchRooms={fetchRooms} setShowRight={setShowRight}/>
              
          </div>
        </div>

      </div>

      
      <RoomJoinModal isOpen={showAddRoomModal} onClose={toggleAddRoomModal} />

      <SettingsModal isOpen={showUserInfoModal} onClose={toggleUserInfoModal} user={user}/>
    </div>
  )
}

export default Chats
