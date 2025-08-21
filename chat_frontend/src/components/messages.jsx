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
import { exitRoom, updateSelectedRoom, setUnreadCount } from '../store/userSlice.js'
import { useCookies } from 'react-cookie'
import Modal from './modal.jsx'
import usericon from '../assets/usericon.svg'
import InviteModal from './InviteModal.jsx'
import uploadFile from '../uploadFile.js'
import EditRoomModal from './EditRoomModal.jsx'
import edit from '../assets/edit.svg'
import back from '../assets/back.svg'
import close from '../assets/close.svg'
import { markRoomAsRead } from '../unreadUtils.js'
import { PreviewableImage } from './ImagePreviewProvider.jsx'
import addImage from '../assets/addImage.svg'

const Messages = ({ selectedRoom, resetRoom, fetchRooms, setShowRight }) => {
  // Chat media upload states
  const [chatMediaFile, setChatMediaFile] = useState(null); // file selected for preview
  const [showMediaPreviewModal, setShowMediaPreviewModal] = useState(false);
  const [confirmedMediaFile, setConfirmedMediaFile] = useState(null); // file confirmed to send

  // Chat message media file change
  const handleChatMediaFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported. Try uploading a JPG, PNG, GIF, WebP image or MP4/WebM video!');
      return;
    }
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("File too large. Please upload a file smaller than 10MB.");
      return;
    }
    setChatMediaFile(file);
    setShowMediaPreviewModal(true);
  };

  // Chat media file input trigger
  const triggerChatMediaFileInput = () => {
    document.getElementById('chatMediaFileInput').click();
  };
  const [messages, setMessages] = useState([])
  const [ipMessage, setIpMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const user = useSelector(st => st.user)
  const { unreadCounts } = useSelector(st => st.user)
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
    let a = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/info/?roomId=${roomId}`, 'GET');
    let response = await a.json();
    // console.log(response)
    setRoom(response)
  }
  

  useEffect(() => {
    setRoom(selectedRoom)
    // Mark room as read when selected
    if (selectedRoom && user._id) {
      markRoomAsRead(user._id, selectedRoom._id)
        .catch(error => console.error('Error marking room as read:', error));
    }
    // console.log(room, 'this is the room');
  }, [selectedRoom, user._id])

  useEffect(() => {
    let previewUrl;
    if (selectedFile) {
      previewUrl = URL.createObjectURL(selectedFile);
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile]);

  const dropdownOptions = [
    { label: "Room Info", className: "text-gray-700 hover:bg-gray-100 text-lg" },
    { label: "Exit Room", className: "hover:bg-red-500 hover:text-white text-red-600 text-lg" }
  ];

  // Send message with optional media
  const sendMessage = async (message, mediaFile = null) => {
    const senderInfo = {
      _id: user._id,
      name: user.name,
      icon: user?.icon
    }
    if (mediaFile) {
      try {
        const formData = new FormData();
        formData.append('image', mediaFile);
        formData.append('name', mediaFile.name);
        formData.append('roomId', selectedRoom?._id);
        formData.append('sender', user._id);
        formData.append('content', message);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (response.ok && result.media) {
          socket.emit('sendMessage', selectedRoom?._id, message, senderInfo, [result.media]);
        }
      } catch (error) {
        alert('Failed to send media message.');
      }
    } else {
      socket.emit('sendMessage', selectedRoom?._id, message, senderInfo);
    }
    // No need to call fetchRooms here, socket will update
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (ipMessage !== '' || confirmedMediaFile)) {
      handleSend();
    }
  };

  // Send button handler
  const handleSend = async () => {
    let message = ipMessage;
    setIpMessage('');
    let mediaFile = confirmedMediaFile;
    setConfirmedMediaFile(null);
    if (message !== '' || mediaFile) {
      await sendMessage(message, mediaFile);
    }
  };

  // const handleExitRoom = async () => {
  //   let res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/exit`, 'DELETE', {
  //     roomId: selectedRoom._id,
  //     userId: user._id
  //   })
  //   const a = await res.json();
  //   // if(res.status == 200){
  //   //   console.log(res)
  //   // }
  //   console.log(a);
  //   // socket.emit('roomUpdate', selectedRoom._id)
  //   console.log(cookie.userInfo, 'old ')

  //   const updatedCookie = {
  //     ...cookie.userInfo,
  //     rooms: cookie.userInfo.rooms.filter(room => String(room) !== String(a.response._id)),
  //   };

  //   // console.log(updatedCookie, 'updated')
  //   // console.log(a.response._id, 'yeh hai')
  //   setCookie('userInfo', updatedCookie, { path: '/' });
  //   console.log(cookie.userInfo, 'new ')

  //   dispatch(exitRoom(a.response._id))
  //   resetRoom()
  //   setShowExitModal(false)
  // }

  const handleExitRoom = async () => {
    let res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/exit`, 'DELETE', {
      roomId: selectedRoom._id,
      userId: user._id
    });
    const a = await res.json();
    
    const currentUserInfo = { ...cookie.userInfo };
    
    const updatedRooms = currentUserInfo.rooms.filter(
      roomId => String(roomId) !== String(selectedRoom._id)
    );
    
    const updatedCookie = {
      ...currentUserInfo,
      rooms: updatedRooms
    };
    
    setCookie('userInfo', updatedCookie, { path: '/' });
    
    dispatch(exitRoom(a.response._id));
    setShowExitModal(false);
}


  const getMessages = async () => {
    if (selectedRoom?._id) {
      let res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/message/?room_id=${selectedRoom._id}`, 'GET')
      let data = await res.json()
      let msgs = data.response;
      // console.log(msgs)
      setMessages(msgs)
    }
  }

  const handleEmojiSelect = (emojiObject) => {
    // console.log(emojiObject);
    setIpMessage(ipMessage + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleDropdownSelect = (s) => {
    // console.log(s.label);
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
    const a = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/admin`, 'POST', {
      room_id: selectedRoom._id,
      newAdminId: selectedUser._id
    })
    const res = await a.json()
    // console.log(res, 'response')
    updateRoomData()
    fetchRooms()
    socket.emit('roomUpdate', selectedRoom._id)
    setShowUserOptsModal(false)
  }

  const handleKickMember = async () => {
    const a = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/room/kick`, 'POST', {
      room_id: selectedRoom._id,
      memberId: selectedUser._id
    })
    // console.log(selectedRoom._id, 'sr', selectedUser._id, 'su')
    socket.emit('userKicked', selectedRoom._id, selectedUser._id)
    const res = await a.json();
    // console.log(res, 'kick response')
    updateRoomData()
    fetchRooms()
    setShowUserOptsModal(false)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Oops! Looks like that file isn\'t supported. Try uploading a JPG, PNG, GIF, or WebP image!');
            return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          alert("That file is too large. Please upload an image smaller than 5MB.");
          return;
        }

        setSelectedFile(file);
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
      const result = await uploadFile(`${import.meta.env.VITE_BACKEND_URL}/image/upload`, selectedFile, {
        name: selectedFile.name,
        roomId: room._id
      });
      // console.log('File uploaded successfully:', result);
      setSelectedFile(null);
      updateRoomData()
      fetchRooms()
      socket.emit('roomUpdate', selectedRoom._id)
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      // console.log(message.sender, 'sen')
      // console.log('New message received:', message);
      if (selectedRoom?._id === message.room_id) {
        // let newMessage = { content : message.content, sender : message.sender}
        setMessages((prevMessages) => [...prevMessages, message]);
        // Mark room as read again since user is actively viewing it
        if (user._id && message.sender._id !== user._id) {
          markRoomAsRead(user._id, selectedRoom._id)
            .catch(error => console.error('Error marking room as read:', error));
        }
        // console.log(messages)
      } else {
        // Update unread count for other rooms
        dispatch(setUnreadCount({ 
          roomId: message.room_id, 
          count: (unreadCounts[message.room_id] || 0) + 1 
        }));
      }
      // Update last message display
      fetchRooms();
    });

    socket.on('roomUpdate', (roomId) => {
      if (selectedRoom && selectedRoom._id === roomId) {
        // console.log('roomUpdate event received in Messages for room:', roomId);
        updateRoomData();
      }
      fetchRooms()
    });

    socket.on('userKicked', ({ roomId, userId }) => {
      // console.log('userKicked event received for room:', roomId, 'user:', userId);
      if (user._id === userId && roomId === selectedRoom._id) {
        setShowInfoModal(false)
        setShowDropdown(false)
        setShowEditRoomModal(false)
        setShowEmojiPicker(false)
        setShowExitModal(false)
        setShowInviteModal(false)
        setShowUserOptsModal(false)
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('roomUpdate')
      socket.off('userKicked')
    };
  }, [selectedRoom, user._id, unreadCounts, dispatch])

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

  if (!selectedRoom) {
    return (
      <div className='flex justify-center items-center h-full p-5'>
        <div className='text-4xl text-center'>Select a room and start talking!</div>
      </div>
    )
  }

  const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => (
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 underline break-all hover:text-blue-800'
        >
          {part}
        </a>
      ) : (
        <span key={i} className='whitespace-pre-wrap break-words'>{part}</span>
      )
    ));
  }

  return (
    <div className='h-full'>
      <div className='flex flex-col h-full justify-between'>
        <div className='h-[70px] bg-[#2a2a2a] rounded-tr-md px-1 sm:p-3 flex justify-between items-center sticky'>
          <div className='flex gap-3 items-center'>
            <div className='w-7 sm:hidden hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full cursor-pointer' onClick={() => {
              setShowRight(false)
              dispatch(updateSelectedRoom(null))
            }}>
              <img src={back} alt="" />
            </div>
            <div>
              {room?.icon ? (
                <PreviewableImage
                  src={room.icon?.url}
                  alt={room.icon?.name || room?.name || 'Room icon'}
                  title={room?.name}
                  className="h-9 w-9 sm:h-12 sm:w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-full bg-gray-400" />
              )}
            </div>
            <div className='text-2xl sm:text-3xl'>{room?.name}</div>
          </div>
          <div className='flex gap-1 sm:gap-5 items-center'>
            <div className='hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full p-1 cursor-pointer' onClick={() => setShowInviteModal(!showInviteModal)}>
              <img className='h-8 lg:h-10 invert' src={adduser} alt="" />
            </div>

            <div className='relative hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full p-1 cursor-pointer' onClick={() => setShowDropdown(!showDropdown)}>
              <img className='h-8 lg:h-10' src={threedots} alt="" />
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

        <div className='px-3 sm:px-5 my-2 h-[calc(100%-200px)] overflow-y-auto flex-col-reverse'>
          <div className='flex flex-col'>
            {groupedMessages?.map(([date, msgs]) => (
              <div key={date} className='flex flex-col items-center'>
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
                    <div key={groupIndex} className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} ${isCurrentUser ? 'self-end' : 'self-start'} max-w-[85%]`}>
                      {!isCurrentUser && userGroup[0].isFirstInGroup && (
                        <div className={`${isCurrentUser ? 'ml-2' : 'mr-2'} flex items-start mt-2`}>
                          {senderIcon?.url ? (
                            <PreviewableImage
                              src={senderIcon.url}
                              alt={senderIcon.name || firstMessage.sender.name || 'User'}
                              title={firstMessage.sender.name}
                              className="w-9 h-9 max-w-none rounded-full object-cover"
                            />
                          ) : (
                            <img src={usericon} alt="User" className="w-9 h-9 max-w-none rounded-full bg-gray-300 p-1" />
                          )}
                        </div>
                      )}

                      <div className='flex w-full'>
                        <div className='flex flex-col w-full'>
                          {userGroup.map((item, messageIndex) => (
                            <div key={messageIndex} className={`py-2 px-3 text-black bg-white my-1 rounded-2xl sm:text-lg ${isCurrentUser ? 'self-end' : 'self-start'} min-w-[50px] break-words whitespace-pre-wrap max-w-full`}>
                              {messageIndex === 0 && (
                                <div className={`text-xs mb-1 ${isCurrentUser && 'text-end'}`}>{item.sender.name}</div>
                              )}
                              {/* Show media above text if present */}
                              {item.media && item.media.length > 0 && (
                                <div className='mb-2'>
                                  {item.media.map((mediaObj, idx) => (
                                    mediaObj.type === 'image' ? (
                                      <PreviewableImage key={idx} src={mediaObj.url} alt='chat-media' className='max-h-60 rounded-lg mb-2' />
                                    ) : (
                                      <video key={idx} src={mediaObj.url} controls className='max-h-60 rounded-lg mb-2' />
                                    )
                                  ))}
                                </div>
                              )}
                              <div>{linkifyText(item.content)}</div>
                              <div className='text-xs text-end mt-1 text-gray-500'>{format(new Date(item.sentAt), 'hh:mm a')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className='h-[70px] bg-[#2a2a2a] flex justify-evenly items-center rounded-br-md text-black gap-4 sticky px-2'>
          <div className='relative hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full p-1 cursor-pointer'>
            {!showEmojiPicker ? (
              <img className='h-9' onClick={() => setShowEmojiPicker(!showEmojiPicker)} src={emojiButton} alt="" />
            )
            :
            (
              <img onClick={() => setShowEmojiPicker(!showEmojiPicker)} src={close} alt="" />
            )
            }
            <div className='absolute bottom-[40px] left-[0px]'><EmojiPicker open={showEmojiPicker} onEmojiClick={handleEmojiSelect} style={{ width: '300px' }}/></div>
          </div>
          {/* Chat media upload button */}
          <div className='relative hover:bg-gray-600 transition-all duration-300 ease-in-out rounded-full p-1 cursor-pointer' onClick={triggerChatMediaFileInput}>
            <span className='text-lg'>
              <img className='h-9' src={addImage} alt="" />
            </span>
            <input type='file' id='chatMediaFileInput' style={{ display: 'none' }} accept='image/*,video/*' onChange={handleChatMediaFileChange} />
          </div>
          {/* Show confirmed media preview near send button */}
          {confirmedMediaFile && (
            <div className='relative flex items-center'>
              {confirmedMediaFile.type.startsWith('image') ? (
                <img src={URL.createObjectURL(confirmedMediaFile)} alt='preview' className='h-12 w-12 rounded-lg object-cover mr-2' />
              ) : (
                <video src={URL.createObjectURL(confirmedMediaFile)} controls className='h-12 w-12 rounded-lg object-cover mr-2' />
              )}
              <span className='absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 cursor-pointer text-xs' onClick={() => setConfirmedMediaFile(null)}>✕</span>
            </div>
          )}
          <input value={ipMessage} onChange={(e) => { setIpMessage(e.target.value) }} onKeyPress={handleKeyPress} type="text" placeholder='Enter Message'
            className='w-[80%] h-11 p-2 rounded-full pl-4 text-lg' />
          <div className='text-white text-lg bg-[#8a3fff] px-3 py-2 rounded-full cursor-pointer font-oswald' onClick={handleSend}>Send</div>
        </div>
      {/* Chat media preview modal */}
      <Modal isOpen={showMediaPreviewModal} onClose={() => { setShowMediaPreviewModal(false); setChatMediaFile(null); }} width='w-[350px]'>
        <div className='flex flex-col items-center gap-4 p-4'>
          {chatMediaFile && (
            chatMediaFile.type.startsWith('image') ? (
              <img src={URL.createObjectURL(chatMediaFile)} alt='preview' className='h-40 w-40 object-cover rounded-lg' />
            ) : (
              <video src={URL.createObjectURL(chatMediaFile)} controls className='h-40 w-40 object-cover rounded-lg' />
            )
          )}
          <div className='flex gap-4 mt-2'>
            <button className='bg-gray-400 text-white px-4 py-2 rounded' onClick={() => { setShowMediaPreviewModal(false); setChatMediaFile(null); }}>Cancel</button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => { setConfirmedMediaFile(chatMediaFile); setShowMediaPreviewModal(false); }}>Add</button>
          </div>
        </div>
      </Modal>
      </div>

      <Modal isOpen={showInfoModal} onClose={toggleInfoModal} width='w-[85vw] sm:w-[600px]'>
        <div className='text-black'>
          <div className='text-center font-semibold text-2xl flex justify-center items-center gap-4'>
            <div>{room?.name}</div>
            <div className='cursor-pointer' onClick={() => toggleEditRoomModal()}><img src={edit} alt="Edit" /></div>
          </div>
          <EditRoomModal isOpen={showEditRoomModal} onClose={toggleEditRoomModal} room={selectedRoom} updateRoom={updateRoomData} fetchRooms={fetchRooms} />
          <div className='flex flex-col sm:flex-row justify-around p-3 gap-5 sm:gap-10 overflow-y-auto max-h-[50vh]'>
            <div className='flex flex-col w-full gap-4'>
              <div className='flex flex-col gap-3 items-center'>
                {selectedFile ? (
                  <div className="relative h-28 w-28">
                    <div className="absolute inset-0 rounded-full bg-blue-400 opacity-40 blur-sm"></div>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="relative h-full w-full rounded-full object-cover border-2 border-white shadow-xl"
                    />
                    <span className="absolute top-1 right-1 bg-yellow-300 text-black text-[10px] px-2 py-[2px] rounded-full shadow-sm">
                      PREVIEW
                    </span>
                  </div>
        ) : room?.icon?.url ? (
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-40 blur-sm"></div>
            <PreviewableImage
              src={room.icon.url}
              alt={room.icon?.name || room?.name || 'Room icon'}
              title={room?.name}
              className="relative h-full w-full rounded-full object-cover border-2 border-white shadow-xl"
            />
          </div>
                ) : (
                  <div className="h-28 w-28 rounded-full bg-gray-400" />
                )}

                <span className='mx-auto text-blue-400 hover:text-blue-700 cursor-pointer' onClick={triggerFileInput}>Change Room Icon</span>
                {selectedFile && (
                  <div className='flex flex-col gap-1'>
                    <div className='text-sm'>Selected image: {selectedFile.name}</div>
                    <div className='flex gap-2 justify-center'>
                      <div className='bg-gray-400 p-2 rounded text-white cursor-pointer text-sm' onClick={() => {
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
                    {room?.users?.map((e) => (
                      <li key={e._id} className='border-black border-b-[1px] p-2 flex justify-between'>
                        <div className='flex gap-3 items-center'>
                          {e.icon?.url ? (
                            <PreviewableImage
                              src={e.icon.url}
                              alt={e.name + ' avatar'}
                              title={e.name}
                              className="w-6 h-6 max-w-none rounded-full object-cover"
                            />
                          ) : (
                            <img className='w-6 h-6 max-w-none rounded-full bg-gray-300 object-cover p-[2px]' src={usericon} alt={e.name + ' avatar'} />
                          )}
                          <div>{e.name}</div>
                        </div>
                        {room?.admin?._id === user._id && e._id !== user._id && (
                          <div
                            className='text-xs flex items-center bg-slate-300 p-1 rounded-md cursor-pointer hover:bg-slate-400 border-black border-[1px]'
                            onClick={() => {
                              toggleUserOptsModal();
                              setSelectedUser(e);
                            }}
                          >
                            MANAGE
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
          <div className='flex flex-col pr-3'>
            <div
              onClick={() => {
                toggleInfoModal()
                setTimeout(() => {
                  setSelectedFile(null)
                }, 300);
              }}
              className='text-center text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors px-2 py-1 cursor-pointer inline-block self-end mt-4 sm:mt-0'>Close</div>
          </div>

        </div>
      </Modal>

      <InviteModal isOpen={showInviteModal} roomCode={room?._id} onClose={toggleInviteModal} />

      <Modal
        isOpen={showExitModal}
        onClose={toggleExitModal}
        width='w-[85vw] sm:w-[600px]'
      >
        <div className='text-black flex flex-col gap-3'>
          <div className='text-xl font-semibold'>Exit Room?</div>
          <div>Are you sure you want to exit this room?</div>
          <div className='flex self-end mr-4 gap-5'>
            <div onClick={toggleExitModal} className='text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors px-2 py-1 cursor-pointer'>Cancel</div>
            <div onClick={handleExitRoom} className='text-white text-center bg-red-500 rounded-md px-2 py-1 cursor-pointer'>Exit</div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showUserOptsModal}
        onClose={toggleUserOptsModal}
        width='w-[75vw] sm:w-[350px]'
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