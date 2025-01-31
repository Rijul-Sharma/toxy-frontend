import { useState, useEffect } from 'react'
import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Chats from './pages/chats.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'
import { loginSuccess } from '../store/userSlice.js'


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const abc = useSelector((st) => st);
  const [cookie, setCookie] = useCookies('userInfo')
  
  useEffect(() => {
    console.log(abc)
  },)
  
  useEffect(() => {
    // console.log(cookie)
    if(cookie){
      console.log(cookie.userInfo)
      dispatch(loginSuccess(cookie.userInfo || {}))
    }
  }, [])
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/chats' element= {<Chats/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
