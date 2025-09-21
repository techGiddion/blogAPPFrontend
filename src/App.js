import './App.css';
import Header from './components/Header'
import Nav from './components/Nav'
import Home from './components/Home'
import PostPage from './components/PostPage'
import NewPost from './components/NewPost'
import About from './components/About'
import MissingPage from './components/MissingPage'
import Footer from './components/Footer'
import LoginPage from './components/LoginPage'
import CreateAccount from './components/CreateAccount'
import { Switch, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns'
import api from './api/axiosAPI'
import { jwtDecode } from "jwt-decode";
import PrivateRoute from './components/PrivateRoute'

function App() {
  const history = useHistory()
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null);
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.get('/post')
        const data = response.data.allPosts;
        setPosts(data.reverse())
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData();

    const handleStorageChange = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [])

  const resetStates = () => {
    setTitle('');
    setBody('');
    setEditId(null);
    setSearch('');
    setUserName('')
    setPassword('')
  };

  // DELETE POST
const handleDelete = async (id) => {
  try {
    // Optimistically update UI
    const remainingPost = posts.filter(post => post._id !== id);
    setPosts(remainingPost);

    // Send DELETE request with Authorization header
    await api.delete(`/post/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    history.push('/dashboard');
  } catch (err) {
    if (err.response?.status === 401) {
      alert("You are not authorized. Please login again.");
      history.push('/');
    } else if (err.response?.status === 403) {
      alert("You do not have permission to delete this post.");
    } else {
      alert(err.message);
    }
  }
};
  // CREATE / EDIT POST
const handleSubmit = async () => {
  if (!title || !body) return alert("Title and body both are required");

  const dateFomated = format(new Date(), "MMMM dd,yyyy hh:mm:ss");

  try {
    if (editId) {
      // Edit existing post
      const updatedPost = { title, date_time: dateFomated, body };

      // Send PUT request with Authorization header
      const res = await api.put(`/post/${editId}`, updatedPost, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Update local state using backend response
      setPosts(posts.map(post => (post._id === editId ? { ...post, ...updatedPost } : post)));
      setEditId(null);
    } else {
      // New post
      const newPost = { title, date_time: dateFomated, body };

      // Send POST request and get the post from backend (with _id)
      const res = await api.post('/post', newPost, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const createdPost = res.data.post; // This contains the _id from MongoDB
      setPosts([createdPost, ...posts]); // update state with proper _id

      setTitle('');
      setBody('');
    }

    history.push('/dashboard');
  } catch (err) {
    if (err.response?.status === 401) {
      alert("You are not authorized. Please login again.");
      history.push('/');
    } else if (err.response?.status === 403) {
      alert("You do not have permission to perform this action.");
    } else {
      alert(err.message);
    }
  }
};



  // LOGIN
  const handleSignInButton = async () => {
    if (!username || !password) return alert("Username and password both are required");

    try {
      const response = await api.post(
        "/auth",
        { username, password },
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      if (accessToken) {
        setAccessToken(accessToken)
        localStorage.setItem("accessToken", accessToken);

        const decoded = jwtDecode(accessToken);
        const userInfo = decoded?.userInfo;
        if (userInfo?.username) localStorage.setItem("username", userInfo.username);
        if (userInfo?.id) localStorage.setItem("userId", userInfo.id); // ✅ store userId
        if (userInfo?.roles) localStorage.setItem("roles", JSON.stringify(userInfo.roles));

        history.push('/dashboard')
      }
    } catch (err) {
      if (!err?.response) alert("No server response");
      else if (err.response?.status === 400) alert("Missing Username or Password");
      else if (err.response?.status === 401) alert("Invalid Username or Password");
      else alert("Login failed");
    }
  }

  return (
    <div className="App">
      <Header />
      {accessToken && (
        <Nav
          search={search}
          setSearch={setSearch}
          resetStates={resetStates}
          setAccessToken={setAccessToken}
        />
      )}
      <Switch>
        <Route exact path='/'>
          <LoginPage
            handleSignInButton={handleSignInButton}
            username={username}
            setUserName={setUserName}
            password={password}
            setPassword={setPassword}
          />
        </Route>
        <Route exact path='/createaccount'>
          <CreateAccount
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        </Route>
        <PrivateRoute exact path="/dashboard">
          <Home
            posts={posts.filter(
              post =>
                post.body?.toLowerCase().includes(search.toLowerCase()) ||
                post.title?.toLowerCase().includes(search.toLowerCase())
            )}
          />
        </PrivateRoute>
        <PrivateRoute path='/post/:id'>
          <PostPage
            posts={posts}
            handleDelete={handleDelete}
            setTitle={setTitle}
            setBody={setBody}
            setEditId={setEditId}
          />
        </PrivateRoute>
        <PrivateRoute path='/newpost'>
          <NewPost
            title={title}
            setTitle={setTitle}
            body={body}
            setBody={setBody}
            handleSubmit={handleSubmit}
          />
        </PrivateRoute>
        <Route path='/about' component={About} />
        <Route path='/*' component={MissingPage} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
