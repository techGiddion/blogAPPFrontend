const NewPost = ({title,setTitle,body,setBody,handleSubmit})=>{
    return (
        <main className="NewPost">
            <h2>New Post</h2>
            <form className="newPostForm" onSubmit={(e)=>e.preventDefault()}>
                <label htmlFor="input title">Title</label>
                <input 
                    type="text"
                    placeholder="Input your title here"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <label>Body</label>
                <textarea 
                type="text"
                placeholder="Input your title here"
                value={body}
                onChange={(e)=>setBody(e.target.value)}
                />
                <button type="button" onClick={handleSubmit}>Submit Post</button>
            </form>
        </main>
    )
        
    // Title
    // Body
    
}

export default NewPost;