import React from 'react'
import backgroundimg from '../assets/4K-Minimalist-Wallpaper-HD-82745.jpg'
import { useForm } from 'react-hook-form'
import _fetch from '../fetch.js'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/userSlice.js'
import { useCookies } from 'react-cookie'


const Signup = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [cookie, setCookie] = useCookies('userInfo')

  const {
    register,
    handleSubmit,
    setError,    
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    let res = await _fetch(`http://localhost:5000/api/auth/login`, 'POST', data)
    let response = await res.json()
    console.log(response)
    const cookieSize = encodeURIComponent(JSON.stringify(response)).length;
    console.log('Cookie size (bytes):', cookieSize);
    if(res.status===200){
      navigate('/chats')
      dispatch(loginSuccess(response))
      setCookie('userInfo', response)
    }
  }

  return (
    <div className="bg-cover bg-center h-screen flex justify-center items-center" style={{ backgroundImage: `url(${backgroundimg})` }}>
      <div className='h-[70vh] w-[40vw] bg-white opacity-80 flex justify-evenly items-center flex-col'>
        <h1 className='text-6xl'>Log In</h1>
        <form className='flex flex-col gap-10' action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="email">
            <input className='border-gray-500 border-2 p-1 rounded-md' type="text" placeholder='email' {...register("email", {required : {value:true, message:"email is required"}})}/>
            {errors.email && <div className='absolute text-red-500'>{errors.email.message}</div>}
          </div>
          <div className="pass">
            <input className='border-gray-500 border-2 p-1 rounded-md' type="password" placeholder='password' {...register("password", {required : {value:true, message:"Password is required"}})}/>
            {errors.password && <div className='absolute text-red-500'>{errors.password.message}</div>}
          </div>
          <input className='bg-blue-600 p-1 rounded-md text-black' type="submit" />
        </form>
      </div>
    </div>
  )
}

export default Signup
