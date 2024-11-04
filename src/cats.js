

export async function getCat(id){
    const response =
    await(await fetch(`https://api.thecatapi.com/v1/images/${id}?api_key=${process.env.REACT_APP_API_KEY}`)).json();
    //response={id,url,width,height}
    return response;
}


export async function createUserId() {
   
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now() };
   
    // contacts.unshift(contact);
    
    return contact;

}