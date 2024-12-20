import  { useState } from "react";
import pusheen from '../assets/pusheen.png'
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notice, setNotice] = useState("");

    const signupWithUsernameAndPassword = async (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                navigate("/profile");
            } catch (error){
                setNotice(error.message.replace("Firebase:",""));
                
            }     
        } else {
            setNotice("Passwords don't match. Please try again.");
        }
    };

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
                        <input id = "signupEmail" type = "email" className = "form-control" aria-describedby = "emailHelp" placeholder = "name@catmail.com" value = { email } onChange = { (e) => setEmail(e.target.value) }></input>
                        <label htmlFor = "signupEmail" className = "form-label">Enter email address&#40; eg&#58;xxx&#64;catmail&#46;com &#41;
  </label>
                    </div>
                    <div className = "form-floating mb-3">
                        <input id = "signupPassword" type = "password" className = "form-control" placeholder = "Password" value = { password } onChange = { (e) => setPassword(e.target.value) }></input>
                        <label htmlFor = "signupPassword" className = "form-label">Password</label>
                    </div>
                    <div className = "form-floating mb-3">
                        <input id = "confirmPassword" type = "password" className = "form-control" placeholder = "Confirm Password" value = { confirmPassword } onChange = { (e) => setConfirmPassword(e.target.value) }></input>
                        <label htmlFor = "confirmPassword" className = "form-label">Confirm Password</label>
                    </div>                    
                    <div className = "d-grid">
                        <button type = "submit" id="login-button" className = "button-19" onClick = {(e) => signupWithUsernameAndPassword(e)}>Signup</button>
                    </div>
                    <div className = "mt-3 text-center">
                        <span>Go back to login? <Link to = "/login">Click here.</Link></span>
                    </div>                    
                </form>
            </div>
        </div>
    )
}

export default Signup