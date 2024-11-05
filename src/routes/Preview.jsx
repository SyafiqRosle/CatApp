
import {useLoaderData} from "react-router-dom";
import {getCat} from '../cats'
import { useEffect, useState } from "react";
import { auth ,db} from "../firebase";
import { onAuthStateChanged} from "firebase/auth";
import {doc,setDoc,getDoc,arrayUnion,arrayRemove,updateDoc} from "firebase/firestore"

export async function loader({params}){
    
    const cat = await getCat(params.catId);
    return {cat};
}

const Preview=()=>{
    const [isFavourite,setFavourite]= useState(false);
    const [isVisible,setVisible] = useState(false);
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
    
  
   
 
    const favClick = (event) =>{
      setVisible(true);
      if(isFavourite===false){
        addFav(event);
      }else{
        removeFav(event);
      }
      setFavourite(!isFavourite);  
      
      const timeOutId = setTimeout(()=>{
        setVisible(false);
      },2300);    
    }

    const favIconClass = isFavourite?'fa-solid':'fa-regular'
    return (
    <div id="preview-cat">
        {isVisible && <span id="fav-alert">{!currentUser.email? "Login to add to favourites":isFavourite?"Added to favourites!" :"Removed from favourites."}</span>}
        <div id="preview-left">
        <img
            key={cat.id}
            className="preview-cat-img"
            src={cat.url}
            alt=''/>
            </div>
            <div id="preview-right">
              <div id="preview-right-header" onClick={favClick}>
              <h2>{cat.breeds[0].name}</h2>
              <i className={`${favIconClass} fa-star star-icon`}> </i>
              </div>
            
              <p>{cat.breeds[0].description}</p>
              <div className="stat-container">
                    <span>Energy Level</span>
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
                    <span>Grooming</span>
                    <div className="stat-bar">
                    <span className="stat" style={{width:`calc(${cat.breeds[0].grooming}/5*100%`}}></span></div>
              </div>
            </div>
            </div>
   )
  }


export default Preview