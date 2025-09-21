import { Link } from "react-router-dom";
const Home = ({posts})=>{
    console.log("Rendering Home, posts:", posts);
    return (
        <main className="Home">
            <ul>
                {posts.length ? posts.map(post=>(
                    <li key={post._id} className="post">
                        <Link to= {`/post/${post._id}`}>
                        <h2>{post.title}</h2>
                        <h2 className="postDate">{post.date_time}</h2>
                        </Link>
                        <p className="postBody">{post.body.length < 50 ? post.body : `${post.body.slice(0,50)}...`}</p>
                    </li>

                ) 
                ) : <p>No post to display</p>}
            </ul>
        </main>
    )

    // visible posts
    // no post found
        
    
}

export default Home;