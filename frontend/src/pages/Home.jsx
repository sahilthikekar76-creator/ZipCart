import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollection from '../components/Products/GenderCollection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import Featuredsection from '../components/Products/Featuredsection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilter } from '../redux/slices/productSlice'
import axios from 'axios';
const Home = () => {
    const dispatch=useDispatch();
    const {products,loading,error}=useSelector((state)=>state.products);
    const[bestSellerProduct,setBestSellerProduct]=useState(null);
    useEffect(()=>{
        //fetch products for a specific collection
        dispatch(fetchProductsByFilter({
            gender:"Women",
            category:"Bottom Wear",
            limit:8,
        })
        );
    //fetch best seller products
    const fetchBestSeller=async()=>{
        try {
            const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
            setBestSellerProduct(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    fetchBestSeller();
    },[dispatch]);
  return (
    <div>
      <Hero/>
      <GenderCollection/>
      <NewArrivals/>
      {/*best seller section */}
      <h2 className='text-3xl text-center font-bold mb-4'>
        Best Seller
      </h2>
      {bestSellerProduct?(<ProductDetails productId={bestSellerProduct._id}/>):(
        <p className='text-center'>Loading best seller product...</p>
      )}
      <div className='mx-auto max-w-7xl px-4'>
        <h2 className='text-3xl text-center font-bold mb-4'>
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
      <FeaturedCollection/>
      <Featuredsection/>
    </div>
  )
}

export default Home
