import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Link , useNavigate} from 'react-router-dom';
const Header = () => {
  const [searchTerm,setSearchTerm]=useState('');
  const {currentUser}=useSelector(state=>state.user);
  const navigate=useNavigate();
  const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams=new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search]);
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto'>
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-lg flex flex-wrap p-3'>
            <span className='text-slate-500'>Priyan</span>
            <span className='text-slate-700'>State</span>
        </h1>
        </Link>
        <form onSubmit={handleSubmit}  className='bg-slate-100 p-2 rounded-lg flex items-center'>
            <input type="text" placeholder='search....' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e)=>{
              setSearchTerm(e.target.value)
            }}/>
            <button>
            <FaSearch className='text-slate-600'/>
            </button>
            
        </form>
        <ul className='flex gap-4'>
            <Link to="/">
            <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>Home</li>
            </Link>
            <Link to="/about">
            <li className='hidden sm:inline  text-slate-700 hover:underline cursor-pointer'>About</li>
            </Link>

            <Link to="/profile">
            {currentUser ? (<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} />) :(
            <li className=' text-slate-700 hover:underline cursor-pointer'>Sign In</li>
)}
            </Link>
        </ul>
        </div>
    </header>
  )
}

export default Header