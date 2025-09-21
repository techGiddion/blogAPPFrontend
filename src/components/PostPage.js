import { useParams, Link } from "react-router-dom";

const PostPage = ({ posts, handleDelete, setTitle, setBody, setEditId }) => {
  const { id } = useParams();

  // Get the logged-in user's info from localStorage
  const loggedInUserId = localStorage.getItem("userId"); // ✅ use userId
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = roles.includes("Admin");

  // Find the post
  const post = posts.find((p) => p._id.toString() === id);

  if (!post) {
    return (
      <main className="PostPage">
        <div className="notFound">
          <p>Post not found</p>
          <h2>Ahh, this is disappointing</h2>
          <Link to="/dashboard">Please visit the Home Page</Link>
        </div>
      </main>
    );
  }

  // Check if the logged-in user is the owner
  const isOwner = post.user === loggedInUserId;

  return (
    <main className="PostPage">
      <h2>{post.title}</h2>
      <p>{post.date_time}</p>
      <p>{post.body}</p>

      {/* Only show Edit/Delete buttons if owner or admin */}
      {(isOwner || isAdmin) && (
        <div className="postButtons">
          <Link to="/newpost">
            <button
              onClick={() => {
                setTitle(post.title);
                setBody(post.body);
                setEditId(post._id);
              }}
              className="editButton"
            >
              Edit
            </button>
          </Link>

          <button
            className="deleteButton"
            onClick={() => handleDelete(post._id)}
          >
            Delete
          </button>
        </div>
      )}
    </main>
  );
};

export default PostPage;
