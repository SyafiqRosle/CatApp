// import './App.css';
import {useNavigate,useLocation,ScrollRestoration,Outlet} from "react-router-dom"
import pusheen from '../assets/pusheen.png'
import { useState,useEffect,useRef,useCallback} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../firebase";
import Grid from './Grid';
import Menu from './Menu';

function Root() {
  const [gridImages, addtoGridImages]  = useState([]);
  const [query,setQuery] = useState("");
  const [page,setPage] = useState(1);
  const [isLoggedIn,setLoginStatus] = useState(false);
  const [loading,setLoading] = useState(false);
  const heightRef = useRef();
  const navigate = useNavigate();
  let location = useLocation();


const searchClick = async() => {
  window.removeEventListener("scroll", onscroll);
  //clear grid
  if (query.length==0) return;
  //remove infinite scroll on search click
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
  navigate('/search')
}

//root grid
const getImages = async(page,limit)=>{ 
    const response =
     await(await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=true&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)).json()   
    return response;
}

const loadMoreImages = useCallback(async ()=>{
setLoading(true);
const newImages = await getImages(page,10);
  addtoGridImages((prevImages)=>[...prevImages,...newImages])
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
  //disable infinite scroll on search page,but renenable on preview mode
  if(!location.pathname.endsWith("/search")){
    loadMoreImages();
    console.log('page='+page);
    console.log(gridImages);
    window.addEventListener("scroll", onscroll);
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      if (user){
        setLoginStatus(true);
        
      }else{
        setLoginStatus(false);
    }})
    return unsubscribe;
  }
},[loadMoreImages]);


  return (
    <div className="App">
      <header className="App-header">
      <h1>Catpedia</h1>
      
      <img
        className="App-logo"
          src={pusheen}
          alt=''/>
          <div id="search-container">
            <input type="text" name="" id="search-input" placeholder="Search cat"
            onChange={event=>setQuery(event.target.value)} />
            <button className="button-19" onClick={searchClick}><i className="fa-solid fa-magnifying-glass"></i></button>
            
          </div>
          <Menu isLoggedIn={isLoggedIn}/>
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
      </div>
    </div>
  );
}

export default Root;
