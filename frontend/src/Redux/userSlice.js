import {createSlice} from "@reduxjs/toolkit"
import otherUser from "../components/OtherUser";
import { act } from "react";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        authUser : null,
        otherUsers :null,
        selectedUser:null,
        onlineUsers:null,
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
        },
        setOtherUser:(state,action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
        },
        resetUserState:(state,action)=>{
            
            state.otherUsers = null;
            state.selectedUser = null;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        }

        
    }

    
}
)
export const {setAuthUser,setOtherUser,setSelectedUser,resetUserState,setOnlineUsers} = userSlice.actions;
export default userSlice.reducer;