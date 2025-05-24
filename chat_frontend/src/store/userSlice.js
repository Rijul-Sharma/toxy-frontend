import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        _id : '',
        email : '',
        name : '',
        rooms : [],
        selectedRoom : null,
        icon : ''
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
        }
    }
})  

export const {loginSuccess, logout, updateIcon, updateSelectedRoom, updateRooms, exitRoom} = UserSlice.actions

export default UserSlice.reducer