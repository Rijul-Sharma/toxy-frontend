import React, { useState } from "react";
import Modal from "./modal.jsx";
import copy from '../assets/copy.svg'
import whatsappIcon from '../assets/whatsappIcon.png'
import emailIcon from '../assets/emailIcon.png'
import xIcon from '../assets/xIcon.png'
import smsIcon from '../assets/smsIcon.png'
// import QRious from "qrious";

const InviteModal = ({isOpen, onClose, roomCode}) => {

    const msgBody = `
    Hey! Join my chat room and let's start chatting!
    Use the below given room code to connect :

    -------------------------------

    Room Code: ${roomCode}

    -------------------------------

    See you there ;)`

    const isMobileDevice = () => {
        return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode).then(()=>{
            alert("Room code copied successfully!")
        })
    }

    const shareViaEmail = () => {
        const subject = encodeURIComponent("Join my chat room!")
        const body = encodeURIComponent(msgBody)
        window.location.href = `mailto:?subject=${subject}&body=${body}`
    }

    const shareViaWhatsApp = () => {
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(msgBody)}`;
        if (isMobileDevice()) {
            window.location.href = whatsappURL;
          } else {
            window.open(whatsappURL, "_blank");
          }
    };

    const shareViaTwitter = () => {
        const twitterDMURL = `https://twitter.com/messages/compose?text=${encodeURIComponent(msgBody)}`;
        window.open(twitterDMURL, "_blank");
    };

    const shareViaSMS = () => {
        const smsURL = `sms:?body=${encodeURIComponent(msgBody)}`;
        window.location.href = smsURL;
    };


    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} width="sm:w-[350px]" onClose={onClose}>
            <div className="text-black text-center flex flex-col">
                <div className='text-center text-2xl font-semibold'>Invite Your Friends</div>
                <div className="m-4 text-lg">Your Room Code is:</div>
                <div className="px-3 py-1 mx-auto bg-gray-200 rounded flex gap-3 justify-between items-center">
                    <div>{roomCode}</div>
                    <div className="h-10 border-[1px] border-gray-300"></div>
                    <div onClick={copyToClipboard} className="cursor-pointer"><img src={copy} alt="" /></div>
                    </div>
                <div className="my-10 flex flex-col gap-5">
                    <div className="text-lg">Share Via :</div>
                    {/* <div onClick={copyToClipboard} className="bg-green-500 p-2 rounded-md">Copy to Clipboard</div> */}
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        <div className="w-14 cursor-pointer" onClick={shareViaWhatsApp}><img src={whatsappIcon} alt="" /></div>
                        <div className="w-14 cursor-pointer" onClick={shareViaEmail}><img src={emailIcon} alt="" /></div>
                        <div className="w-14 cursor-pointer" onClick={shareViaTwitter}><img src={xIcon} alt="" /></div>
                        <div className="w-14 cursor-pointer" onClick={shareViaSMS}><img className="w-14 h-14" src={smsIcon} alt="" /></div>
                    </div>
                </div>
                <div onClick={onClose} className="self-end p-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer">Close</div>
                
            </div>


        </Modal>
    )

}


export default InviteModal