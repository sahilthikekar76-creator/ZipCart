import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilter } from '../redux/slices/productSlice';
const CollectionPages = () => {
    const {collection}=useParams();
    const [searchParams]=useSearchParams();
    const dispatch=useDispatch();
    const{products,loading,error}=useSelector((state)=>state.products);
    const queryParams=Object.fromEntries([...searchParams]);
    useEffect(()=>{
      dispatch(fetchProductsByFilter({collection,...queryParams}));  
    },[dispatch,collection,searchParams]);
    
    const sidebarRef=useRef(null);
    const[isSideBarOpen,setIsSideBarOpen]=useState(false);
    const toggleSideBar=()=>{
        setIsSideBarOpen(!isSideBarOpen);
    };
    const handleClickOutside=(e)=>{
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
            setIsSideBarOpen(false);
        }
    }
    useEffect(()=>{
        document.addEventListener("mousedown",handleClickOutside);
        return()=>{
             document.removeEventListener("mousedown",handleClickOutside); 
        }
       
    },[])
  return (
    <div className='flex flex-col lg:flex-row'>
        {/*mobile filter buttn */}
        <button onClick={toggleSideBar} className='lg:hidden border p-2 flex justify-center items-center'>
            <FaFilter className='mr-2'/>Filters
        </button>
        {/*filter sidebar */}
        <div ref={sidebarRef} className={`${isSideBarOpen?"translate-x-0":"-translate-x-full"} 
        fixed z-50 inset-y-0 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
            <FilterSidebar/>
        </div>
        <div className="grow  p-4">
            <h2 className='text-2xl uppercase mb-4'> All  collection</h2>
            {/*sort options */}
            <SortOptions/>
            {/*product grid */}
            <ProductGrid products={products} loading={loading} error={error}/>
        </div>
    </div>
  )
}

export default CollectionPages
