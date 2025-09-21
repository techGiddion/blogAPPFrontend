import { Link } from "react-router-dom";
const MissingPage = ()=>{
    return (
        <main className="Missing">
            <h1>Page not found</h1>
            <h2>Ahh this is disappointing</h2>
            <br />
          <Link 
  to='/' 
  style={{ 
    color: 'white', 
    backgroundColor: 'red', 
    padding: '0.5rem 1rem', 
    borderRadius: '5px', 
    textDecoration: 'none' 
  }}
>
  Please visit the Home Page
</Link>
        </main>
    )
        
    
}

export default MissingPage;