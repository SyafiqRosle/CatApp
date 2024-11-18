import { useNavigate } from "react-router-dom";
import { useState,useEffect,useCallback} from 'react';
import { auth} from "../firebase";
import { signOut ,onAuthStateChanged} from "firebase/auth";
import pusheen from '../assets/pusheen.png'

const CatGifPage = () => {
    const [page,setPage] = useState(1);
    const [loading,setLoading] = useState(false);
    const [isLoggedIn,setLoginStatus] = useState(false);
    const [catGifs, setCatGifs] = useState([]);
    const navigate = useNavigate();

    const logoutUser = async (e) => {
        e.preventDefault();
        setLoginStatus(false);
        await signOut(auth);
        navigate("/");
      }

    const getGifs = async(page,limit)=>{ 
        const response =
         await(await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&mime_types=gif&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)).json()   
        return response;
    }

    const loadMoreGifs = useCallback(async ()=>{
        setLoading(true);
        const newImages = await getGifs(page,10);
        setCatGifs((prevImages)=>[...prevImages,...newImages])
        setLoading(false);
        },[page]);
    
        //infinite scroll
    const onscroll = () => {
        const scrolledTo = window.scrollY + window.innerHeight
        const isReachBottom = (document.body.scrollHeight-1) <= Math.round(scrolledTo)
        if (isReachBottom) {
            setPage((prevPage)=>prevPage+1);// Trigger loading of new posts by changing page number 
        } 
        return () => {
        window.removeEventListener("scroll", onscroll);
  };
};

        
    useEffect(()=>{    
        loadMoreGifs();
        console.log('page='+page);
        console.log(catGifs);
        window.addEventListener("scroll", onscroll);
       const unsubscribe = onAuthStateChanged(auth,(user)=>{
                if (user){
                  setLoginStatus(true);
                  console.log("is logged in");
                  
                }else{
                  setLoginStatus(false);
                  console.log("not signed in")
              }})
              return unsubscribe;
    },[loadMoreGifs]);

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
              {!isLoggedIn && <li onClick={e=>navigate("/login")}>Login</li>}
                {!isLoggedIn && <li onClick={e=>navigate("/signup")}>Sign Up</li>}
                {isLoggedIn && <li onClick={e=>navigate("/profile")}>Profile</li>}
                {isLoggedIn && <li onClick={e=>logoutUser(e)}>Sign Out</li>}
              </ul>
            </details>
            </header>

         
            
            <div className = "row">
                <h2 className="poppins">Cat GIFs</h2>
                <div id = "gif-grid">
                {catGifs.map((gif,i)=>
                  <div className="col cat-gif" key={i} >
                                        <img key={i} className="cat" src={gif.url} alt=""/>
                                       
                  </div>)}
                  {loading && <p>Loading...</p>} 
                </div>  
            </div>
        </div>       
    )    
}

export default CatGifPage