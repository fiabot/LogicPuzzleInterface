import { useEffect, useState } from "react"
import Puzzle from "./puzzle"
import { createPuzzle } from "./puzzleModel"
import "./AuthoringStyle.css"
import { update_puzzle, like_puzzle } from "./API/SendToApi"
import "./narrative.css";
import { getBrainStormIdeas, getClueLogic } from "./utils"
import { add_click } from "./API/SendToApi"
import { sanitize } from "./utils"


let GetClues = ({brainstorms, setNarrative, sessionStart, sessionId}) => {
        let [idea, setIdea] = useState("")
        let newIdea = () => {
            add_click(sessionId, "get brainstorm", sessionStart)
            setIdea(brainstorms[Math.floor(Math.random() * brainstorms.length)])
        }

        let setAsNar= () => {
            add_click(sessionId, "copy narrative", sessionStart)
            setNarrative(idea)
        }
        return <div>
            <h2>Get Ideas: {brainstorms.length} available</h2>
            <p>{brainstorms.length == 0? "No Ideas available": idea}</p>
            <button disabled={brainstorms.length == 0} onClick={newIdea}>New Idea</button>
            <button disabled={brainstorms.length == 0 || idea == ""} onClick={setAsNar}>Set as narrative</button>

        </div>
}

let EditNarratives = ({narratives, setNarratives, grammar, user, sessionId, sessionStart}) => {

    let [content, setContent] = useState(<div>Loading</div>)
    let [brainstorms, setbrainstorms] = useState(new Array(narratives.length).fill([]))
    let setNarrative = (newNarrative, idx) => {
        nar = [...narratives]
        nar[idx] = newNarrative
        setNarratives(nar)
    }

    useEffect(() => {
        all_brains = narratives.map(async (nar, idx) => {
            return await getBrainStormIdeas(grammar[idx], user)
        }); 

        Promise.all(all_brains).then((values) => setbrainstorms(values))
    }, [])

    //let brainstorms = 

    let narrativeEdits = narratives.map((nar, idx) => {
        
        let clueLogic = getClueLogic(grammar[idx])

        return <div key={idx}>
            <h1>Clue: {idx + 1}</h1>
            <h2>Editing Clue with base logic:</h2>
            <p>{clueLogic}</p>
            <GetClues brainstorms={brainstorms[idx]} setNarrative={(v) => setNarrative(v, idx)} sessionId={sessionId} sessionStart={sessionStart}/>
            <h2>Write Narrative</h2> 
            <textarea className={"scenarioInput"}  value={nar}  onChange={(e)=> setNarrative(e.target.value, idx)} onClick={() => add_click(sessionId, "edit narrative", sessionStart)} />

        </div>

    
    })

    //Promise.all(narrativeEdits).then((values) => setContent(values))


    return <div className="clueList">
        <h1>Editing Narratives</h1>
        {narrativeEdits} 
        
    </div>


    
}

export default EditPuzzle = ({puzzleData, setPlayable, r, user, sessionId, sessionStart, evolveId}) => {
 

    let [key, setKey] = useState("idx" in puzzleData? puzzleData["idx"]: null)

    let puzzle = createPuzzle(puzzleData) 

    let [hints, setHints] = useState(puzzle.hints)

    let [scenario, setScenario] = useState(puzzle.scenarioText)
    let [title, setTitle] = useState(puzzle.title)

    let [editNarrative, setEditNarrative] = useState(false)
    let [narratives, setNarratives] = useState("narratives" in puzzleData? puzzleData["narratives"] :  Array(puzzleData.hints.length).join(".").split("."))

    let getNewPuzzle = () =>{

        let newPuzzle = puzzleData
        newPuzzle.hints = hints.map(sanitize) 
        newPuzzle.scenario = sanitize(scenario)  
        newPuzzle.name = sanitize(title) 
        newPuzzle.narratives = narratives.map(sanitize)

        return newPuzzle


    }

    let updateButton = async () => {
        if (key != null && user != null){
            let newPuzzle = getNewPuzzle()

            let result = await update_puzzle(key, newPuzzle, user,evolveId )

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

            let result = await like_puzzle( newPuzzle, user, evolveId )

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
        let newPuzzle = getNewPuzzle()
        setPlayable(newPuzzle)
    }, [hints, scenario, title, narratives])
    let editHint =(i,newHint) => {
        let newHints = [...hints]
        newHints[i] = newHint
        setHints(newHints)
    }
    let content = ""
    if (!editNarrative){
        let editHints = hints.map((hint, i) => {
            return <li  key={i}><input value={hints[i]} onClick={() => add_click(user,sessionId, "edit hint", sessionStart)} onChange={(e) => editHint(i, e.target.value)}/> <div class="tooltip">See Logic
            <span class="tooltiptext">{getClueLogic(puzzleData.hint_grammar[i])}</span>
          </div> </li>})
        content  = <ol className="hintEditor">
                {editHints}
            </ol>

         
    }else{
        content= <EditNarratives narratives={narratives} setNarratives={setNarratives} grammar={puzzleData.hint_grammar} user={user} sessionStart={sessionStart} sessionId={sessionId}/> 
        
    }


    return <div className="editor">
    {r!= null? <button onClick={r}>Return</button>: ""}

    <input  onClick={()=> setEditNarrative(!editNarrative)} checked={editNarrative} type="checkbox" className="toggleCheckbox" id="narToggle"/>
      <label for="narToggle" className="toggleButton">
      <div>Logic Hints</div> 
        <div>Narrative</div> 
      </label>

    <h1> Editing Puzzle</h1>

    <h2>Edit Name</h2>
    <input className={"nameInput"} value={title} onChange={(e)=> setTitle(e.target.value)} />

    <h2>Edit Scenario Text</h2>
    <textarea className={"scenarioInput"} value={scenario} onClick={() => add_click(user, sessionId, "edit narrative")} onChange={(e)=> setScenario(e.target.value)} />

    <h2>Edit Hints</h2>
    {content}

    <div>
        <button disabled={key==null} onClick={updateButton}>Update Puzzle</button>
        <button onClick={likeButton}>Save as New Puzzle</button>
    </div>

</div>

}