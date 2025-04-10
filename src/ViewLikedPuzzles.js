
import { add_account, login, new_session } from "./API/SendToApi"
import { getLikedPuzzles, getLikedPostedPuzzles } from "./API/GetFromApi"

import Collapseable from "./Collapseable";

import { useEffect, useState } from "react"

import PlayablePuzzleList from "./PlayablePuzzleList";
import { PuzzlePost, SelectedPost } from "./CommunityPage";

let adminPublicKeys = ["Admin 1"]


export default ViewLikedPuzzles = ({ user, mode, sessionId,  sessionStart}) => {
    let [puzzles, setPuzzles] = useState([])
    let [publicPuzzles, setPublicPuzzles] = useState([])
    let [postContent, setPostContent] = useState(<div>Loading</div>)

    let getPuzzles =() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzles = await getLikedPuzzles(user)
            posted = await getLikedPostedPuzzles(user)
            resolve([puzzles, posted])
        })
    }

    let r = () => {
        setPostContent(<div className="postContainer">{publicPuzzles.map((p,i) => <PuzzlePost key={i} post={p} selectPost={selectPost}/>)}</div>)
    }

    let selectPost = (post) => {
        setPostContent(<SelectedPost  user={user} post={post} r={r} appMode={mode} sessionStart={sessionStart} sessionId={sessionId} />)
    }



    async function fetch() { 
        getPuzzles().then(
            
            (p) =>{

                if (p != "LOGIN" && p != null){
                    setPuzzles(p[0])
                    setPublicPuzzles(p[1])

                    setPostContent(<div className="postContainer">{p[1].map((p,i) => <PuzzlePost key={i} post={p} selectPost={selectPost}/>)}</div>)
                }
         
            
        })}
    
    useEffect (() => 
            {
            fetch()
    
            }, [user]  )


    let likedPuzzlelist =  <PlayablePuzzleList puzzles={puzzles} user={user}  setPuzzles={setPuzzles} r={fetch}  appMode={mode}  sessionId = {sessionId} sessionStart={sessionStart}/>




        return <div className="body">
            <Collapseable title="Liked Community Posts" content={postContent} showByDefault={false}/> 
           <Collapseable title="My Liked Puzzles" content={likedPuzzlelist} showByDefault={false} /> 

           
        </div>
    
    
}