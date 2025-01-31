import React, { useState } from "react";
import Modal from "./modal.jsx";
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
        <Modal isOpen={isOpen} width="400px" onClose={onClose}>
            <div className="text-black text-center flex flex-col">
                <div className='text-center text-xl font-semibold'>Invite Your Friends!</div>
                <div className="m-4 text-lg">Your Room Code is:</div>
                <div className="p-5 bg-slate-300 rounded">{roomCode}</div>
                <div className="m-10 flex flex-col gap-5">
                    <div onClick={copyToClipboard} className="bg-green-500 p-2 rounded-md">Copy to Clipboard</div>
                    <div onClick={shareViaEmail} className="bg-red-500 p-2 rounded-md">Share via Email!</div>
                    <div onClick={shareViaWhatsApp} className="bg-blue-500 p-2 rounded-md">Share via Whatsapp!</div>
                    <div onClick={shareViaTwitter} className="bg-yellow-500 p-2 rounded-md">Share via X!</div>
                    <div onClick={shareViaSMS} className="bg-violet-500 p-2 rounded-md">Share via SMS!</div>
                </div>
                <div onClick={onClose} className="self-end p-2 bg-blue-500 rounded-md">Close</div>
                
            </div>


        </Modal>
    )

}


export default InviteModal