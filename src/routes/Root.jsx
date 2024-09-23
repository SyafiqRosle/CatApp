// import './App.css';
import {ScrollRestoration,Outlet,Link,useLoaderData,Form} from "react-router-dom"
import pusheen from '../assets/pusheen.png'
import { useState,useEffect} from 'react';

function Root() {
  const [gridImages, addtoGridImages]  = useState([]);
  const [query,setQuery] = useState("")
  useEffect(()=>{
    getImages();
  },[])
  

//search click
const handleClick = async() => {
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
const getImages = async()=>{ 
    const limit = 20
    const response =
     await(await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=true&api_key=${process.env.REACT_APP_API_KEY}`)).json()   
  addtoGridImages(response);
}


;
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
            {/* {console.log(query)} */}
            <Link to={'/'}  style={{ textDecoration: 'inherit' ,color:'inherit'}}>
            <button className="button-19" onClick={handleClick}><i class="fa-solid fa-magnifying-glass"></i></button>
            </Link>
          </div>
     
     
      </header>

      
      <div id="body-container">
      <div id="preview-container">
        <ScrollRestoration/>
            <Outlet/>                 
      </div>
        
      <div id="grid">
        {gridImages.map((cat,i)=> 
        <div className="col" key={i}>
          
          <Link to={`cats/${cat.id}`}  style={{ textDecoration: 'inherit' ,color:'inherit'}}>
                          <img
                            
                            key={i}
                            className="cat"
                            src={cat.url}
                            alt=''/>
                          <div className="cat-text">
                            <p>{cat.breeds[0].name}</p>
                         
                          </div>
          </Link>
        </div>)}
      </div>
      </div>
    </div>
  );
}

export default Root;
