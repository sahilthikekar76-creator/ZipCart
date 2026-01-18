import React, { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useRef } from "react";
import axios from 'axios';
const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [newArrivals,setNewArrivals]=useState([]);
    useEffect(()=>{
        const fetchNewArrivals=async()=>{
            try {
               const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`) ;
               setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewArrivals();
    },[]);
    const tolerance = 2;
    const updateScrollButtons = () => {
        const el = scrollRef.current;//scrolling container element
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > tolerance);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth-tolerance);
    };

    const scrollLeftHandler = () => {
        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRightHandler = () => {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    useEffect(() => {
        updateScrollButtons(); // initial check

        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener("scroll", updateScrollButtons);//add listner
        return () => el.removeEventListener("scroll", updateScrollButtons);
        /*Cleanup is code that runs when the effect is about to be destroyed

        In simple words:
            React runs your effect
            Later, React cleans it up to avoid problems*/
    }, [newArrivals]);

    
    
  return (
    <section className='container mx-auto px-4 mb-10 relative'>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-center">
                 Explore New Arrivals
            </h2>

            <div className="flex space-x-2">
  <button
    onClick={scrollLeftHandler}
    disabled={!canScrollLeft}
    className={`p-2 rounded border transition
      ${canScrollLeft
        ? "bg-white text-black hover:bg-gray-100"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
  >
    <FiChevronLeft className="text-2xl" />
  </button>

  <button
    onClick={scrollRightHandler}
    disabled={!canScrollRight}
    className={`p-2 rounded border transition
      ${canScrollRight
        ? "bg-white text-black hover:bg-gray-100"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
  >
    <FiChevronRight className="text-2xl" />
  </button>
</div>

        </div>
        <p className='text-lg text-gray-600 mb-8'>
            Discover the latest styles straight off  the runway, freshly added to 
            keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* scrollable content */}
        <div  ref={scrollRef} className='container mx-auto overflow-x-auto scroll-smooth flex space-x-6 relative px-2'>
        {newArrivals.map((product)=>(
            <div key={product._id} className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative' >
                <img src={product.images[0]?.url} alt={product.images[0]?.altText || product.name} className='w-full h-[500px] object-cover rounded '></img>
                <div className='absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-lg '>
                    <Link to={`/product/${product._id}`} className="block">
                    <h4 className='font-medium'>{product.name}</h4>
                    <p className='mt-1'>${product.price}</p></Link>
                </div>
            </div>
        ))}
        </div>
    </section>
  )
}

export default NewArrivals
