import React,{useState} from 'react'
import { useHistory } from 'react-router-dom'

const Login = () => {

    const [credentials, setCredentials] = useState({email:"", password:""})
    let history = useHistory();

    const handleDemo = async(e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({email:"random@gmail.com", password:"123456"})
          });

          const json = await response.json()
          console.log(json)
          //after login redirecting to notes
          if (json.success) {
             localStorage.setItem("auth-token", json.authToken);
             history.push("/")
          }
          else{
              alert("Invalid credentials")
          }
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({email:credentials.email, password:credentials.password})
          });
        
         const json = await response.json()
         console.log(json)
         //after login redirecting to notes
         if (json.success) {
            localStorage.setItem("auth-token", json.authToken);
            history.push("/")
         }
         else{
             alert("Invalid credentials")
         }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='container my-3'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" value={credentials.email} onChange={onChange} className="form-control" id="email" name='email' aria-describedby="emailHelp"/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" value={credentials.password} onChange={onChange} className="form-control" id="password" name='password'/>
                </div>
                <button type="submit" className="btn btn-primary mx-2">Submit</button>
                <button onClick={handleDemo} className="btn btn-primary mx-2">Demo Login</button>
            </form>
        </div>
    )
}

export default Login
