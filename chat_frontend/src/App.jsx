import { useState, useEffect } from 'react'
import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import LoginNew from './pages/LoginNew.jsx'
import SignupNew from './pages/SignupNew.jsx'
import Chats from './pages/chats.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'
import { loginSuccess } from './store/userSlice.js'
import Signup from './pages/Signup.jsx'


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const abc = useSelector((st) => st);
  const [cookie, setCookie] = useCookies(['userInfo'])
  const userInfo = cookie.userInfo;

  
  // useEffect(() => {
  //   console.log(abc)
  // },)
  
  useEffect(() => {
    if(userInfo){
      // console.log(cookie.userInfo)
      dispatch(loginSuccess(cookie.userInfo || {}))
    }
  }, [])
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element= {userInfo ? <Navigate to="/chats" /> : <Navigate to="/login" />}/>
        <Route path='/login' element={userInfo ? <Navigate to="/chats" /> : <LoginNew />}/>
        <Route path='/signup' element={userInfo ? <Navigate to="/chats" /> : <SignupNew />}/>
        <Route path='/chats' element= {userInfo ? <Chats/> : <Navigate to="/login" />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
