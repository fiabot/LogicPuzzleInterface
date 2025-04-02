import { useState } from "react"
import SelectedPuzzle from "./SelectedPuzzle"
import { add_click } from "./API/SendToApi"

let Persona = ({puzzles, filter, selectFunction, title, description, sessionId, sessionStart}) => {
    if (puzzles.length > 0){
        let sorted = puzzles.slice()

    sorted.sort(filter)

    let puzzle = sorted[0]


    
        
    return <div className="persona"> <div className='puzzleListElement'>
        <h2>{"name" in puzzle? puzzle["name"] : "Untitled Puzzle" }</h2>
        <h3>Difficulty: {puzzle.diff}</h3>
        <h3>Hints</h3>
        <ol className='hintList'>
        {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
        </ol>
        
        
        </div>

        <div>
            <h1>{title}</h1>
            <p>{description}</p>
        <button onClick={()=> selectFunction(puzzle)}>Select</button>
        </div>

        </div>
    }else{
        return <div>Loading</div>
    }
    
    
}

let numberOfHintKinds = (puzzle) => {
    let found = {}

    puzzle.hint_grammar.forEach((h) => {
        let kind = Object.keys(h)[0]

        found[kind] = 1 
    })

    
    return Object.keys(found).length
}


export default PersonaArea = ({puzzles, user, appMode, sessionId, sessionStart}) => {

    let [mode, setMode] = useState("personas")
    let [selected, setSelected] = useState(null)

    let selectFun = (puzzle) => {
        add_click(sessionId, "select recommendation", sessionStart); 
        setMode("selected"); 
        setSelected(puzzle)
    }

    let r = () => {
        setMode("personas")
    }
 
    let challengeFilter = (a,b ) => {return b.diff - a.diff}

    let challengePersona = <Persona puzzles={puzzles}  filter={challengeFilter} selectFunction={selectFun} title="Logistician" description="This is the hardest puzzle I could find." /> 

    let minimalFilter = (a, b) => {
        if (a.diff == b.diff) {
            return a.hints.length - b.hints.length 
        }else{
            return a.diff - b.diff
        }
    }

    let minPersona = <Persona puzzles={puzzles}  filter={minimalFilter} selectFunction={selectFun} title="Minimalist" description="This is the simplest puzzle I could find." /> 

    let explorerFilter = (a, b) => {
       return numberOfHintKinds(b) - numberOfHintKinds(a)
    }

    let explorerPersona = <Persona puzzles={puzzles}  filter={explorerFilter} selectFunction={selectFun} title="Exploreer" description="This puzzle has the most different kind of hints." /> 


    if (mode == "personas") {
        return <div className="personaArea">
            {challengePersona}
            {minPersona}
            {explorerPersona}
        </div>
    }else{
        return <SelectedPuzzle puzzle={selected} setPuzzle={setSelected} user={user} r={() => setMode("personas")} appMode={appMode} otherPuzzles={puzzles} sessionId={sessionId} sessionStart={sessionStart}/> 
    }


}