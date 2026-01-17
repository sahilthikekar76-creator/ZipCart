import { createSlice,createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import axios from'axios';

//retrive user info and tokens from localstorage if avilable
const userFromStorage=localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null;

//check for an existing guest id in the localstorage or generate a new one 
const initialGuestId=localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem('guestId',initialGuestId);

//initial state
const initialState={
    user:userFromStorage,
    guestId:initialGuestId,
    loading:false,
    error:null,
};

//async thunk for user login

export const loginUser=createAsyncThunk('auth/loginuser',async(userData,{rejectWithValue})=>{
    try {
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usenr/logi`)
    } catch (error) {
        
    }
})