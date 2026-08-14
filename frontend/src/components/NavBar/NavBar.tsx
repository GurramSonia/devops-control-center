import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function NavBar(){
    const { logout } = useAuth();
    return(
        <>
        <h1>DevOps Control Center </h1>
        <img src="../../assets/sonia.jpg" className="framework" alt="React logo" />
        <Link to="/">Login| </Link>
        <button onClick={logout}>
                Logout
        </button>
    
    </>
    );
} 
export default NavBar;