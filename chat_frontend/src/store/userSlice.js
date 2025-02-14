import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        _id : '',
        email : '',
        name : '',
        rooms : [],
        selectedRoom : '',
        icon : ''
}

export const UserSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        loginSuccess : (state,action) => {
            state._id = action.payload._id
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.rooms = action.payload.rooms;
            state.icon = action.payload.icon;
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
            state.rooms = state.rooms.filter(room => room._id !== action.payload._id);
            state.selectedRoom = state.rooms[0];
        }
    }
})  

export const {loginSuccess, updateIcon, updateSelectedRoom, updateRooms, exitRoom} = UserSlice.actions

export default UserSlice.reducer