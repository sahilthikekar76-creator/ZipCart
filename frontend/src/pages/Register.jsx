import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { registeredUser} from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';
const Register = () => {
    const[form,setForm]=useState({username:"",email:"",password:"",confirmPassword:""});
    const dispatch=useDispatch();
    const navigate=useNavigate();
const location=useLocation();
const{user,guestId,loading}=useSelector((state)=>state.auth);
const {cart}=useSelector((state)=>state.cart);
//get redirect parameter and check if its checkout or something
const redirect=new URLSearchParams(location.search).get("redirect")||"/";
const isCheckoutRedirect=redirect.includes("checkout");
useEffect(()=>{
  if(user){
    if(cart?.products.length>0 && guestId){
      dispatch(mergeCart({guestId,user})).then(()=>{
        navigate(isCheckoutRedirect?"/checkout":"/");
      })
    }else{
      navigate(isCheckoutRedirect?"/checkout":"/");
    }
  }
},[user,guestId,cart,navigate,isCheckoutRedirect,dispatch]);
      const handleChange=(e)=>{
          setForm({...form,[e.target.name]:e.target.value});
      };
      const handleSubmit = async (e) => {
        e.preventDefault();

        //  Validate password match first
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match", { duration: 1000 });
         return;
      }

      //  Create payload WITHOUT confirmPassword
      const payload = {
        name: form.username, // backend expects `name`
        email: form.email,
        password: form.password,
      };

      //  Correct dispatch
      dispatch(registeredUser(payload));
      };

      
  return (
    <div className='w-full flex items-center justify-center gap-40 p-8 px-20 md:p-12'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 shadow-sm'>
        <div className="flex justify-center mb-4">
          <h2 className='text-xl font-medium'>Rabbit</h2>
        </div>
        <h2 className='text-2xl font-medium text-center mb-6'>Hey there!</h2>
        <p className='text-center mb-4'>
          Enter your credntials to register 
        </p>
        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Username</label>
          <input name="username" type="text"value={form.username} required onChange={handleChange} placeholder="Enter your username" className='w-full border rounded p-2' ></input>
        </div>
        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Email</label>
          <input name="email" type="email"value={form.email} required onChange={handleChange} placeholder="Enter your email address" className='w-full border rounded p-2' ></input>
        </div>
        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <input name="password" type="password"value={form.password} onChange={handleChange} required placeholder="Enter your password" className='w-full border rounded p-2' ></input>
        </div>
        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Confirm Password</label>
          <input name="confirmPassword" type="password"value={form.confirmPassword} onChange={handleChange} required placeholder="Confirm password" className='w-full border rounded p-2' ></input>
        </div>
        <button type="submit" className='w-full bg-black text-white rounded-lg font-semibold p-2 hover:bg-gray-800 transition'>
          {loading?"Loading...":"Register"}</button>
        <p className='mt-6 text-center text-sm'>
          Already register?
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>
          Login</Link>
        </p>
      </form>
      <div className="hidden md:block w-1/3 bg-gray-800 ">
        <div className="w-full h-full rounded-md">
          <img  src="/assets/register.webp" alt="register image" className='h-[650px] w-full object-cover'></img>
        </div>
      </div>
    </div>
  )
}

export default Register
