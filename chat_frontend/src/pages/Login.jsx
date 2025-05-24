import React, { useState } from 'react'
import backgroundimg from '../assets/pexels-instawally-176851.jpg'
import { useForm } from 'react-hook-form'
import _fetch from '../fetch.js'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/userSlice.js'
import { useCookies } from 'react-cookie'
import logo from '../assets/logo.svg'
import uploadFile from '../uploadFile.js'

const   Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [cookie, setCookie] = useCookies('userInfo')
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    setError,    
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log(data);
    let res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, 'POST', data)
    let response = await res.json()
    // console.log(response)
    // const cookieSize = encodeURIComponent(JSON.stringify(response)).length;
    // console.log('Cookie size (bytes):', cookieSize);
    if(res.status===200){
      navigate('/chats')
      dispatch(loginSuccess(response))
      setCookie('userInfo', response, { path: '/' })
    }
    else{
      // console.log('else')
      setError('password', { type: 'manual', message: 'Invalid email or password.' });
    }
  }

  return (
    <div className="bg-cover bg-center h-screen flex justify-center items-center" style={{ backgroundImage: `url(${backgroundimg})` }}>
      <div className='h-full w-full sm:h-[80vh] sm:w-[75vw] xl:w-[60vw] flex items-center rounded-t-lg sm:rounded-lg sm:flex-row flex-col overflow-y-auto sm:overflow-y-hidden'>
        <div className='w-full bg-black sm:h-full rounded-tl-lg sm:rounded-bl-lg text-white items-center p-4 sm:block flex flex-col gap-10'>
          <div className='mt-10 sm:h-[35%]'>
            <img className='h-20 sm:h-12 md:h-16 lg:h-20 w-full invert' src={logo} alt="" />
          </div>
          <div className='sm:h-[65%]'>
            <div className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center px-2 mb-5'>
              Welcome Back!
            </div>
            <div className='text-center text-xl font-light'>
              {/* Login and lets catch up! */}
              ( We Missed You )
            </div>
          </div>
        </div>
        <div className='bg-white h-full w-full flex justify-evenly gap-8 sm:gap-0 items-center flex-col sm:rounded-tr-lg sm:rounded-br-lg text-black pt-10 p-4'>
          <h1 className='text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bree'>Log In</h1>
          <form className='flex flex-col gap-10' action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="email">
              <div className='mb-2 text-xl'>Enter email :</div>
              <input className='border-gray-500 border-2 p-2 rounded-md' type="text" placeholder='Email' {...register("email", {required : {value:true, message:"email is required"}})}/>
              {errors.email && <div className='absolute text-red-500'>{errors.email.message}</div>}
            </div>
            <div className="pass">
              <div className='mb-2 text-xl'>Enter password :</div>
              <input className='border-gray-500 border-2 p-2 rounded-md' type="password" placeholder='Password' {...register("password", {required : {value:true, message:"Password is required"}})}/>
              {errors.password && <div className='absolute text-red-500'>{errors.password.message}</div>}
            </div>
            <div className='flex flex-col gap-5'>
              <input className='bg-black p-1 rounded-md text-white w-[50%] self-center' type="submit" value={"Login"}/>
              <div className='self-center'>New here? <Link className='text-blue-500' to='/signup'>Sign Up now!</Link> </div>
            </div>
          </form>
        </div>
        </div>
    </div>
  )
}

export default Login
