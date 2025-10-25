import { React, useState } from 'react'
import leftLogo from '../assets/loginPageImg.png'
import logo from '../assets/logo.svg'
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginNew = () => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
    
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
                    
                    <div className='max-w-[630px] flex flex-col gap-10 md:gap-8 lg:gap-8 [@media(max-aspect-ratio:4/5)]:gap-6 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-gray-600/60 shadow-2xl rounded-2xl justify-center items-center w-[90%] sm:w-[85%] md:w-[85%] lg:w-[85%] xl:w-[80%] [@media(max-aspect-ratio:4/5)]:w-[90%] px-5 md:px-6 lg:px-6 xl:px-5 py-8 sm:py-10 md:py-8 lg:py-8 xl:py-10 [@media(max-aspect-ratio:4/5)]:py-6 h-auto max-h-[80vh] md:h-[75%] lg:h-[75%] xl:h-[70%] [@media(max-aspect-ratio:4/5)]:max-h-[75vh] [@media(max-aspect-ratio:4/5)]:h-auto'>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='text-base sm:text-lg md:text-sm lg:text-sm xl:text-lg [@media(max-aspect-ratio:4/5)]:text-sm font-sans'>Welcome Back! We missed you...</div>
                            <div className='text-4xl sm:text-5xl md:text-4xl lg:text-4xl xl:text-6xl [@media(max-aspect-ratio:4/5)]:text-3xl font-oswald font-semibold'>Login</div>
                        </div>
                        <div className='w-full'>
                            <form className='flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-6 xl:gap-10 [@media(max-aspect-ratio:4/5)]:gap-5' action="">
                                <div className="email">
                                    <div className='mb-2 text-lg sm:text-xl md:text-base lg:text-base xl:text-xl [@media(max-aspect-ratio:4/5)]:text-sm'>Enter email :</div>
                                    <input className='w-full bg-transparent border-b-[1px] border-white text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 p-2' type="email" name="email" id="email" placeholder='Email' />
                                </div>
                                <div className="password">
                                    <div className='mb-2 text-lg sm:text-xl md:text-base lg:text-base xl:text-xl [@media(max-aspect-ratio:4/5)]:text-sm'>Enter password :</div>
                                    <div className='relative'>
                                        <input className='w-full bg-transparent border-b-[1px] border-white text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 p-2' type={showPassword ? "text" : "password"} name="password" id="password" placeholder='Password' />
                                        <div
                                        className='absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer text-lg sm:text-xl md:text-base lg:text-base xl:text-xl [@media(max-aspect-ratio:4/5)]:text-sm mr-2'
                                        onClick={togglePassword}
                                        >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col gap-4'>
                                    <button className='bg-[#8a3fff] hover:bg-[#6a2fff] text-white rounded-lg p-3 sm:p-2 font-oswald text-lg sm:text-xl md:text-base lg:text-base xl:text-xl [@media(max-aspect-ratio:4/5)]:text-sm [@media(max-aspect-ratio:4/5)]:p-2 transition-colors duration-75 ' type="submit">Login</button>
                                    <div className='text-center text-sm sm:text-base md:text-xs lg:text-xs xl:text-base [@media(max-aspect-ratio:4/5)]:text-xs'>Don't have an account? <span className='text-[#8a3fff] hover:text-[#6a2fff] cursor-pointer'>Sign Up</span> now!</div>
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

export default LoginNew