
import {useNavigate,useLocation} from "react-router-dom"
import {signOut} from "firebase/auth";
import { auth } from "../firebase";


function Menu({isLoggedIn}){
    const navigate = useNavigate();
    let location = useLocation();
    console.log(location)
    const logoutUser = async (e) => {
        e.preventDefault();
        //setLoginStatus(false);
        await signOut(auth);
        navigate("/");
      }

    return(
        <details>
              <summary>
                <i id="profile-icon" className="fa-regular fa-user"></i>
              </summary>
              <ul>
                {location.pathname!="/" && <li onClick={e=>navigate("/")}>Home</li>}
                {!isLoggedIn && <li onClick={e=>navigate("/login")}>Login</li>}
                {!isLoggedIn && <li onClick={e=>navigate("/signup")}>Sign Up</li>}
                {!location.pathname.includes("/catgif") && <li onClick={e=>navigate("/catgif")}>Cat GIFs</li>}
                {isLoggedIn && !location.pathname.includes("/profile") &&<li onClick={e=>navigate("/profile")}>Profile</li>}
                {isLoggedIn && <li onClick={e=>logoutUser(e)}>Sign Out</li>}
              </ul>
            </details>
    );
}

export default Menu;