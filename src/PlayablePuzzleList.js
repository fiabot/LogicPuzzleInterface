import "./ViewPuzzlesStyle.css"; 
import lzString from  "lz-string"
import { like_puzzle, remove_puzzle } from './API/SendToApi';
import EditPuzzle from "./EditPuzzle";
import { useState, useEffect } from "react"
import { findMutants } from "./utils";
import SelectedPuzzle from "./SelectedPuzzle";






export default PuzzleList= ({puzzles, setPuzzles, user, reload, sessionId, sessionStart, showMutants=false, appMode="mixed"}) => {

    let [mode, setMode] = useState("view")
    let [selectedPuzzle, setSelectedPuzzle] = useState(null)


    let select = (puzzle) => {
        setSelectedPuzzle(puzzle)
        setMode("selected")
    }

    let puzzleList = puzzles.map((puzzle, idx) => {
        return  <li className='puzzleListElement' key = {idx}>
        <h2>{"name" in puzzle? puzzle["name"] : "Untitled Puzzle" }</h2>
        <h3>Difficulty: {puzzle.diff}</h3>
        <h3>Hints</h3>
        <ol className='hintList'>
        {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
        </ol>
        <button onClick={()=> select(puzzle)}>Select</button>
        
        </li>
    })


        if (mode == "view"){
            return <ol className='puzzleList'>
            <p> Showing {puzzles.length} puzzles</p>
        {puzzleList} 

        </ol>
        }else if (mode == "selected"){
            let otherPuzzles = []
            if (showMutants){
                otherPuzzles = puzzles
            }
            return <SelectedPuzzle puzzle={selectedPuzzle} setPuzzle={setSelectedPuzzle} user={user} appMode={appMode} r={() => setMode("view")} reload={reload} otherPuzzles={otherPuzzles} sessionId={sessionId} sessionStart={sessionStart}/> 
        }
  



}