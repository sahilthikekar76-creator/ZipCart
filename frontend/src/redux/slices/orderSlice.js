import { createSlice , createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from 'axios';

//async thunk to fetch user orders
export const fetchUserOrders=createAsyncThunk('orders/fetchUserOrders',async(_,{rejectWithValue})=>{
    try {
        const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("userToken")}`,
                }
            }
    );
    return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//async thunk to fetch order details by id
export const fetchUserOrderDetails=createAsyncThunk('orders/fetchUserOrderDetails',async(orderId,{rejectWithValue})=>{
    try {
        const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("userToken")}`,
                }
            }
    );
    return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const orderSlice=createSlice({
    name:"orders",
    initialState:{
        orders:[],
        totalOrders:0,
        orderDetails:null,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        //fetch user orders
        .addCase(fetchUserOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchUserOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload;
        })
        .addCase(fetchUserOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
        //fetch user order details
        .addCase(fetchUserOrderDetails.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchUserOrderDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.orderDetails=action.payload;
        })
        .addCase(fetchUserOrderDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
    }
});
export default orderSlice.reducer;