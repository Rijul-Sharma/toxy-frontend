import io from 'socket.io-client';

// console.log(import.meta.env.VITE_SOCKET_URL, 'socket url');  

const socket = io(`${import.meta.env.VITE_SOCKET_URL}`);

export default socket;