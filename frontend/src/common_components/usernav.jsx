import logo from '../assets/PS-logo.png';
import '../css/navbar.css';

function UserNav(){
    return(
        <>
        <div className="navbar">
            <img src={logo} alt="Product-Store Logo" className="logo"/>
        </div>
    </> 
    );
}

export default UserNav;