import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth,db } from "../firebase";
import {doc,getDoc} from "firebase/firestore"
// import {getFavCats} from '../cats';
import { signOut ,onAuthStateChanged} from "firebase/auth";
import pusheen from '../assets/pusheen.png'

const Profile = () => {
    const [catUser,setCatUser] = useState({});
    const [favCatImg, setFavCatImgs] = useState([]);
    const navigate = useNavigate();
   

  const getFavCats = async(user)=>{
      try{
        if(user){
          const docSnap = await getDoc(doc(db,'/favcat',user.email))
            setFavCatImgs([...docSnap.data().img]);     
        }
      }catch(e){
          console.error("error getting document:",e)
      } 
  }    

    const logoutUser = async (e) => {
        e.preventDefault();

        await signOut(auth);
        navigate("/");
    }

    useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth,(user)=>{
        if (user){
          setCatUser(user);
          console.log(user.email);
          getFavCats(user);
          console.log(favCatImg);
        }else{
          console.log("not signed in")
      }})
      return unsubscribe;
    },[])
    return(
        <div className = "container">
            <header className="App-header">
      
            <h1>Catpedia</h1>
      
            <img
                className="App-logo"
                src={pusheen}
                alt=''/>
            <details>
              <summary>
                <i id="profile-icon" className="fa-regular fa-user"></i>
              </summary>
              <ul>
                <li onClick={e=>navigate("/")}>Home</li>
                <li onClick={e=>logoutUser(e)}>Sign Out</li>
              </ul>
            </details>
            </header>

            <div className = "row justify-content-center">
                <div className = "col-md-4 text-center">
                            <h2>Your Profile</h2>
                           <img src={`https://robohash.org/${catUser.uid}?set=set4`} alt="" />
                           <p>{ catUser.email }</p>
                </div>
            </div>
            
            <div className = "row">
                <h2 className="poppins">Your Favourites</h2>
                <div id = "grid">
                {favCatImg.map((favImg,i)=>
                  <div className="col" key={i} >
                                        <img key={i} className="cat" src={`https://cdn2.thecatapi.com/images/${favImg}.jpg`} alt=""/>
                                        {/* <div className="cat-text"><p>Cat</p></div> */}
                  </div>)}
                </div>   
            </div>
                 
        </div>       
    )    
}

export default Profile