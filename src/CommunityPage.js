import { post_puzzle, add_comment, like_posted_puzzle, unlike_posted_puzzle, view_puzzle} from "./API/SendToApi";
import { get_posted_puzzles, getLikedPuzzles } from "./API/GetFromApi";
import { useEffect, useState } from "react";
import SelectedPuzzle from "./SelectedPuzzle";
import PlayablePuzzleList from "./PlayablePuzzleList";
import "./community_style.css"
import { formatTime } from "./utils";


let PuzzlePost = ({post, selectPost}) => {
    let time = formatTime(post.time)

    console.log(post.puzzle.categories)

    let cats = post.puzzle.categories.length
    let entities = post.puzzle.categories[0].entities.length

    let views = "views" in post? post.views : 0 
    let likes = "likes" in post ? post.likes : 0 
    return <div className="post">
        <h1>{post.title}</h1>
        <p className="metadata">{post.username}</p>
        <p className="metadata">{time}</p>
        <p>{post.body}</p>
        <h2>Difficulty: {post.puzzle.difficulty}</h2>

        <h2>Categories: {cats}</h2>

        <h2>entities: {entities}</h2>
        <p className="metadata">{views} views</p>
        <p className="metadata">{likes} likes</p>
 
        <button onClick={() => selectPost(post)}>Select</button>
    </div>
}


let SelectedPost = ({user, post, r, appMode, sessionStart, sessionId}) => {
    let [commentText, setCommentText] = useState("")
    let [liked, setLiked] = useState(false); //TODO: make this actually checked if we have already liked puzzle 
    comments = post.comments.map((c, i) => <div className="comment" key={i}><p>{c.comment}</p><p className="metadata">{formatTime(c.time)}</p> <p className="metadata">{c.username}</p></div>)

    let time = formatTime(post.time)
    let views = "views" in post? post.views : 0 
    let likes = "likes" in post ? post.likes : 0

    let add_comment_button = async () => {
        let result = await add_comment(post["_id"], commentText, new Date().toJSON(), user)

        if (result.status < 300){
            alert("Successfully Posted")
            setCommentText("")
        }else{
            alert("Failed to post comment")
        }

    }

    let toggleLike = () => {
        if (liked){
            unlike_posted_puzzle(post._id, user)
            setLiked(!liked)
        }else{
            like_posted_puzzle(post._id, user)
            setLiked(!liked)
        }
    }


    return <div>
        <SelectedPuzzle puzzle={post.puzzle} user={user} appMode={appMode}  r={r} sessionStart={sessionStart} sessionId={sessionId} can_like={false}/> 
        <div className="post">
        <h1>{post.title}</h1>
        <p className="metadata">{post.username}</p>
        <p className="metadata">{time}</p>
        <button onClick={toggleLike}>{liked? "Unlike": "Like"}</button>
        <p>{post.body}</p>
        <h2>Difficulty: {post.puzzle.difficulty}</h2>
        <p className="metadata">{views} views</p>
        <p className="metadata">{likes} likes</p>

        <h2>Comments</h2>
        {comments}

        <h3>Add New Comment</h3>
        <textarea className={"scenarioInput"} value={commentText} onChange={(e)=> setCommentText(e.target.value)} />
        <br/>
        <button onClick={add_comment_button}>Post Comment</button>
    </div> 


        

     
      
    </div>
}

let MakeNewPost = ({user, r, sessionStart, sessionId}) => {
    let [likedPuzzles, setLikedPuzzles] = useState([])
    let [selectPuzzleIdx, setSelectedPuzzleIdx] = useState(-1)
    let [title, setTitle] = useState("")
    let [body, setBody] = useState("")

    useEffect(() => {
        let fetch = async() => {
            puzzles = await getLikedPuzzles(user)

            setLikedPuzzles(puzzles)
        }
        fetch()
     }, [])


    let post = async () => {
        if(selectPuzzleIdx == -1){
            alert("Please select a puzzle before posting")
        }else{
            p = await post_puzzle(likedPuzzles[selectPuzzleIdx], title, body, new Date().toJSON(), user)

            if (p.status < 300){
                alert("Posted Puzzle")
                r()
            }else{
                alert("Unable to post puzzle")
            }
        }
    }

    let puzzleOptions = likedPuzzles.map((puzzle, idx) => {return <div className="puzzleSelectElement">
        <h2>{"name" in puzzle? puzzle["name"] : "Untitled Puzzle" }</h2>
        <h3>Difficulty: {puzzle.diff}</h3>
        <h3>Hints</h3>
        <ol className='hintList'>
        {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
        </ol>
            <button onClick={() => setSelectedPuzzleIdx(idx)}>Select</button>
        </div>
    })


    return <div>
        <button onClick={r}>Return</button>
        <h1>Post Title</h1>
            <input className="categoryInput" value={title} onChange={e => setTitle(e.target.value)}/>
       
        <h1> Post Body</h1>
        <textarea className="scenarioInput" value={body} onChange={(e)=> setBody(e.target.value)} />

        <h1>Select Puzzle</h1>
        <div className="selectPuzzleContainer">
            {puzzleOptions}
        </div>

        <button onClick={post}>Post</button>
        

    </div>



    
}

let CommunityPage = ({user, appMode,  sessionStart, sessionId}) => {
    let [postedPuzzles, setPostedPuzzles] = useState([])
    let [selectedPuzzle, setSelectedPuzzle] = useState(null)
    let [mode, setMode] = useState("view")
    let fetch = async() => {
        let puzzles = await get_posted_puzzles(user)

        setPostedPuzzles(puzzles)
    } 

    useEffect(() => {
   
        fetch()
    }, [])

    let makeNew = () => {
        setMode("new")
    }

    let selectPost = (post) => {
        view_puzzle(post._id, user)
        setSelectedPuzzle(post)
        setMode("selected")
    }

    let r = () => {
        fetch()
        setMode("view")
    }


    let mainContent = <div>Loading</div>
    if (mode == "view"){
        mainContent= <div className="postContainer">{postedPuzzles.map((p,i) => <PuzzlePost key={i} post={p} selectPost={selectPost}/>)}</div>
    }else if (mode == "selected"){
        mainContent = <SelectedPost user={user} post={selectedPuzzle} r={r} appMode={appMode} sessionStart={sessionStart} sessionId={sessionId}/> 
    }else if (mode == "new"){
        mainContent = <MakeNewPost  user={user} r={r}  sessionStart={sessionStart} sessionId={sessionId}/> 
    }
    

    return <div className="body">
        <div className="community">
        <h1 className="headTitle">Community puzzles</h1>
        {(mode == "view") ? <button onClick={makeNew}>Make New Post</button> : ""} 
        {mainContent}
        </div>

    </div>

}

export{CommunityPage, PuzzlePost, SelectedPost}