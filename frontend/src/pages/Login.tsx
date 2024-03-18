import React, { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../firebase';
import { useLoginMutation, userAPI } from '../redux/api/userAPI';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query/react';
import { MessageResponse } from '../types/api-types';


function Login() {
  const [gender, setGender] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const {user} = await signInWithPopup(auth, provider);

      console.log({user})  
      console.log("userAPI >>> ", userAPI)
      
      const res = await login({
        name: "anand",
        email: "anand@gamil.com",
        photo: "aksdjflk",
        gender, 
        role: "user",
        dob: birthdate,
        _id: "skldfj"
      })

      console.log('response >>> ', res);

      if("data" in res){
        toast.success(res.data.message);
      }else{
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        console.log("message >>> ", message);
      }


    } catch (error) {
      console.log("login error: ", error);
      toast.error("Sign in failed. Try again");
    }
  }
  
  return (
    <div className='login'>
      <main>
        <h1 className='heading'>Login</h1>
        <div>
          <label>Gender</label>
            <select name="gender" value={gender} onChange={e=>setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
        </div>
        <div>
          <label>
            Date of Birth
          </label>
          <input type="date" value={birthdate} onChange={(e)=>setBirthdate(e.target.value)}/>
        </div>

        <div>
          <p>Already Signed in once!</p>
          <button onClick={loginHandler}><FcGoogle/><span>Sign in with Google</span></button>
        </div>
      </main>
    </div>
  )
}

export default Login