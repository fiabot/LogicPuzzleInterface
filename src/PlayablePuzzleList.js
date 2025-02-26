import "./ViewPuzzlesStyle.css"; 
import lzString from  "lz-string"
import { like_puzzle, remove_puzzle } from './API/SendToApi';
import EditPuzzle from "./EditPuzzle";
import { useState } from "react"


export default PuzzleList= ({puzzles, setPuzzles, user, reload}) => {

    let [mode, setMode] = useState("view")
    let [puzzleToEdit, setPuzzleToEdit] = useState(null)

    const openInNewTab = (url) => {
        window.open(url, "_blank", "noreferrer");
      };

    let playPuzzle = (puzzle) => {
        str = JSON.stringify(puzzle)
        compStr = lzString.compressToEncodedURIComponent(str)
        url_str =  pathname = window.location.href +"play?puzzle=" + compStr
        openInNewTab(url_str)
    }

    let likeButton = async (puzzle, idx)  => {
        result = await like_puzzle(puzzle, user)
        console.log(result)
        if (result.status < 300){
            puzzles[idx]["key"] = result.data["key"]
            setPuzzles(puzzles)
        }else{
            alert("Failed to like puzzle")
        }
         
    }


    let unlikeButton = async (puzzle, idx)  => {
        result = await remove_puzzle(puzzle["key"], user)
        console.log(result)
        if (result.status < 300){
            puzzles[idx]["key"] = null
            setPuzzles(puzzles)
            console.log(puzzles[idx])
        }else{
            alert("Failed to remove puzzle")
        }
    }

    let editPuzzle = (puzzle) => {
        setMode("edit")
        setPuzzleToEdit(puzzle)
    }
    let puzzleList = puzzles.map((puzzle, idx) => {
        return <li className='puzzleListElement' key = {idx}>
        <h2>{"name" in puzzle? puzzle["name"] : "Untitled Puzzle" }</h2>
        <h3>Difficulty: {puzzle.diff}</h3>
        <h3>Hints</h3>
        <ol className='hintList'>
        {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
        </ol>
        <button onClick={()=> playPuzzle(puzzle)}>Play Puzzle</button>
        <button onClick={()=> editPuzzle(puzzle)}>Edit Puzzle</button>
        {("key" in puzzle && puzzle["key"] != null)?<button onClick={() => unlikeButton(puzzle,idx)}>Unlike Puzzle</button>:   <button onClick={() => likeButton(puzzle,idx)}>Like Puzzle</button> }
        </li>
    })

    let r = () => {
        if (reload != null){
            reload()
        }
        setMode("view")
    }
    if (mode == "view"){
        return <ol className='puzzleList'>
        {puzzleList} 
    </ol>
    }else{
        return <EditPuzzle puzzleData={puzzleToEdit} user={user} r={r}/>
    }



}