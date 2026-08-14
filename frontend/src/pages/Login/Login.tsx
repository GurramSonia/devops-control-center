//import reactLogo from '../assets/react.svg'
import { useState } from 'react';
import { loginUser } from "../../services/authService";
import {useNavigate} from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

function Login(){
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");      
    const [password, setPassword] = useState(""); 
     const [successMessage, setSuccessMessage] = useState("");
     const { login } = useAuth();


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await loginUser(email, password);

      // if (data?.token) {
      //   localStorage.setItem("token", data.token);
      // }
      if (data.token) {
      login(data.token);
      }

      setSuccessMessage("Login successful!  Redirecting to dashboard...");
      console.log("Login successful:", data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong during login.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }
    return(
        
    
        <div className="login-container">
          <h1>Welcome to the Login Page</h1>
          
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
                 {error && (
            <p role="alert" style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}
          {successMessage && (
            <p role="alert" style={{ color: "green", marginTop: "10px" }}>
              {successMessage}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          
            <a href="/forgot-password">Forgot your password?</a>
                </form>
            </div>
            
        </div>
    );
}
export default Login;