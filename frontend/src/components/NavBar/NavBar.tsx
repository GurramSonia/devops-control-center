import { Link } from "react-router-dom";

function NavBar(){
    return(
        <>
        <h1>DevOps Control Center </h1>
        <img src="../../assets/sonia.jpg" className="framework" alt="React logo" />
        <Link to="/">Login| </Link>
    
    </>
    );
} 
export default NavBar;