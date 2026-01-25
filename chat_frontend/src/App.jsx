import { useState, useEffect } from 'react'
import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import LoginNew from './pages/LoginNew.jsx'
import SignupNew from './pages/SignupNew.jsx'
import Chats from './pages/chats.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, setAuthLoading } from './store/userSlice.js'
import authService from './services/authService.js'
import InstallBanner from './components/InstallBanner.jsx'


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((st) => st.user);

  // const abc = useSelector((st) => st.user);
  // console.log(abc, 'from app jsx');

  // Initialize authentication on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get current user
        const result = await authService.getCurrentUser();

        if (result.success && result.user) {
          // User is authenticated, hydrate Redux
          dispatch(loginSuccess(result.user));
        } else if (result.statusCode === 401) {
          // Access token expired, try to refresh
          const refreshResult = await authService.refreshToken();

          if (refreshResult.success) {
            // Refresh successful, try to get user again
            const retryResult = await authService.getCurrentUser();

            if (retryResult.success && retryResult.user) {
              dispatch(loginSuccess(retryResult.user));
            } else {
              // Still failed, user is not authenticated
              dispatch(setAuthLoading(false));
            }
          } else {
            // Refresh failed, user is not authenticated
            dispatch(setAuthLoading(false));
          }
        } else {
          // Other error or no auth, user is not authenticated
          dispatch(setAuthLoading(false));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch(setAuthLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1d1d1d]">
        <div></div>
      </div>
    );
  }

  return (
    <>
      <InstallBanner />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isAuthenticated ? <Navigate to="/chats" /> : <Navigate to="/login" />}/>
          <Route path='/login' element={isAuthenticated ? <Navigate to="/chats" /> : <LoginNew />}/>
          <Route path='/signup' element={isAuthenticated ? <Navigate to="/chats" /> : <SignupNew />}/>
          <Route path='/chats' element={isAuthenticated ? <Chats/> : <Navigate to="/login" />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
