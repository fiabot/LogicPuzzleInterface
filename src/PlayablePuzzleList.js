import "./ViewPuzzlesStyle.css"; 
import lzString from  "lz-string"
import { like_puzzle, remove_puzzle } from './API/SendToApi';
import EditPuzzle from "./EditPuzzle";
import { useState, useEffect } from "react"
import { findMutants } from "./utils";






export default PuzzleList= ({puzzles, setPuzzles, user, reload, showMutants=false}) => {

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
            if (idx >= 0){
                puzzles[idx]["key"] = result.data["key"]
            }
         
            setPuzzles(puzzles)
        }else{
            alert("Failed to like puzzle")
        }
         
    }


    let unlikeButton = async (puzzle, idx)  => {
        result = await remove_puzzle(puzzle["key"], user)
        console.log(result)
        if (result.status < 300){
            if (idx >= 0){
                puzzles[idx]["key"] = null
            }
     
            setPuzzles(puzzles)
        
        }else{
            alert("Failed to remove puzzle")
        }
    }

    let r = () => {
        if (reload != null){
            reload()
        }
        setMode("view")
    }

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
            let sameDiffMuts = mutants[0].length > 0?  mutants[0].map((puzzle, idx) => <PuzzleElement puzzle={puzzle} idx={-10 - idx}/>) : <div>No Puzzles Found</div>
            let hardDiffMuts = mutants[1].length > 0?  mutants[1].map((puzzle, idx) => <PuzzleElement puzzle={puzzle} idx={-20 - idx}/>) : <div>No Puzzles Found</div>
            let easyDiffMuts = mutants[2].length > 0?  mutants[2].map((puzzle, idx) => <PuzzleElement puzzle={puzzle} idx={-30 - idx}/>) : <div>No Puzzles Found</div>
            return <div>
                <button onClick={r} >Return</button>
                <h1>Looking at mutants for puzzle</h1>
                <h2>{"name" in puzzle? puzzle["name"] : "Untitled Puzzle" }</h2>
                <h3>Difficulty: {puzzle.diff}</h3>
                 <h3>Hints</h3>
                 <ol className='hintList'>
                    {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
                </ol>

                <h1>Mutants with same difficulty</h1>
                {sameDiffMuts}

                <h1>Mutants that are harder</h1>
                {hardDiffMuts}

                <h1>Mutants that are easier</h1>
                {easyDiffMuts}
            </div>
        }
    
    
    }
    

    let editPuzzle = (puzzle) => {
        setMode("edit")
        setPuzzleToEdit(puzzle)
    }

    let seeMutants = (puzzle) => {
        setMode("mutants")
        setPuzzleToEdit(puzzle)
    }

    let PuzzleElement = ({puzzle, idx}) => {
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
        {showMutants? <button onClick={() => seeMutants(puzzle)}>See Mutants</button>: ""}
        </li>}
    let puzzleList = puzzles.map((puzzle, idx) => {
        return <PuzzleElement puzzle={puzzle} idx={idx} />
    })


    if (mode == "view"){
        return <ol className='puzzleList'>
            <p> Showing {puzzles.length} puzzles</p>
        {puzzleList} 
    </ol>
    }else if (mode == "mutants"){

        return <ShowMutants puzzle={puzzleToEdit} puzzleList={puzzles}/> 
    
    }else{
        return <EditPuzzle puzzleData={puzzleToEdit} user={user} r={r}/>
    }



}