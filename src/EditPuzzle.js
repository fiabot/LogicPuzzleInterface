import { useEffect, useState } from "react"
import Puzzle from "./puzzle"
import { createPuzzle } from "./puzzleModel"
import "./AuthoringStyle.css"
import { update_puzzle, like_puzzle } from "./API/SendToApi"
import "./narrative.css";
import { getBrainStormIdeas, getClueLogic } from "./utils"


let GetClues = ({brainstorms}) => {
        let [idea, setIdea] = useState(  brainstorms[Math.floor(Math.random() * brainstorms.length)])
        let newIdea = () => {
            setIdea(brainstorms[Math.floor(Math.random() * brainstorms.length)])
        }
        return <div>
            <h2>Get Ideas: {brainstorms.length} available</h2>
            <p>{brainstorms.length == 0? "No Ideas available": idea}</p>
            <button disabled={brainstorms.length == 0} onClick={newIdea}>New Idea</button>

        </div>
}

let EditNarratives = ({narratives, setNarratives, grammar, user}) => {

    let [content, setContent] = useState(<div>Loading</div>)
    let setNarrative = (newNarrative, idx) => {
        nar = [...narratives]
        nar[idx] = newNarrative
        setNarratives(nar)
    }

    let narrativeEdits = narratives.map(async (nar, idx) => {
        let brainstorms = await getBrainStormIdeas(grammar[idx], user)
        let clueLogic = getClueLogic(grammar[idx])

        return <div key={idx}>
            <h1>Clue: {idx + 1}</h1>
            <h2>Editing Clue with base logic:</h2>
            <p>{clueLogic}</p>
            <GetClues brainstorms={brainstorms}/>
            <h2>Write Narrative</h2> 
            <textarea className={"scenarioInput"} value={narratives[idx]} onChange={(e)=> setNarrative(e.target.value, idx)} />

        </div>

    
    })

    Promise.all(narrativeEdits).then((values) => setContent(values))


    return <div className="clueList">
        <h1>Editing Narratives</h1>
        {content} 
        
    </div>


    
}

export default EditPuzzle = ({puzzleData, r, user}) => {

    let [key, setKey] = useState("key" in puzzleData? puzzleData["key"]: null)

    let puzzle = createPuzzle(puzzleData) 

    let [hints, setHints] = useState(puzzle.hints)

    let [scenario, setScenario] = useState(puzzle.scenarioText)
    let [title, setTitle] = useState(puzzle.title)

    let [playable, setPlayable] = useState(<div>Loading</div>)
    let [editNarrative, setEditNarrative] = useState(false)
    let [narratives, setNarratives] = useState("narratives" in puzzleData? puzzleData["narratives"] :  Array(puzzleData.hints.length).join(".").split("."))

    let getNewPuzzle = () =>{

        let newPuzzle = puzzleData
        newPuzzle.hints = hints 
        newPuzzle.scenario = scenario 
        newPuzzle.name = title 
        newPuzzle.narratives = narratives

        return newPuzzle


    }

    let updateButton = async () => {
        if (key != null && user != null){
            let newPuzzle = getNewPuzzle()

            let result = await update_puzzle(key, newPuzzle, user )

            if (result.data =="success"){
                alert("updated puzzle")
            }else{
                console.log(result)
                alert("An error occured")
            }
        }else{
            alert("Unable to update")
        }
    }

    let likeButton = async () => {
        if (user != null){
            let newPuzzle = getNewPuzzle() 

            let result = await like_puzzle( newPuzzle, user )

            if (result.status < 300){
               setKey(result.data["key"]) 
               alert("saved new puzzle")
            }else{
                console.log(result)
                alert("An error occured")
            }
        }else{
            alert("Unable to update")
        }
    }

    useEffect(()=>{
        p = puzzle 
        p.hints = hints 
        p.scenarioText = scenario
        p.title = title 
        setPlayable(<Puzzle className="playable" p={p}/>)
    }, [hints, scenario, title, narratives])
    let editHint =(i,newHint) => {
        let newHints = [...hints]
        newHints[i] = newHint
        setHints(newHints)
    }
    let content = ""
    if (!editNarrative){
        let editHints = hints.map((hint, i) => {
            return <li  key={i}><input value={hints[i]} onChange={(e) => editHint(i, e.target.value)}/> <div class="tooltip">See Logic
            <span class="tooltiptext">{getClueLogic(puzzleData.hint_grammar[i])}</span>
          </div> </li>})
        content  = <ol className="hintEditor">
                {editHints}
            </ol>

         
    }else{
        content= <EditNarratives narratives={narratives} setNarratives={setNarratives} grammar={puzzleData.hint_grammar} user={user}/> 
        
    }


    return <div className="editor">
    <button onClick={r}>Return</button>
    <button onClick={() => setEditNarrative(true)}>Edit Narrative</button>

    <h1> Editing Puzzle</h1>

    <h2>Edit Name</h2>
    <input className={"nameInput"} value={title} onChange={(e)=> setTitle(e.target.value)} />

    <h2>Edit Scenario Text</h2>
    <textarea className={"scenarioInput"} value={scenario} onChange={(e)=> setScenario(e.target.value)} />

    <h2>Edit Hints</h2>
    {content}

    <div>
        <button disabled={key==null} onClick={updateButton}>Update Puzzle</button>
        <button onClick={likeButton}>Save as New Puzzle</button>
    </div>

    {playable}
</div>

}