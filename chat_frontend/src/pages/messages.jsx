import React, { useEffect } from 'react'
import { useState } from 'react'
import socket from '../socket.js'
import { useSelector, useDispatch } from 'react-redux'
import _fetch from '../fetch.js'
import { format, toDate } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import emojiButton from '../assets/emojiButton.svg'
import Dropdown from '../components/Dropdown.jsx'
import threedots from '../assets/threeDots.svg'
import adduser from '../assets/adduser.svg'
import { exitRoom } from '../../store/userSlice.js'
import { useCookies } from 'react-cookie'
import Modal from '../components/modal.jsx'
import usericon from '../assets/usericon.svg'
import InviteModal from '../components/InviteModal.jsx'

const Messages = ({ selectedRoom, resetRoom }) => {
  console.log(selectedRoom, "SR")
  const [messages, setMessages] = useState([])
  const [ipMessage, setIpMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const user = useSelector(st => st.user)
  const [showDropdown, setshowDropdown] = useState(false)
  const [cookie, setCookie] = useCookies('userInfo')
  const [showInfoModal, setShowInfoModal] = useState(false)
  const toggleInfoModal = () => setShowInfoModal(!showInfoModal)
  const [room, setRoom] = useState(null)
  const [showExitModal, setShowExitModal] = useState(false)
  const toggleExitModal = () => setShowExitModal(!showExitModal)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const toggleInviteModal = () => setShowInviteModal(!showInviteModal)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomId = selectedRoom._id;
      let a = await _fetch(`http://localhost:5000/api/room/info/?roomId=${roomId}`, 'GET');
      let response = await a.json();
      console.log(response)
      setRoom(response)
    }
    
    fetchRoomData();
  }, [selectedRoom])
  



  const dropdownOptions = [
    { label: "Room Info", className: "text-gray-700 hover:bg-gray-100 text-lg" },
    { label: "Exit Room", className: "hover:bg-red-500 hover:text-white text-red-600 text-lg" }
  ];

  const sendMessage = (message) => {
    socket.emit('sendMessage', selectedRoom?._id, message, user)
    let a = _fetch(`http://localhost:5000/api/message/save`, 'POST', {
      content: message,
      room_id: selectedRoom?._id,
      sender: user._id,
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(ipMessage);
      setIpMessage('')
    }
  };

  const handleExitRoom = async () => {
    let res = await _fetch(`http://localhost:5000/api/room/exit`, 'DELETE', {
      roomId: selectedRoom._id,
      userId: user._id
    })
    const a = await res.json();
    // if(res.status == 200){
    //   console.log(res)
    // }
    console.log(a);
    const updatedCookie = {
      ...cookie.userInfo,
      rooms: cookie.userInfo.rooms.filter(room => room._id !== selectedRoom?._id),
    };

    console.log(updatedCookie)

    setCookie('userInfo', updatedCookie);
    dispatch(exitRoom(a.response))
    resetRoom()
    setShowExitModal(false)
  }

  const getMessages = async () => {
    if (selectedRoom?._id) {
      let res = await _fetch(`http://localhost:5000/api/message/?room_id=${selectedRoom._id}`, 'GET')
      let data = await res.json()
      let msgs = data.response;
      // console.log(msgs)
      setMessages(msgs)
    }
  }

  const handleEmojiSelect = (emojiObject) => {
    console.log(emojiObject);
    setIpMessage(ipMessage + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleDropdownSelect = (s) => {
    console.log(s.label);
    if (s.label == 'Room Info') {
      setShowInfoModal(true)
    }
    else {
      setShowExitModal(true)
    }
    setshowDropdown(false)
  }


  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      console.log(message.sender, 'sen')
      console.log('New message received:', message);
      if (selectedRoom?._id === message.room_id) {
        // let newMessage = { content : message.content, sender : message.sender}
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log(messages)
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedRoom])

  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    getMessages()
  }, [selectedRoom])

  const groupByDate = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const dateKey = format(new Date(msg.sentAt), 'yyyy-MM-dd')
      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(msg);
    });
    return Object.entries(grouped)
  }

  const groupedMessages = groupByDate(messages);
  console.log(groupedMessages, 'gm')

  const formatDate = (date) => {
    const dateObj = toDate(new Date(date).getTime() + 5.5 * 60 * 60 * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateObj.toDateString() === today.toDateString()) return 'Today';
    if (dateObj.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return format(dateObj, 'MMM d, yyyy');

  }

  return (
    <div className='h-full'>
      <div className='flex flex-col h-full justify-between'>
        <div className='h-20 bg-gray-400 rounded-tr-md p-4 flex justify-between'>
          <div className='text-3xl'>{room?.name}</div>
          <div className='flex gap-5'>
            <div onClick={()=>setShowInviteModal(!showInviteModal)}>
              <img className='h-10' src={adduser} alt="" />
            </div>
            <InviteModal isOpen={showInviteModal} roomCode={room?._id} onClose={toggleInviteModal}/>
            
            <div className='relative' onClick={() => setshowDropdown(!showDropdown)}>
              <img className='h-10 invert' src={threedots} alt="" />
              <div className=''>
                <Dropdown
                  options={dropdownOptions}
                  isOpen={showDropdown}
                  className='text-base absolute right-[10px] w-32'
                  containerClassName=''
                  onClose={() => setshowDropdown(false)}
                  onSelect={handleDropdownSelect}
                />
                <Modal isOpen={showInfoModal} onClose={toggleInfoModal} width='600px'>
                  <div className='text-black'>
                    <div className='text-center font-semibold text-2xl'>{room?.name}</div>
                      <div className='flex justify-around p-3 gap-3'>
                        <div className='flex flex-col w-full'>
                          <div className='text-xl font-semibold mb-2'>Description: </div>
                          <div>Description of the group Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo ipsum sequi ab nobis temporibus quo debitis itaque beatae porro at magnam, iure ex fuga distinctio, amet dolor cumque tempore sed.</div>
                          <div>Admin : {room?.createdBy?.name}</div>
                          <div>Created On : {room && formatDate(room?.createdAt)}</div>
                        </div>

                        <div className='w-full'>
                          <div className='text-xl font-semibold mb-2'>Members :</div>
                          <div>
                            <ul className='bg-emerald-300 rounded-md'>
                              {room?.users.map((e)=>(
                                <li key={e._id} className='border-black border-b-[1px] p-2 flex gap-3'>
                                  <img className='w-4' src={usericon} alt="klasdl" />
                                  <div>{e.name}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <div onClick={toggleInfoModal} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer inline-block self-end'>Close</div>
                      </div>
                      
                  </div>
                </Modal>

                <Modal
                  isOpen={showExitModal}
                  onClose={toggleExitModal}
                  width='600px'
                >
                  <div className='text-black flex flex-col gap-3'>
                    <div className='text-xl font-semibold'>Exit Room?</div>
                    <div>Are you sure you want to exit this room?</div>
                    <div className='flex self-end mr-4 gap-5'>
                      <div onClick={toggleExitModal } className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Cancel</div>
                      <div onClick={handleExitRoom} className='text-center bg-blue-500 rounded-md px-2 py-1 cursor-pointer'>Exit</div>

                    </div>
                  </div>
                </Modal>
              </div>

            </div>

          </div>

        </div>

        <div className='mx-5 my-2 h-[calc(100%-200px)] overflow-y-auto flex flex-col-reverse'>
          <div className='flex flex-col'>

            {groupedMessages.map(([date, msgs]) => (
              <div key={date} className='flex flex-col pr-4'>
                <div className='text-center my-4 text-gray-400'>{formatDate(date)}</div>
                {msgs.map((item, index) => (
                  <div key={index} className={`py-2 px-3 text-black bg-white my-3 rounded-md text-lg ${item.sender._id === user._id ? 'self-end' : 'self-start'} min-w-[50px]`}>
                    <div className='text-xs mb-1'>{item.sender.name}</div>
                    <div>{item.content}</div>
                    <div className='text-xs text-end mt-2 text-gray-500'>{format(new Date(item.sentAt), 'hh:mm a')}</div>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
        <div className='h-20 bg-black flex justify-center items-center rounded-br-md text-black gap-4 relative'>
          <img onClick={() => setShowEmojiPicker(!showEmojiPicker)} src={emojiButton} alt="" />
          <div className='absolute bottom-[70px] left-[50px] picker'><EmojiPicker open={showEmojiPicker} onEmojiClick={handleEmojiSelect} /></div>
          <input value={ipMessage} onChange={(e) => { setIpMessage(e.target.value) }} onKeyPress={handleKeyPress} type="text" placeholder='Enter Message'
            className='w-[80%] h-11 p-2 rounded-md' />
          <div className='text-white text-lg bg-indigo-500 px-3 py-2 rounded-lg cursor-pointer' onClick={() => {
            sendMessage(ipMessage);
            setIpMessage('')
          }}>Send</div>
        </div>
      </div>

    </div>
  )
}

export default Messages
