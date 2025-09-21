import {Link} from 'react-router-dom'
const LoginPage = ({   username,setUserName,password,setPassword,handleSignInButton }) => {
  return (
    <div className="NewPost">
    <div className="loginPage">
      <div className="loginCard">
        <h1>Welcome Back 👋</h1>
        <p>Please sign in to continue</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Enter username" 
          value={username}
          onChange={(e)=>setUserName(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />

          <button onClick={handleSignInButton} className="signInButton">
            Sign In
          </button>
        </form>

        <div className="extras">
          <a href="#">Forgot Password?</a>
          <Link to='/createaccount'><p>Create an Account</p></Link>
          
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
