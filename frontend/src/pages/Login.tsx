import React, { useState } from 'react'
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../firebase';

function Login() {
  const [gender, setGender] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const {user} = await signInWithPopup(auth, provider);

      console.log({user})      
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