//import reactLogo from '../assets/react.svg'
import { useState } from 'react';
import reactLogo from '../../assets/react.svg'
function Login(){
    const [email, setEmail] = useState("");      
    const [password, setPassword] = useState("");           
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    }
    return(
        
    
        <div className="login-container">
          <h1>Welcome to the Login Page</h1>
          <img src={reactLogo} className="framework" alt="React logo" />
          <div className="form-group">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />         
            <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                {/* <button onSubmit={(e) => e.preventDefault()}>Login</button> */}
            <a href="/forgot-password">Forgot your password?</a>
                </form>
            </div>
            
        </div>
    );
}
export default Login;