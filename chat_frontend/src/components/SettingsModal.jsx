import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import Modal from './modal.jsx';
import uploadFile from '../uploadFile.js';
import edit from '../assets/edit.svg'
import _fetch from '../fetch.js'
import tick from '../assets/tick.svg'
import { loginSuccess, updateIcon, logout } from '../store/userSlice.js';
import { useCookies } from 'react-cookie';
import trash from '../assets/trash.svg'
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose, user }) => {

    const [selection, setSelection] = useState('1')
    const [selectedFile, setSelectedFile] = useState(null);
    const [editName, setEditName] = useState(false)
    const [ipName, setIpName] = useState(user.name)
    const [icon, setIcon] = useState({})
    const [cookie, setCookie, removeCookie] = useCookies('userInfo')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const toggleShowDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const [confirmationText, setConfirmationText] = useState('');


    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const fetchIcon = async () => {
    //     let a = await _fetch(`http://localhost:5000/api/user/icon/?userId=${user._id}`, 'GET')
    //     let response = await a.json();
    //     console.log(response, 'icon response')
    // }

    const fetchIcon = async () => {
        if (!user?._id) return;
        let a = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/user/icon/?userId=${user._id}`, 'GET')
        let response = await a.json();
        setIcon(response)
    }

    useEffect(()=>{
        if (user && user._id) {
            fetchIcon();
        }
    }, [user._id])

    const ipNameChange = (e) => {
        setIpName(e.target.value)
    }

    const saveName = async () => {
        let a = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/user/updateName`, 'POST', {
            userId : user._id,
            newUserName : ipName,
        })

        let res = await a.json();
        // console.log(res, 'name response')
        setEditName(false)
        dispatch(loginSuccess(res.response))
        setCookie('userInfo', res.response, { path: '/' });
    }

    useEffect(()=> {
        setIpName(user.name || '')
    }, [user.name])


    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
          console.error('No file selected');
          return;
        }
    
        try {
          const result = await uploadFile(`${import.meta.env.VITE_BACKEND_URL}/image/upload`, selectedFile, {
            name: selectedFile.name,
            userId : user._id
          });
        //   console.log('File uploaded successfully:', result);
          setSelectedFile(null);
          fetchIcon()
          const updatedCookie = {
            ...cookie.userInfo,
            icon : result._id
          };
          setCookie('userInfo', updatedCookie, { path : '/'})
          dispatch(updateIcon(result._id))
        } catch (error) {
          console.error('File upload failed:', error);
        }
      };


    const handleDeleteAccount = async () => {
        const a = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/user/delete?userId=${user._id}`, 'DELETE')
        const res = await a.json();
        // console.log(res);
        if(a.status === 200){
            navigate('/login')
            dispatch(logout())
            removeCookie('userInfo');
        }
    }

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


    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} width="w-[85vw] sm:w-[500px]" onClose={onClose}>

            <div className='flex flex-col'>
                <div className='text-center font-semibold text-2xl mb-5'>Settings</div>
                <div className="flex flex-col sm:flex-row">
                    <div className='w-full sm:w-[40%]'>
                        <ul className='flex flex-row sm:flex-col gap-6 sm:gap-1 mb-3 sm:mb-0'>
                            <li className={`cursor-pointer p-1 transition-all duration-100 ease-in-out ${selection === '1' ? 'border-b-2 border-[#8a3fff] text-[#8a3fff]' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSelection('1')}>User Info</li>
                            {/* <li className={`cursor-pointer p-1 transition-all duration-100 ease-in-out ${selection === '2' ? 'border-b-2 border-[#8a3fff] text-[#8a3fff]' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSelection('2')}>Change Theme</li> */}
                            <li className={`cursor-pointer p-1 transition-all duration-100 ease-in-out ${selection === '2' ? 'border-b-2 border-[#8a3fff] text-[#8a3fff]' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSelection('2')}>Manage Account</li>
                        </ul>
                    </div>

                    <div className='w-full min-h-64 px-3'>
                        {selection === '1' && (
                            <div className='flex flex-col items-center gap-4 w-full mx-auto sm:w-full'>
                                <div className='flex flex-col gap-3 items-center'>
                                    {selectedFile ? (
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Preview"
                                            className="h-28 w-28 rounded-full object-cover"
                                        />
                                    ) : icon?.url ? (
                                        <img
                                            src={icon.url}
                                            alt="User Icon"
                                            className="h-28 w-28 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-28 w-28 rounded-full bg-gray-400 flex items-center justify-center text-white text-4xl font-bold">
                                            {(() => {
                                                if (!user.name) return '?';
                                                const parts = user.name.trim().split(' ');
                                                const first = parts[0]?.charAt(0).toUpperCase() || '';
                                                const second = parts[1]?.charAt(0).toUpperCase() || '';
                                                return (first + second) || '?';
                                            })()}
                                        </div>
                                    )}
                                    <span className='mx-auto text-blue-400 hover:text-blue-700 cursor-pointer' onClick={triggerFileInput}>Change User Icon</span>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
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
                                <div className='flex justify-between w-full'>
                                    <div>Email :</div>
                                    <div>{user.email}</div>
                                </div>
                                <div className='flex justify-between w-full'>
                                    <div>Username :</div>
                                    {editName ? (
                                        <div className='flex gap-2 transition-all'>
                                            <div>
                                                <input className='pl-1 border-2 border-[#8a3fff] focus:border-[#8a3fff] focus:outline-none' type="text" value={ipName} onChange={ipNameChange} autoFocus/>
                                            </div>
                                            <div className='hover:bg-slate-200 rounded-full p-[1px] transition-all ease-in-out' onClick={()=>saveName()}>
                                                <img src={tick} alt="" />
                                            </div>
                                        </div>

                                    ) : (
                                        <div className='flex gap-1'>
                                            <div>{user.name}</div>
                                            <div className='cursor-pointer' onClick={()=> setEditName(true)}><img src={edit} alt="" /></div>
                                        </div>
                                    )
                                    }
                                    
                                </div>
                            </div>
                        )}

                        {/* {selection === '2' && (
                            <div>
                                Choose a Theme :
                            </div>
                        )} */}

                        {selection === '2' && (
                            <div className="flex flex-row justify-between p-2 hover:bg-slate-100 rounded-md" onClick={() => setShowDeleteModal(true)}>
                                <div className='font-semibold text-red-500'>Delete Account</div>
                                <div><img src={trash} alt="" /></div>
                            </div>
                        )}
                        <Modal width='w-[75vw]' isOpen={showDeleteModal} onClose={toggleShowDeleteModal}>
                        <div className='text-black flex flex-col gap-3'>
                            <div className='text-xl font-semibold'>Delete Account?</div>
                            <div>Are you sure you want to permanently delete your account? This action is <span className='font-semibold text-red-500'>IRREVERSIBLE!</span></div>
                            
                            {/* Confirmation Text */}
                            <div className="mt-4">
                            <label className="text-sm">Type &quot;DELETE&quot; to confirm:</label>
                            <input
                                type="text"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                className="mt-2 p-2 border border-gray-300 rounded w-full"
                                autoFocus
                            />
                            </div>

                            <div className='flex self-end gap-5 mt-4'>
                            <div
                                onClick={toggleShowDeleteModal}
                                className='text-center text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer px-2 py-1'
                            >
                                Cancel
                            </div>
                            <div
                                onClick={handleDeleteAccount}
                                className={`text-center bg-red-500 rounded-md px-2 py-1 ${confirmationText !== "DELETE" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                style={{ pointerEvents: confirmationText !== "DELETE" ? 'none' : 'auto' }}
                            >
                                Delete Account
                            </div>
                            </div>
                        </div>
                        </Modal>
                    </div>

                </div>

                <div onClick={onClose} className="self-end p-2  text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer">Close</div>
            </div>
            
            
            
        </Modal>

    )
}

export default SettingsModal
