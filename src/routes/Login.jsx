import { useState } from "react";
import pusheen from '../assets/pusheen.png';
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notice, setNotice] = useState("");

    const loginWithUsernameAndPassword = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/profile");
        } catch {
            setNotice("You entered a wrong username or password.");
        }
    }

    return(
        <div className = "container">
            <header className="App-header">
                <h1>Catpedia</h1> <img className="App-logo"src={pusheen} alt=''/>
            </header>
            <div className = "row justify-content-center">
                <form className = "col-md-4 mt-3 pt-3 pb-3">
                    { "" !== notice &&
                        <div className = "alert alert-warning" role = "alert">
                            { notice }    
                        </div>
                    }                  
                    <div className = "form-floating mb-3">
                        <input type = "email" className = "form-control" id = "exampleInputEmail1" aria-describedby = "emailHelp" placeholder = "name@catmail.com" value = { email } onChange = { (e) => setEmail(e.target.value) }></input>
                        <label htmlFor = "exampleInputEmail1" className = "form-label">Email address</label>
                    </div>
                    <div className = "form-floating mb-3">
                        <input type = "password" className = "form-control" id = "exampleInputPassword1" placeholder = "Password" value = { password } onChange = { (e) => setPassword(e.target.value) }></input>
                        <label htmlFor = "exampleInputPassword1" className = "form-label">Password</label>
                    </div>
                    <div className = "d-grid">
                        <button type = "submit" id="login-button" className = "button-19" onClick = {(e) => loginWithUsernameAndPassword(e)}>Submit</button>
                    </div>
                    <div className = "mt-3 text-center">
                        <span >Need to sign up for an account? <Link to = "/signup">Click here.</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login