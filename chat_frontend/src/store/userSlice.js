import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        _id : '',
        email : '',
        name : '',
        rooms : [],
        selectedRoom : null,
        icon : '',
        unreadCounts : {}
}

export const UserSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        loginSuccess : (state,action) => {
            state._id = action.payload._id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.rooms = action.payload.rooms;
            state.icon = action.payload.icon;
        },
        logout : (state,action) => {
            state._id = ''
            state.email = ''
            state.name = ''
            state.rooms = ''
            state.icon = ''
            state.selectedRoom = null
            state.unreadCounts = {}
        },
        updateIcon : (state,action) => {
            state.icon = action.payload
        },
        updateSelectedRoom : (state,action) => {
            state.selectedRoom = action.payload
        },
        updateRooms : (state,action) => {
            state.rooms = [...state.rooms, action.payload]
        },
        exitRoom: (state, action) => {
            // console.log(action.payload, 'payload received')
            state.rooms = state.rooms.filter(room => String(room) !== String(action.payload));
            // state.selectedRoom = state.rooms[0];
            if (state.selectedRoom && state.selectedRoom._id === action.payload) {
                // state.selectedRoom = state.rooms.length > 0 ? state.rooms[0] : null;
                state.selectedRoom = null;
            }
            // Remove unread count for exited room
            delete state.unreadCounts[action.payload];
        },
        updateUnreadCounts: (state, action) => {
            state.unreadCounts = { ...state.unreadCounts, ...action.payload };
        },
        setUnreadCount: (state, action) => {
            const { roomId, count } = action.payload;
            state.unreadCounts[roomId] = count;
        },
        clearUnreadCount: (state, action) => {
            const roomId = action.payload;
            state.unreadCounts[roomId] = 0;
        }
    }
})  

export const {loginSuccess, logout, updateIcon, updateSelectedRoom, updateRooms, exitRoom, updateUnreadCounts, setUnreadCount, clearUnreadCount} = UserSlice.actions

export default UserSlice.reducer