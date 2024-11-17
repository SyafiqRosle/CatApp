
import {useLoaderData} from "react-router-dom";
import {getCat} from '../cats'
import { useEffect, useState } from "react";
import { auth ,db} from "../firebase";
import { onAuthStateChanged} from "firebase/auth";
import {doc,setDoc,getDoc,arrayUnion,arrayRemove,updateDoc} from "firebase/firestore"
import "/node_modules/flag-icons/css/flag-icons.min.css";

export async function loader({params}){
    
    const cat = await getCat(params.catId);
    return {cat};
}


const Preview=()=>{
    const [isFavourite,setFavourite]= useState(false);
    const [isFavAlertVisible,setFavAlertVisible] = useState(false);
    const [isShowMorePopupVisible,setShowMorePopupVisible] = useState(false);
    const {cat} = useLoaderData();
    const [currentUser, setCurrentUser] = useState({});

    useEffect(()=>{
      //initially undisplay favourite every transition
      setFavourite(false);
      console.log("cat id:"+cat.id+"   isFavourite?:" + isFavourite)
      const unsubscribe = onAuthStateChanged(auth,(user)=>{
        if (user){
          setCurrentUser(user);
          getFav(user);
          console.log(user.email);
        }else{
          console.log("not signed in")
      }})
      return unsubscribe;
    },[cat.id]);
    
    const getFav = async(user)=>{
      try{
        if(user){
          console.log("Getting favs...")
          const docSnap = await getDoc(doc(db,'/favcat',user.email))
          if(docSnap.exists){
            const favImgArray = docSnap.data().img
            console.log("got:",favImgArray)
            if(favImgArray.includes(cat.id)){
              setFavourite(true);
            }
          }else{
            console.log("not fav")
          }  
        }
        }catch(e){
          console.error("error getting document:",e)
        } 
    }    
    

    const addFav = async(e)=>{
      e.preventDefault();
      try{
        if(currentUser){
          console.log("current email",currentUser.email)
          const docSnap = await getDoc(doc(db,'/favcat',currentUser.email))
          if(docSnap.exists){
            const docUpdate = await updateDoc(doc(db,'/favcat',currentUser.email),{img: arrayUnion(cat.id)})
            console.log("updated:",docUpdate)
          }else{
            const docRef = await setDoc(doc(db,'/favcat',currentUser.email),{img: arrayUnion(cat.id)})
            console.log("added:",docRef)
          }     
        }
        }catch(e){
          console.error("error adding document:",e)
        } 
    }    

    const removeFav=async(e)=>{
      e.preventDefault();
      try{
        if(currentUser){
            const docUpdate = await updateDoc(doc(db,'/favcat',currentUser.email),{img: arrayRemove(cat.id)})
            console.log("removed:",docUpdate)}
      }catch(e){
          console.error("error removing document:",e)
      } 
    }    
    const showMoreClick = (e)=>{
      setShowMorePopupVisible(!isShowMorePopupVisible)
    }
    const PreviewContent =()=>{
      if (isShowMorePopupVisible){
        return(
          <div id="preview-right">          
              <div id="preview-right-header">
                <h2>{cat.breeds[0].name}</h2>
                <div className="icons">
                  <i className={`${favIconClass} fa-star star-icon`} onClick={favClick}> </i>
                  <i className="menu-icon fa-solid fa-bars" onClick={showMoreClick}></i> 
                </div>
              </div>        
              <h5>{cat.breeds[0].temperament}</h5>
              <p className="origin">{`Origin: ${cat.breeds[0].origin}`} <span className={`fi fi-${cat.breeds[0].country_code.toLowerCase()}`}></span> </p>
              <p>{`Lifespan: ${cat.breeds[0].life_span} years`}</p>
              <div className="stat-container">
                <span>Grooming Needs</span>
                <div className="stat-bar">
                <span className="stat" style={{width:`calc(${cat.breeds[0].grooming}/5*100%`}}></span>
                </div>
              </div>
              <div className="stat-container">
                <span>Stranger Friendly</span>
                <div className="stat-bar">
                <span className="stat" style={{width:`calc(${cat.breeds[0].stranger_friendly}/5*100%`}}></span>
                </div>
              </div>
              <div className="stat-container">
                <span>Affection Level</span>
                <div className="stat-bar">
                <span className="stat" style={{width:`calc(${cat.breeds[0].affection_level}/5*100%`}}></span>
                </div>
              </div>
          </div>);
    }else{
      return(
        <div id="preview-right">
                <div id="preview-right-header" >
                <h2>{cat.breeds[0].name}</h2>
                <div className="icons">
                  <i className={`${favIconClass} fa-star star-icon`} onClick={favClick}> </i>
                  <i className="menu-icon fa-solid fa-bars" onClick={showMoreClick}></i> 
                </div>
                </div>         
                <p>{cat.breeds[0].description}</p>
                <div className="stat-container">
                      <span>Energy Level </span>
                      <div className="stat-bar">
                      <span className="stat" style={{width:`calc(${cat.breeds[0].energy_level}/5*100%`}}></span>
                  </div>
                </div>
                <div className="stat-container">
                      <span>Intelligence</span>
                      <div className="stat-bar">
                      <span className="stat" style={{width:`calc(${cat.breeds[0].intelligence}/5*100%`}}></span></div>
                </div>
                <div className="stat-container">
                      <span>Social Needs</span>
                      <div className="stat-bar">
                      <span className="stat" style={{width:`calc(${cat.breeds[0].social_needs}/5*100%`}}></span></div>
                </div>   
              </div>);
    }
    }
    const favClick = (event) =>{
      setFavAlertVisible(true);
      if(currentUser.email){
        if(isFavourite===false){
          addFav(event);
        }else{
          removeFav(event);
        }
      }
      setFavourite(!isFavourite);  
      
      const timeOutId = setTimeout(()=>{
        setFavAlertVisible(false);
      },2300);    
    }

    const favIconClass = isFavourite?'fa-solid':'fa-regular'
    return (
    <div id="preview-cat">
        
        {isFavAlertVisible && <span id="fav-alert" className="alert-pop">{!currentUser.email? "Login to add to favourites":isFavourite?"Added to favourites!" :"Removed from favourites."}</span>}
        <div id="preview-left">
        <img
            key={cat.id}
            className="preview-cat-img"
            src={cat.url}
            alt=''/>
            </div> 
        <PreviewContent/>
            </div>
   )
  }


export default Preview