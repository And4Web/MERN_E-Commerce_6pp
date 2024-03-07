import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc';

function Login() {
  const [gender, setGender] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  return (
    <div className='login'>
      <main>
        <h1 className='heading'>Login</h1>
        <div>
          <label>Gender</label>
            <select name="gender" >
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
          <button><FcGoogle/><span>Sign in with Google</span></button>
        </div>
      </main>
    </div>
  )
}

export default Login