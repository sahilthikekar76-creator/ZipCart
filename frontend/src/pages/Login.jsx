import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from '../assets/login.webp';
import { loginUser } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
const navigate=useNavigate();
const location=useLocation();
const{user,guestId}=useSelector((state)=>state.auth);
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
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form)); 
  }

  return (
    <div className='w-full flex items-center justify-center gap-40 p-8 px-20 md:p-12'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 shadow-sm'>
        <div className="flex justify-center mb-6">
          <h2 className='text-xl font-medium'>Rabbit</h2>
        </div>
        <h2 className='text-2xl font-medium text-center mb-6'>Hey there!</h2>
        <p className='text-center mb-6'>
          Enter your username and password to login
        </p>

        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            required
            onChange={handleChange}
            placeholder="Enter your email address"
            className='w-full border rounded p-2'
          />
        </div>

        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            required
            onChange={handleChange}
            placeholder="Enter your password"
            className='w-full border rounded p-2'
          />
        </div>

        <button type="submit" className='w-full bg-black text-white rounded-lg font-semibold p-2 hover:bg-gray-800 transition'>
          Sign in
        </button>

        <p className='mt-6 text-center text-sm'>
          Don't have an account?
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>
            Register
          </Link>
        </p>
      </form>

      <div className="hidden md:block w-1/3 bg-gray-800 ">
        <div className="w-full h-full rounded-md">
          <img src={login} alt="login image" className='h-[550px] w-full object-cover' />
        </div>
      </div>
    </div>
  )
}

export default Login;
