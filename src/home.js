
import { add_account } from "./API/SendToApi"
import { getLikedPuzzles } from "./API/GetFromApi"
import { useEffect, useState } from "react"

import PlayablePuzzleList from "./PlayablePuzzleList";


export default HomePage = ({startGeneration, user, setUser}) => {
    let [puzzles, setPuzzles] = useState([])
    //let puzzles = []
    let [username, setUsername] = useState("")

    let getPuzzles =() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzles = await getLikedPuzzles(user)
            resolve(puzzles)
        })
    }

    
    useEffect (() => 
            {async function fetch() { 
                getPuzzles().then(
                    
                    (p) =>{

                        if (p != "LOGIN" && p != null){
                            setPuzzles(p)
                        }
                 
                    
                })}
            fetch()
    
            }, [user]  )
    if (user== null){
     
    
        return <div  className='puzzlesView'>
            <h1>Sign Up or Login</h1>
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <button onClick={() => {add_account(username,setUser);}}>Login</button>
        </div>
    }else{
        const openInNewTab = (url) => {
            window.open(url, "_blank", "noreferrer");
          };

        let playPuzzle = (puzzle) => {
            str = JSON.stringify(puzzle)
            compStr = lzString.compressToEncodedURIComponent(str)
            url_str =  pathname = window.location.href +"play?puzzle=" + compStr
            openInNewTab(url_str)
        }
        let puzzleList = puzzles.map((puzzle, idx) => {
            return <li className='puzzleListElement' key = {idx}>
            <h2>Difficulty: {puzzle.diff}</h2>
            <h2>Hints</h2>
            <ol className='hintList'>
            {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
            </ol>
            <button onClick={()=> playPuzzle(puzzle)}>Play Puzzle</button>
            </li>
        })

        return <div className='puzzlesView'>
            <h1>Welcome {user}</h1>
            <h2>Start Generating</h2>
            <button onClick={startGeneration}>Start</button>
            <h2>View Liked Puzzles</h2>
            <PlayablePuzzleList puzzles={puzzles}/>
        </div>
    }
    
}