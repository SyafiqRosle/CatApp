// import './App.css';
import {useNavigate,ScrollRestoration,Outlet} from "react-router-dom"
import pusheen from '../assets/pusheen.png'
import { useState,useEffect,useRef,useCallback} from 'react';
import {signOut,onAuthStateChanged} from "firebase/auth";
import { auth } from "../firebase";
import Grid from './Grid';

function Root() {
  const [gridImages, addtoGridImages]  = useState([]);
  const [query,setQuery] = useState("");
  const [page,setPage] = useState(1);
  const [isLoggedIn,setLoginStatus] = useState(false);
  const [loading,setLoading] = useState(false);
  const [searchMode,setSearchMode] = useState(false);
  const heightRef = useRef();
const navigate = useNavigate();

const logoutUser = async (e) => {
  e.preventDefault();
  setLoginStatus(false);
  await signOut(auth);
  navigate("/");
}

const searchClick = async() => {
  window.removeEventListener("scroll", onscroll);
  setSearchMode(true);
  //clear grid
  if (query.length==0) return;
  addtoGridImages([]);
  try{
    const data = await((await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${query}&attach_image=1`))).json()
    const imageIdArray = data.map(x=>{
      return {
              id: x.reference_image_id,
              url:`https://cdn2.thecatapi.com/images/${x.reference_image_id}.jpg`,
              breeds:[x] 
      }
    })
    addtoGridImages(imageIdArray);

  }catch(err){
    console.log(err.message)
  }
}

//root grid
const getImages = async(page,limit)=>{ 
    const response =
     await(await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=true&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)).json()   
    return response;
     // addtoGridImages(response);
}

const loadMoreImages = useCallback(async ()=>{
setLoading(true);
const newImages = await getImages(page,10);
// if (newImages.length==0){
//   console.log("no more")
//   setHasMore(false);
// }else{
  addtoGridImages((prevImages)=>[...prevImages,...newImages])
// }

setLoading(false);
},[page]);

//infinite scroll
const onscroll = () => {
    const scrolledTo = window.scrollY + window.innerHeight
    setScrolledTo(scrolledTo);
   console.log("Scrolled to:"+scrolledTo +"  scrollHeight:"+document.body.scrollHeight)
   
  const isReachBottom = (document.body.scrollHeight-1) <= Math.round(scrolledTo)
  if (isReachBottom) {
    setPage((prevPage)=>prevPage+1);// Trigger loading of new posts by changing page number 
  } 
  return () => {
    window.removeEventListener("scroll", onscroll);
  };
};

useEffect(()=>{
  
  if(searchMode===false){
    loadMoreImages();
    console.log('page='+page);
    console.log(gridImages);
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
  }
},[loadMoreImages]);


  return (
    <div className="App">
      <header className="App-header">
      {/* <button className="button-19" onClick={event=>{setSearchMode(false)}}>←</button> */}
      <h1>Catpedia</h1>
      
      <img
        className="App-logo"
          src={pusheen}
          alt=''/>
          <div id="search-container">
            <input type="text" name="" id="search-input" placeholder="Search cat"
            onChange={event=>setQuery(event.target.value)} />
            <button className="button-19" onClick={searchClick}><i class="fa-solid fa-magnifying-glass"></i></button>
            
          </div>
     
          <details>
              <summary>
                <i id="profile-icon" className="fa-regular fa-user"></i>
              </summary>
              <ul>
                {!isLoggedIn && <li onClick={e=>navigate("/login")}>Login</li>}
                {!isLoggedIn && <li onClick={e=>navigate("/signup")}>Sign Up</li>}
                {isLoggedIn && <li onClick={e=>navigate("/profile")}>Profile</li>}
                {isLoggedIn && <li onClick={e=>logoutUser(e)}>Sign Out</li>}
              </ul>
            </details>
      </header>   
      <div id="body-container">
      <div id="preview-container">
        <ScrollRestoration/>
            <Outlet/>                 
      </div>
        <Grid gridImages={gridImages}
              heightRef={heightRef}
              loading={loading}/>
  
      <code>Scroll down for more cat images!</code>
      <div id="footer">Footer</div> 
      </div>
      
    </div>
  );
}

export default Root;
