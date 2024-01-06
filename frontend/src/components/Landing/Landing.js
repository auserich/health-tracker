import React, {useEffect} from "react";
import "./Landing.css"
import scale from './scale.png'

const Landing = () => {

  useEffect( () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
  });


  return (
    <div className="landing-container">

      <div className="text-container">
        <h1>[PH] Health Tracker</h1>
      </div>

      <div className="landing-buttons">
        <a href="http://localhost:3000/signup"><button>Signup</button></a>
        <a href="http://localhost:3000/login"><button style={{marginLeft:'150px'}}>Login</button></a>
      </div>

      <div className='image-container'>
        <img src={scale} alt = "scale"/>
      </div>

    </div>
    
  )
}

export default Landing
