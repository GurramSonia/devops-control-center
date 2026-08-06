import { Link } from "react-router-dom";
function SideBar(){
    return(
        <><h4>SideBar component</h4>
        <Link to="/dashboard">Dashboard
        </Link>
        <p></p>
        <Link to="/pods">Pods
        </Link>
        <p></p>
        <Link to="/settings">Settings| 
        </Link>
        <p></p>
        <Link to="/deployments">Deployments| 
        </Link></>
    );
}
export default SideBar;