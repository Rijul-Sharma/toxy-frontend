import React, { useEffect, useState } from 'react'
import close from '../assets/close.svg'

const InstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowBanner(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowBanner(false)
    }
  }

  const handleClose = () => {
    setShowBanner(false)
  }

  if (!showBanner || isInstalled) return null

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#8a3fff] to-purple-600 text-white shadow-lg animate-slideDown'>
      <div className='flex items-center justify-between px-4 py-3 max-w-7xl mx-auto'>
        <div className='flex items-center gap-3 flex-1'>
          <img src='/icons/PWAicon192.png' alt='Toxy' className='h-10 w-10 rounded-lg' />
          <div className='flex flex-col'>
            <span className='font-semibold text-sm md:text-base'>Install Toxy</span>
            <span className='text-xs md:text-sm text-gray-200'>Add to your home screen for quick access</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleInstall}
            className='bg-white text-[#8a3fff] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base'
          >
            Install
          </button>
          <button
            onClick={handleClose}
            className='p-1 hover:bg-white/20 rounded-lg transition-colors'
          >
            <img src={close} alt='Close' className='h-5 w-5 invert' />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default InstallBanner
