import React, { useState, useEffect} from "react";
import './modal.css'

const Modal = ({isOpen, onClose, children, width = 'w-[400px]', padding = '10px', customStyles = {}}) => {
    const [isVisible, setIsVisible] = useState(isOpen)

    useEffect(() => {
      if(isOpen){
        setIsVisible(true)
      } else {
        setTimeout(() => setIsVisible(false), 300);
      }
    }, [isOpen])
    
    if(!isVisible) return null;

    const modalContentStyles = {
      // width,
      padding,
      ...customStyles,
  };

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
          <div className={`modal-content ${isOpen ? 'open' : ''} ${width}`} onClick={(e) => e.stopPropagation()} style={modalContentStyles}>
            {children}
          </div>
        </div>
    );
}

export default Modal
