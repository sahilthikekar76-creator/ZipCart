import React, { useEffect } from "react";
import MyOrdersPage from "./MyOrdersPage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const{user}=useSelector((state)=>state.auth);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  useEffect(()=>{
    if(!user){
      navigate('/login');
    }
  },[user,navigate]);
  const handleLogout=()=>{
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  }
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* LEFT SECTION */}
          <div className="w-full md:w-1/4 bg-white shadow-md rounded-4xl h-fit p-6 ">
            <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* RIGHT SECTION */}
         
        <MyOrdersPage/>

        </div>

      </div>
    </div>
  );
};

export default Profile;
