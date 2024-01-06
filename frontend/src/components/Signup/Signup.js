import React, {useState} from 'react'
import "./Signup.css"


const Signup = () => {

  const [email,setEmail] = useState("");
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {

    const requestObject =
    {
      "username": username,
      "password": password,
      "role": "ROLE_USER",
      "enabled": true,
      "email": email
    }

    try {
      const response = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestObject),
      });

      if (response.ok) {
        setSuccessMessage("Sign up successful. You can now log in.");
        setErrorMessage("");
      } else {
        setSuccessMessage("");
        setErrorMessage("Sign up failed. Please check your information.");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("An error occurred. Please try again later.");
    }

  }

  return (
    <div className="signup-container">

      <div className="signup-body" style={{marginBottom:'5vh',marginTop:'5vh',border: '5px solid black',backgroundColor:'rgba(0,20,0,0.6)'}}>

        <h1>Create an Account</h1>

        <div className="labelbox" style={{marginTop:'5vh'}}>
          <label htmlFor="email" >Email</label><br/>
          <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div className="labelbox" style={{marginTop:'5vh'}}>
          <label htmlFor="username">Username</label><br/>
          <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div className="labelbox" style={{marginTop:'5vh'}}>
          <label htmlFor="password" >Password</label><br/>
          <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
        </div>
       
        <div className="buttonsection">
          <button onClick={handleSubmit}>Sign Up</button>
          <a href="http://localhost:3000/"><button> Back to Home</button></a>  
        </div> 

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      </div>

    </div>
  )
}

export default Signup
