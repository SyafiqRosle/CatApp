import { Form ,useLoaderData,useLocation} from "react-router-dom";
import {getCat} from '../cats'

export async function loader({params}){
    
    const cat = await getCat(params.catId);
    return {cat};
}

export default function Preview(){
    
    const {cat} = useLoaderData();
    return (
    <div id="preview-cat">
        
        <div id="preview-left">
        <img
            key={cat.id}
            className="preview-cat-img"
            src={cat.url}
            alt=''/>
            </div>
            <div id="preview-right">
              <h2>{cat.breeds[0].name}</h2>
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