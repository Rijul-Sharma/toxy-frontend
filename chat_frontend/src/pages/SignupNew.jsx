import { React, useState } from 'react'
import leftLogo from '../assets/loginPageImg.png'
import logo from '../assets/logo.svg'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form'
import _fetch from '../fetch.js'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/userSlice.js'
import { useCookies } from 'react-cookie'

const SignupNew = () => {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [cookie, setCookie] = useCookies('userInfo')

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      clearErrors();
      
      const submitData = {
        email: data.email,
        name: data.username,
        password: data.password
      };

      let res = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, 'POST', submitData)
      let response = await res.json()
      
      if(res.status === 200){
        navigate('/chats')
        dispatch(loginSuccess(response))
        setCookie('userInfo', response, { path: '/' })
      }
      else if(res.status === 409) {
        setError('email', { type: 'manual', message: 'Email already exists. Please use a different email.' });
      }
      else if(res.status === 400) {
        setError('root', { type: 'manual', message: 'Please check your input and try again.' });
      }
      else {
        setError('root', { type: 'manual', message: 'Something went wrong. Please try again later.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('root', { type: 'manual', message: 'Network error. Please check your connection and try again.' });
    }
  }
    
  return (
    <>
        <div className='h-screen flex justify-center items-center'>
            <div className='hidden md:flex w-[60%] md:w-[55%] lg:w-[55%] xl:w-[60%] h-full bg-white justify-around items-center flex-col bg-gradient-to-br from-purple-600 via-indigo-700 to-gray-900 [@media(max-aspect-ratio:4/5)]:hidden'>
                <div className='flex flex-col items-center px-10 absolute top-0 left-0 py-10'>
                    <img src={logo} alt="Logo" className='h-20 sm:h-12 md:h-16 lg:h-20 invert' />
                </div>
                <div className='h-full w-full flex justify-center items-center pt-20 max-h-[90vh]'>
                    <img src={leftLogo} alt="Left Logo" className='w-2/3 h-2/3 object-contain max-h-[60vh]' />
                </div>
                <div className='absolute bottom-14 font-light text-2xl md:text-xl lg:text-xl xl:text-2xl text-white/70 tracking-wide'>Always Connected.</div>
            </div>
            
            <div className='w-full md:w-[45%] lg:w-[45%] xl:w-[40%] [@media(max-aspect-ratio:4/5)]:w-full h-full bg-[#1d1d1d] text-white flex justify-center items-center relative overflow-hidden'>
                <div className='w-full h-full flex flex-col justify-center items-center relative z-10'>
                    <div className='md:hidden [@media(max-aspect-ratio:4/5)]:flex flex flex-col items-center mb-8'>
                        <img src={logo} alt="Logo" className='h-16 invert mb-2' />
                        <div className='text-white/60 text-sm font-light tracking-wide'>Always Connected.</div>
                    </div>
                    
                    <div className='max-w-[615px] flex flex-col gap-8 md:gap-6 lg:gap-6 [@media(max-aspect-ratio:4/5)]:gap-5 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-gray-600/60 shadow-2xl rounded-2xl justify-center items-center w-[90%] sm:w-[85%] md:w-[85%] lg:w-[85%] xl:w-[80%] [@media(max-aspect-ratio:4/5)]:w-[90%] px-5 md:px-6 lg:px-6 xl:px-5 py-6 sm:py-8 md:py-6 lg:py-6 xl:py-8 [@media(max-aspect-ratio:4/5)]:py-5 h-auto max-h-[85vh] md:h-[80%] lg:h-[80%] xl:h-[75%] [@media(max-aspect-ratio:4/5)]:max-h-[80vh] [@media(max-aspect-ratio:4/5)]:h-auto'>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='text-base sm:text-lg md:text-sm lg:text-sm xl:text-lg [@media(max-aspect-ratio:4/5)]:text-sm font-sans'>Hey there! Let's get started...</div>
                            <div className='text-4xl sm:text-5xl md:text-4xl lg:text-4xl xl:text-6xl [@media(max-aspect-ratio:4/5)]:text-3xl font-oswald font-semibold'>Sign Up</div>
                        </div>
                        <div className='w-full'>
                            <form className='flex flex-col gap-5 sm:gap-6 md:gap-5 lg:gap-5 xl:gap-8 [@media(max-aspect-ratio:4/5)]:gap-4' onSubmit={handleSubmit(onSubmit)}>
                                {errors.root && (
                                    <div className='text-red-400 text-sm text-center bg-red-900/20 border border-red-400/30 rounded-lg p-3'>
                                        {errors.root.message}
                                    </div>
                                )}
                                <div className="username">
                                    <div className='mb-1 text-base sm:text-lg md:text-sm lg:text-sm xl:text-lg [@media(max-aspect-ratio:4/5)]:text-xs [@media(max-aspect-ratio:4/5)]:mb-1'>Enter username :</div>
                                    <input 
                                        className='w-full bg-transparent border-b-[1px] border-white text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 p-2' 
                                        type="text" 
                                        placeholder='Username' 
                                        {...register("username", {
                                            required: { value: true, message: "Username is required" },
                                            minLength: { value: 2, message: "Username must be at least 2 characters" },
                                            maxLength: { value: 30, message: "Username must be less than 30 characters" }
                                        })}
                                    />
                                    {errors.username && <div className='text-red-400 text-xs mt-1'>{errors.username.message}</div>}
                                </div>
                                <div className="email">
                                    <div className='mb-1 text-base sm:text-lg md:text-sm lg:text-sm xl:text-lg [@media(max-aspect-ratio:4/5)]:text-xs [@media(max-aspect-ratio:4/5)]:mb-1'>Enter email :</div>
                                    <input 
                                        className='w-full bg-transparent border-b-[1px] border-white text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 p-2' 
                                        type="email" 
                                        placeholder='Email' 
                                        {...register("email", {
                                            required: { value: true, message: "Email is required" },
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                    {errors.email && <div className='text-red-400 text-xs mt-1'>{errors.email.message}</div>}
                                </div>
                                <div className="password">
                                    <div className='mb-1 text-base sm:text-lg md:text-sm lg:text-sm xl:text-lg [@media(max-aspect-ratio:4/5)]:text-xs [@media(max-aspect-ratio:4/5)]:mb-1'>Enter password :</div>
                                    <div className='relative'>
                                        <input 
                                            className='w-full bg-transparent border-b-[1px] border-white text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 p-2' 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder='Password' 
                                            {...register("password", {
                                                required: { value: true, message: "Password is required" },
                                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                    message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                                                }
                                            })}
                                        />
                                        <div
                                        className='absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer text-base sm:text-lg md:text-sm lg:text-sm xl:text-lg [@media(max-aspect-ratio:4/5)]:text-xs mr-2'
                                        onClick={togglePassword}
                                        >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </div>
                                    </div>
                                    {errors.password && <div className='text-red-400 text-xs mt-1'>{errors.password.message}</div>}
                                </div>
                                <div className='w-full flex flex-col gap-4'>
                                    <button 
                                        className='bg-[#8a3fff] hover:bg-[#6a2fff] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg p-3 sm:p-2 font-oswald text-lg sm:text-xl md:text-base lg:text-base xl:text-xl [@media(max-aspect-ratio:4/5)]:text-sm [@media(max-aspect-ratio:4/5)]:p-2 transition-colors duration-75' 
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                    <div className='text-center text-sm sm:text-base md:text-xs lg:text-xs xl:text-base [@media(max-aspect-ratio:4/5)]:text-xs'>Already have an account? <Link to="/login" className='text-[#8a3fff] hover:text-[#6a2fff] cursor-pointer'>Login</Link> now!</div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default SignupNew