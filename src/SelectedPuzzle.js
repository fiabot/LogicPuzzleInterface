import "./ViewPuzzlesStyle.css"; 
import lzString from  "lz-string"
import { like_puzzle, remove_puzzle } from './API/SendToApi';
import EditPuzzle from "./EditPuzzle";
import { useState, useEffect } from "react"
import { findMutants } from "./utils";
import { createPuzzle } from "./puzzleModel";
import Puzzle from "./puzzle";
import { add_click } from "./API/SendToApi";


export default selectedPuzzle = ({puzzle, setPuzzle, user, r, appMode, sessionId, sessionStart, otherPuzzles = [], reload=null, can_like = true}) => {

    let [mode, setMode] = useState("play")
    let [puzzleToEdit, setPuzzleToEdit] = useState(null)

    let [liked, setLiked] = useState("key" in puzzle && puzzle["key"] != null)
   

    let model = createPuzzle(puzzle)

    let [playable, setPlayable] = useState(<Puzzle className="playable" p={model}/>)
    let [content, setContent] = useState(playable)

    useEffect(()=>{
        let model = createPuzzle(puzzle)
        setPlayable(<Puzzle className="playable" p={model}/>)
    }, [puzzle])

    const openInNewTab = (url) => {
        window.open(url, "_blank", "noreferrer");
      };

    let playPuzzle = (puzzle) => {
        str = JSON.stringify(puzzle)
        compStr = lzString.compressToEncodedURIComponent(str)
        url_str =  pathname = window.location.href +"play?puzzle=" + compStr
        openInNewTab(url_str)
    }

    let likeButton = async (puzzle)  => {
        result = await like_puzzle(puzzle, user)
     
        if (result.status < 300){
        
            setLiked(!liked)
        }else{
            alert("Failed to like puzzle")
        }
         
    }


    let unlikeButton = async (puzzle)  => {
        result = await remove_puzzle(puzzle["key"], user)
        console.log(result)
        if (result.status < 300){
    
            setLiked(!liked)
        
        }else{
            alert("Failed to remove puzzle")
        }
    }

    let gotToView = () => {
        if (reload != null){
            reload()
        }
        setMode("view")
    }

    let PuzzleElement = (({puzzle}) =>{
        return <div >
               <h2>{"name" in puzzle? puzzle["name"] : "Untitled Puzzle" }</h2>
        <h3>Difficulty: {puzzle.diff}</h3>
        <h3>Hints</h3>
        <ol className='hintList'>
        {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
        </ol>
        <button onClick={()=> {setPuzzle(puzzle); setContent(playable)}}>Select</button>
        </div>

    })

    let ShowMutants = ({puzzle, puzzleList}) => {

        let [mutants, setMutants] = useState([])
    
        useEffect(() => {
            let m = findMutants(puzzle, puzzleList)
    
            let same = m[0].slice(0, 2)
            let harder = m[1].slice(0,2)
            let easier = m[2].slice(0,2)
    
            setMutants([same, harder, easier])
        }, [puzzle])

        if (mutants.length == 0){
            return <div>Loading</div>
        }else{
            let sameDiffMuts = mutants[0].length > 0?  mutants[0].map((puzzle, idx) => <PuzzleElement key={idx} puzzle={puzzle}/>) : <div>No Puzzles Found</div>
            let hardDiffMuts = mutants[1].length > 0?  mutants[1].map((puzzle, idx) => <PuzzleElement  key={idx} puzzle={puzzle} />) : <div>No Puzzles Found</div>
            let easyDiffMuts = mutants[2].length > 0?  mutants[2].map((puzzle, idx) => <PuzzleElement   key={idx} puzzle={puzzle}/>) : <div>No Puzzles Found</div>
            return <div className="similar">
        

                <h1>Mutants with same difficulty</h1>
                {sameDiffMuts}

                <h1>Mutants that are harder</h1>
                {hardDiffMuts}

                <h1>Mutants that are easier</h1>
                {easyDiffMuts}
            </div>
        }
    
    
    }
    

    let editPuzzle = () => {
        add_click(sessionId, "edit puzzle", sessionStart)
        setMode("edit")
        setContent( <EditPuzzle puzzleData={puzzle} setPlayable={setPuzzle} user={user} r={null} sessionId={sessionId} sessionStart={sessionStart}/>)
       
    }

    let seeMutants = () => {
        setMode("mutant")
        add_click(sessionId, "view similar", sessionStart)
        setContent(<ShowMutants puzzle={puzzle} puzzleList={otherPuzzles}/> )
      
    }




        return <div className='puzzleElement' >
            <div className="topButtons">
            <button className="returnButton" onClick={r}><img src="./icons/back.png" width="40" height="40"/></button>
            {can_like? (liked)?<button className="likeButton" onClick={() => unlikeButton(puzzle)}><img src="./icons/liked.png" width="40" height="40"/></button>:   <button  className="likeButton" onClick={() => likeButton(puzzle)}><img src="./icons/unliked.png" width="40" height="40"/></button> : "" }
            </div>


        <div className="bottomButtons">

{can_like? <button className={mode == "play"? "active": ""} onClick={()=> {setMode("play");setContent(playable)}}>Play Puzzle</button>: ""}

{(can_like && (appMode == "serious" || appMode == "mixed"))? <button className={mode == "edit"? "active": ""} onClick={()=> editPuzzle(puzzle)}>Edit Puzzle</button> : ""}

{can_like && otherPuzzles.length != 0? <button className={mode == "mutant"? "active": ""} onClick={() => seeMutants()}>See Similar</button>: ""}

<button className="likeButton" onClick={()=> playPuzzle(puzzle)}><img src="./icons/openlink.png" width="40" height="40"/></button>
</div>
       

   

        {content}

        </div>


    

    
}