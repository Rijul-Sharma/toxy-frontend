import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import socket from '../socket.js'
import { useSelector, useDispatch } from 'react-redux'
import _fetch from '../fetch.js'
import { format, toDate, differenceInMinutes } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import emojiButton from '../assets/emojiButton.svg'
import Dropdown from './Dropdown.jsx'
import threedots from '../assets/threeDots.svg'
import adduser from '../assets/adduser.svg'
import { exitRoom } from '../store/userSlice.js'
import { useCookies } from 'react-cookie'
import Modal from './modal.jsx'
import usericon from '../assets/usericon.svg'
import InviteModal from './InviteModal.jsx'
import uploadFile from '../uploadFile.js'
import EditRoomModal from './EditRoomModal.jsx'
import edit from '../assets/edit.svg'

const Messages = ({ selectedRoom, resetRoom, fetchRooms }) => {
  const [messages, setMessages] = useState([])
  const [ipMessage, setIpMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const user = useSelector(st => st.user)
  const [showDropdown, setShowDropdown] = useState(false)
  const [cookie, setCookie] = useCookies('userInfo')
  const [showInfoModal, setShowInfoModal] = useState(false)
  const toggleInfoModal = () => setShowInfoModal(!showInfoModal)
  const [room, setRoom] = useState(null)
  const [showExitModal, setShowExitModal] = useState(false)
  const toggleExitModal = () => setShowExitModal(!showExitModal)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const toggleInviteModal = () => setShowInviteModal(!showInviteModal)
  const [showUserOptsModal, setShowUserOptsModal] = useState(false)
  const toggleUserOptsModal = () => setShowUserOptsModal(!showUserOptsModal)
  // const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false)
  const toggleEditRoomModal = () => setShowEditRoomModal(!showEditRoomModal)
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const toggleReadMore = () => setExpanded(!expanded);

  const [selectedUser, setSelectedUser] = useState(null)

  const dispatch = useDispatch()

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedRoom]);

  const updateRoomData = async () => {
    const roomId = selectedRoom._id;
    let a = await _fetch(`http://localhost:5000/api/room/info/?roomId=${roomId}`, 'GET');
    let response = await a.json();
    console.log(response)
    setRoom(response)
  }

  useEffect(() => {
    setRoom(selectedRoom)
    console.log(room,'this is the room');
  }, [selectedRoom])
  
  const dropdownOptions = [
    { label: "Room Info", className: "text-gray-700 hover:bg-gray-100 text-lg" },
    { label: "Exit Room", className: "hover:bg-red-500 hover:text-white text-red-600 text-lg" }
  ];

  const sendMessage = async (message) => {
    console.log("Sending message:", message);
    const senderInfo = {
      _id : user._id,
      name : user.name,
      icon : user?.icon
    }
    socket.emit('sendMessage', selectedRoom?._id, message, senderInfo)
    let a = await _fetch(`http://localhost:5000/api/message/save`, 'POST', {
      content: message,
      room_id: selectedRoom?._id,
      sender: user._id,
    })
    fetchRooms()
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

    setCookie('userInfo', updatedCookie, { path: '/' });
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
    setShowDropdown(false)
  }

  const handleCancel = () => {
    setShowUserOptsModal(false)
    setSelectedUser(null)
  }

  const handleMakeAdmin = async (e) => {
    const a = await _fetch(`http://localhost:5000/api/room/admin`, 'POST', {
      room_id : selectedRoom._id,
      newAdmin : selectedUser
    })
    const res = await a.json()
    console.log(res, 'response')
    updateRoomData()
    fetchRooms()
    setShowUserOptsModal(false)
  }

  const handleKickMember = async () => {
    const a = await _fetch(`http://localhost:5000/api/room/kick`, 'POST', {
      room_id : selectedRoom._id,
      member : selectedUser
    })

    const res = await a.json();
    console.log(res,'kick response')
    updateRoomData()
    fetchRooms()
    setShowUserOptsModal(false)
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      const result = await uploadFile('http://localhost:5000/api/image/upload', selectedFile, {
        name: selectedFile.name,
        roomId: room._id
      });
      console.log('File uploaded successfully:', result);
      setSelectedFile(null);
      updateRoomData()
      fetchRooms()
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      console.log(message.sender, 'sen')
      console.log('New message received:', message);
      if (selectedRoom?._id === message.room_id) {
        // let newMessage = { content : message.content, sender : message.sender}
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log(messages)
      }
      setTimeout(() => {
        fetchRooms();
      }, 500);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedRoom])

  // useEffect(() => {
  //   setMessages([]);
  // }, []);

  useEffect(() => {
    getMessages()
  }, [selectedRoom])

  // Group messages by date
  const groupByDate = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const dateKey = format(new Date(msg.sentAt), 'yyyy-MM-dd')
      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(msg);
    });
    return Object.entries(grouped)
  }

  // Group messages by user within a timeframe
  const groupByUser = (messages) => {
    const result = [];
    let currentGroup = [];
    
    messages.forEach((message, index) => {
      if (index === 0) {
        // First message always starts a new group
        currentGroup = [{ ...message, isFirstInGroup: true }];
      } else {
        const prevMessage = messages[index - 1];
        const isSameSender = message.sender._id === prevMessage.sender._id;
        
        if (isSameSender) {
          // Add to current group if same sender, ignoring time difference
          currentGroup.push({ ...message, isFirstInGroup: false });
        } else {
          // Start a new group when sender changes
          if (currentGroup.length > 0) {
            result.push([...currentGroup]);
          }
          currentGroup = [{ ...message, isFirstInGroup: true }];
        }
      }
    });
    
    // Add the last group outside the loop
    if (currentGroup.length > 0) {
      result.push([...currentGroup]);
    }
    
    return result;
  };
  
  const groupedMessages = groupByDate(messages);

  const formatDate = (date) => {
    const dateObj = toDate(new Date(date).getTime() + 5.5 * 60 * 60 * 1000);
    if (isNaN(dateObj)) {
      return 'Invalid Date';
    }
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateObj.toDateString() === today.toDateString()) return 'Today';
    if (dateObj.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return format(dateObj, 'MMM d, yyyy');
  }

  const getUserIcon = (senderId) => {
    if (!room || !room.users) return null;
    const roomUser = room.users.find(u => u._id === senderId);
    return roomUser?.icon || null;
  };

  return (
    <div className='h-full'>
      <div className='flex flex-col h-full justify-between'>
        <div className='h-[70px] bg-[#2a2a2a] rounded-tr-md p-3 flex justify-between items-center'>
          <div className='flex gap-3 items-center'>
            <div>
            {room?.icon ? (
                <img
                    src={`data:image/jpeg;base64,${room.icon?.imageData}`}
                    alt={room.icon?.name}
                    className="h-12 w-12 rounded-full object-cover"
                />
            ) : (
                <div className="h-12 w-12 rounded-full bg-gray-400" />
            )
            }
            </div>
            <div className='text-3xl'>{room?.name}</div>
          </div>
          <div className='flex gap-5'>
            <div className='hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full p-1 cursor-pointer' onClick={()=>setShowInviteModal(!showInviteModal)}>
              <img className='h-10 invert' src={adduser} alt="" />
            </div>
            
            <div className='relative hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full p-1 cursor-pointer' onClick={() => setShowDropdown(!showDropdown)}>
              <img className='h-10' src={threedots} alt="" />
              <div className=''>
                <Dropdown
                  options={dropdownOptions}
                  isOpen={showDropdown}
                  className='text-base absolute right-[10px] w-32'
                  containerClassName=''
                  onClose={() => setShowDropdown(false)}
                  onSelect={handleDropdownSelect}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='px-5 my-2 h-[calc(100%-200px)] overflow-y-auto flex-col-reverse'>
          <div className='flex flex-col'>
            {groupedMessages?.map(([date, msgs]) => (
              <div key={date} className='flex flex-col pr-4 items-center'>
                <div className='bg-gray-500 my-4 py-1 px-3 rounded-full' style={{ width: 'fit-content' }}>
                  <div className='text-center text-white'>{formatDate(date)}</div>
                </div>
                {/* Group messages by user and 5 minute window */}
                {groupByUser(msgs)?.map((userGroup, groupIndex) => {
                  // All messages in a group come from the same user
                  const firstMessage = userGroup[0];
                  const isCurrentUser = firstMessage.sender._id === user._id;
                  const senderIcon = getUserIcon(firstMessage.sender._id);
                  
                  return (
                    <div key={groupIndex} className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} ${isCurrentUser ? 'self-end' : 'self-start'} max-w-[70%]`}>
                      {!isCurrentUser && userGroup[0].isFirstInGroup && (
                        <div className={`${isCurrentUser ? 'ml-2' : 'mr-2'} flex items-start mt-2`}>
                          {senderIcon?.imageData ? (
                            <img
                              src={`data:image/jpeg;base64,${senderIcon.imageData}`}
                              alt={senderIcon.name || "User"}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <img src={usericon} alt="User" className="w-9 h-9 rounded-full bg-gray-300 p-1" />
                          )}
                        </div>
                      )}
                      <div className='flex flex-col'>
                        {userGroup.map((item, messageIndex) => (
                          <div key={messageIndex} className={`py-2 px-3 text-black bg-white my-1 rounded-2xl text-lg ${isCurrentUser ? 'self-end' : 'self-start'} min-w-[50px]`}>
                            {messageIndex === 0 && (
                              <div className={`text-xs mb-1 ${isCurrentUser && 'text-end'}`}>{item.sender.name}</div>
                            )}
                            <div>{item.content}</div>
                            <div className='text-xs text-end mt-1 text-gray-500'>{format(new Date(item.sentAt), 'hh:mm a')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className='h-[70px] bg-[#2a2a2a] flex justify-center items-center rounded-br-md text-black gap-4 relative'>
          <img className='cursor-pointer' onClick={() => setShowEmojiPicker(!showEmojiPicker)} src={emojiButton} alt="" />
          <div className='absolute bottom-[70px] left-[50px] picker'><EmojiPicker open={showEmojiPicker} onEmojiClick={handleEmojiSelect} /></div>
          <input value={ipMessage} onChange={(e) => { setIpMessage(e.target.value) }} onKeyPress={handleKeyPress} type="text" placeholder='Enter Message'
            className='w-[80%] h-11 p-2 rounded-full pl-4 text-lg' />
          <div className='text-white text-lg bg-[#8a3fff] px-3 py-2 rounded-full cursor-pointer font-oswald' onClick={() => {
            sendMessage(ipMessage);
            setIpMessage('')
          }}>Send</div>
        </div>
      </div>

      <Modal isOpen={showInfoModal} onClose={toggleInfoModal} width='600px'>
        <div className='text-black'>
          <div className='text-center font-semibold text-2xl flex justify-center items-center gap-4'>
            <div>{room?.name}</div>
            <div className='cursor-pointer' onClick={()=> toggleEditRoomModal()}><img src={edit} alt="Edit"/></div>
          </div>
            <EditRoomModal isOpen={showEditRoomModal} onClose={toggleEditRoomModal} room={selectedRoom} updateRoom={updateRoomData} fetchRooms={fetchRooms}/>
            <div className='flex justify-around p-3 gap-10'>
              <div className='flex flex-col w-full gap-4'>
                <div className='flex flex-col gap-3 items-center'>
                  {room?.icon?.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${room.icon.imageData}`}
                      alt={room.icon?.name}
                      className="h-28 w-28 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-gray-400" />
                  )}
                  <span className='mx-auto text-blue-400 hover:text-blue-700 cursor-pointer' onClick={triggerFileInput}>Change Room Icon</span>
                  {selectedFile && (
                    <div className='flex flex-col gap-1'>
                      <div className='text-sm'>Selected image: {selectedFile.name}</div>
                      <div className='flex gap-2 justify-center'>
                        <div className='bg-gray-400 p-2 rounded text-white cursor-pointer text-sm' onClick={()=>{
                            setSelectedFile(null)
                            document.getElementById('fileInput').value = '';
                          }}>
                          Cancel
                        </div>
                        <div className="bg-blue-500 p-2 rounded text-white cursor-pointer text-sm" onClick={handleFileUpload}>
                          Upload
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className='text-xl font-semibold mb-2'>Description: </div> */}
                {room?.description && (
                  <div className="bg-gray-200 p-3 rounded-md">
                      <>
                        <p className='inline'>
                          {expanded || room.description.length <= maxLength
                            ? room.description
                            : `${room.description.slice(0, maxLength)}...`}
                        </p>
                        {room.description.length > maxLength && (
                          <button
                            onClick={toggleReadMore}
                            className="text-blue-600 hover:text-blue-500 ml-2"
                          >
                            {expanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </>
                  </div>
                )}
                <div>
                  <div><span className='font-semibold'>Admin : </span>{room?.admin?.name}</div>
                  <div><span className='font-semibold'>Created By : </span>{room?.createdBy?.name}</div>
                  <div><span className='font-semibold'>Created On : </span>{room && formatDate(room?.createdAt)}</div>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>

              <div className='w-full flex flex-col justify-between'>
                <div>
                  <div className='text-xl font-semibold mb-2'>Members :</div>
                  <div>
                    <ul className='bg-gray-200 rounded-md overflow-y-auto'>
                      {room?.users?.map((e)=>(
                        <li key={e._id} className='border-black border-b-[1px] p-2 flex justify-between'>
                          <div className='flex gap-3'>
                            {e.icon ? (
                              <img
                              src={`data:image/jpeg;base64,${e.icon.imageData}`}
                              alt={room.icon?.name}
                              className="w-6 rounded-full object-cover"
                            />
                            ) : 
                            (
                              <img className='w-4 ' src={usericon} alt="Room User" />
                            )}
                            
                            <div>{e.name}</div>
                          </div>
                          {room?.admin?._id === user._id && e._id !== user._id && (
                            <div className='text-xs flex items-center bg-slate-300 p-1 rounded-md cursor-pointer hover:bg-slate-400 border-black border-[1px]' onClick={() => {toggleUserOptsModal() 
                              setSelectedUser(e)}}>
                              MANAGE
                            </div>
                          )}
                          
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
                <div className='flex flex-col'>
              <div 
              onClick={() => {
                        toggleInfoModal()
                        setTimeout(() => {
                          setSelectedFile(null)
                        }, 300);
              }}
              className='text-center text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors px-2 py-1 cursor-pointer inline-block self-end'>Close</div>
            </div>
              </div>
            </div>
            
        </div>
      </Modal>

      <InviteModal isOpen={showInviteModal} roomCode={room?._id} onClose={toggleInviteModal}/>

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

      <Modal
        isOpen={showUserOptsModal}
        onClose={toggleUserOptsModal}
        width='350px'
      >
      <div className=' text-black text-center '>
        <div className='w-full font-semibold text-xl mb-5'>{selectedUser?.name}</div>
        <div className='flex flex-col gap-2'>
          <div onClick={handleMakeAdmin} className='border-b-2 pb-2 text-lg text-green-600 cursor-pointer'>Make Room Admin</div>
          <div onClick={handleKickMember} className='border-b-2 pb-2 text-lg text-red-500 cursor-pointer'>Kick out of the Room</div>
          <div onClick={handleCancel} className='text-lg cursor-pointer'>Cancel</div>
        </div>
      </div>
      </Modal>
    </div>
  )
}

export default Messages