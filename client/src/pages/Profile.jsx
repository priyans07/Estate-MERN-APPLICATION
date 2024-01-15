import React, { useState ,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import {Link} from 'react-router-dom'
import { updateUserStart,updateUserFailure,updateUserSuccess ,deleteUserFailure,deleteUserStart,deleteUserSuccess,SignOutUserStart,SignOutUserSuccess,SignOutUserFailure} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
const Profile = () => {
  const dispatch=useDispatch();
  const {currentUser,loading,error} = useSelector((state)=>state.user)
  const fileRef=useRef(null)
  const [file,setFile]=useState(undefined)
  const [filePerc,setFilePerc]=useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const [formdata,setFormData]=useState({});
  const [u,setu]=useState(false);
  const [showListingeError,setShowListingError]=useState(false);
  const [userListing,setUserListing]=useState([]);
  console.log(formdata);
  // console.log(filePerc);
  // console.log(fileUploadError);
  useEffect(()=>{
    if(file){
      handlefileupload(file);
    }
  },[file]);
  const handlefileupload=(file)=>{
const storage=getStorage(app)
const fileName=new Date().getTime+ file.name;
const storageRef=ref(storage,fileName);
const uploadTask=uploadBytesResumable(storageRef,file);

uploadTask.on('state_changed',
(snapshot)=>{
  const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;

  setFilePerc(Math.round(progress));
},

(error)=>{
  setFileUploadError(true);
},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then
  ((downloadURL)=>
  {
    setFormData({...formdata,avatar:downloadURL});
  }
  )
}
)
  };
  const handlechange=(e)=>{
    setFormData({...formdata,[e.target.id] : e.target.value});
  }
  const handlesubmit= async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(formdata),
      });
      const data=await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message));;
        return ;
      }
      dispatch(updateUserSuccess(data));
      setu(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }
  const handleDeleteUser=async ()=>{
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data=await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignOut=async()=>{
    try {
      dispatch(SignOutUserStart());
      const res=await fetch('/api/auth/signout');
      const data=await res.json();
      if(data.success==false){
        dispatch(SignOutUserFailure(data.message));
        return ;
      }
      dispatch(SignOutUserSuccess(data));
    } catch (error) {
      dispatch(SignOutUserFailure(data.message));
    }
  }
  const handleShowListing= async()=>{
try {
  setShowListingError(false);
  const res=await fetch(`api/user/listings/${currentUser._id}`);
  const data=await res.json();
  if(data.success===false){
    setShowListingError(true);
    return;
  }
setUserListing(data);
} catch (error) {
  setShowListingError(true);
}
  }
  const handleListingDelete=async(listingId)=>{
    try{
const res=await fetch(`/api/listing/delete/${listingId}`,{
  method:'DELETE',
});
const data=await res.json();
if(data.success===false){
  console.log(data.message);
  return ;
}
setUserListing((prev)=>prev.filter((listing)=>listing._id !==listingId));
    }
    catch(error){
      console.log(error.message);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handlesubmit} className='flex flex-col gap-4'>
        <input  onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' name="" id="" />
        <img onClick={()=>fileRef.current.click()} src={formdata.avatar ||currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'/>
        <p className='text-sm self-center'>
        {fileUploadError ?
        ( <span className='text-red-700 '>Error Image Upload(image must be less than 2mb)</span>) :
         filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`} </span> ) : filePerc===100 ? (<span className='text-green-700'>Image Successfully uploaded!</span>) : ('')
        }
        </p>
        <input onChange={handlechange} defaultValue={currentUser.username} type="text" placeholder='Username' className='border p-3 rounded-lg ' id='username'/>
        <input type="email" onChange={handlechange} defaultValue={currentUser.email} placeholder='email' className='border p-3 rounded-lg ' id='email'/> 
        <input type="text" onChange={handlechange} placeholder='password' className='border p-3 rounded-lg ' id='password'/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading' : "Update"}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
    <p className='text-red-700 mt-3'>{error ? error : ' '}</p>
    <p className='text-green-700 mt-5'>{ u ? "User Updated Successfully" : ' ' }</p>
    <button onClick={handleShowListing} className='text-green-700 w-full'>Show Listings</button>
    <p className='text-red-700 mt-5'>{showListingeError ? 'Error show Listing' : ''}</p>
    {userListing && userListing.length > 0 && 
    <div className='flex flex-col gap-4'>
      <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listing</h1>
        { userListing.map((listing)=>(
      <div key={listing._id} className='border rounded-lg p-3  flex justify-between items-center gap-4'>
        <Link to={`/listing/${listing._id}`}>
          <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain'/>
        </Link>
        <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
          <p>{listing.name}</p>
        </Link>
        <div className='flex flex-col'>
        <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>  
        <button className='text-green-700 uppercase'>
          <Link to={`/update-listing/${listing._id}`}>
          Edit
          </Link>
          </button>  
        </div>
      </div>
    ))}
      </div>

 
    }
      </div>
  )
}

export default Profile