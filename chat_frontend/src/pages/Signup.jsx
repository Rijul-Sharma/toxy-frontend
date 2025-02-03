import React from 'react'
import backgroundimg from '../assets/4K-Minimalist-Wallpaper-HD-82745.jpg'
import { useForm } from 'react-hook-form'
import _fetch from '../fetch.js'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/userSlice.js'
import { useCookies } from 'react-cookie'
import logo from '../assets/logo.svg'

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
    let res = await _fetch(`http://localhost:5000/api/auth/signup`, 'POST', data)
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
      <div className='h-[80vh] w-[60vw] bg-white flex items-center rounded-lg'>
        <div className='w-full bg-black h-full rounded-tl-lg rounded-bl-lg text-white flex flex-col items-center p-4'>
          <div className='mt-10 h-[35%]'>
            <img className='h-20 w-full invert' src={logo} alt="" />
          </div>
          <div className='flex flex-col gap-5 h-[65%]'>
            <div className='text-6xl font-semibold text-center px-2'>
              Hey there!
            </div>
            <div className='text-center text-xl font-light'>
              {/* Login and lets catch up! */}
              Lets get you setup!
            </div>
          </div>
        </div>
        <div className='h-full w-full flex justify-evenly items-center flex-col rounded-lg text-black p-4'>
          <h1 className='text-6xl font-bree'>Sign Up</h1>
          <form className='flex flex-col gap-10' action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="email">
              <div className='mb-2'>Enter your email :</div>
              <input className='border-gray-500 border-2 p-2 rounded-md' type="text" placeholder='Email' {...register("email", {required : {value:true, message:"email is required"}})}/>
              {errors.email && <div className='absolute text-red-500'>{errors.email.message}</div>}
            </div>
            <div className="name">
                <div className='mb-2'>Enter your full name :</div>
                <input className='border-gray-500 border-2 p-2 rounded-md' type="text" placeholder='Name' {...register("name", {required: {
                    value:true, message:"name is required"}})}/>
            </div>
            <div className="pass">
              <div className='mb-2'>Enter password :</div>
              <input className='border-gray-500 border-2 p-2 rounded-md' type="password" placeholder='Password' {...register("password", {required : {value:true, message:"Password is required"}})}/>
              {errors.password && <div className='absolute text-red-500'>{errors.password.message}</div>}
            </div>
            <div className='flex flex-col gap-3'>
              <input className='bg-black p-1 rounded-md text-white w-[50%] self-center' type="submit" value={"Login"}/>
              <div className='self-center'>Already a user? <Link className='text-blue-500' to='/login'>Login in</Link> </div>
            </div>
          </form>
        </div>
        </div>
    </div>
  )
}

export default Signup
