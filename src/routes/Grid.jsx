import {Link} from "react-router-dom"

const Grid = ({gridImages,heightRef,loading}) => {

    return(
        <div id="grid" ref={heightRef}>
        {gridImages.map((cat,i)=> 
        <div className="col" key={i} >
          
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
          {loading && <p>Loading...</p>}
        </div>)}
      </div>
    )    
}

export default Grid