import api from '../api/axiosAPI'
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
const Nav = ({search,setSearch,resetStates, setAccessToken})=>{

    const history = useHistory();
    const logout = async () => {
    try {
      // optional backend call to clear refresh token cookie
      await api.post("/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
     setAccessToken('')


    // reset states
    resetStates();

    // redirect to login
    history.push("/");
  };

    return (
        <nav className="Nav">
            <form className="searchForm">
                <label htmlFor="search">Search Posts</label>
                <input
                    id="search"
                    type="text" 
                    placeholder="Search Posts"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
            </form>
            <ul>
            <li><Link to='/dashboard' onClick={resetStates}>Home</Link></li>
            <li><Link to='/newpost' onClick={resetStates}>NewPost</Link></li>
            <li><Link to='/about' onClick={resetStates}>About</Link></li>
            <li onClick={logout} >Log out</li>
            </ul>

        </nav>
    )
        
    
}

export default Nav;