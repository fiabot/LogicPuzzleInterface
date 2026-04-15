import { useEffect, useState } from "react";
import FinishButtons from "./EndPuzzleButtons";
import Hints from "./hints";
import StateSelector from "./stateSelector";
import SubGrid from "./subgrid";


import { add_click } from "./API/SendToApi";

function initializeSubGrid(numRows, numCols, puzzle, recordPuzzle, trueState=false, user, sessiomId, sessionStart ) {
    let subgrid = []
    for (let i = 0; i < numRows; i++) {
        subgrid[i] = [];
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            let [state, setState] = useState("*")
            let [ts, setTrueState] = useState("*")
            useEffect(() => {
                // run something every time name changes
                recordPuzzle()
            }, [state]);
            
            subgrid[i][j] = { state: state, setState: setState, trueState:ts, setTrueState:setTrueState };
            
            
        }
    }

    return subgrid
}

const addSolutionToRow= (row, solution, startingIndex) => {
    let index = startingIndex


    for (let c = 0; c < row[0][0].length * row.length + row.length + 1; c++) {
        index += 1

    }
    index += 1

    for (let r = 0; r < row[0].length; r++) {
        index += 1 
        for (let subgrid = 0; subgrid < row.length; subgrid++) {
            for (let c = 0; c < row[subgrid][0].length; c++) {
                if (solution!= null){
                    row[subgrid][r][c].setTrueState(solution[index])
                }
                
                index += 1 
            }

            index += 1 
        }
        index += 1 
    }



    return index
}

const addSolutionToPuzzle = (puzzle, solution) => {

    index = 0 
    for (let row = 0; row < puzzle.length; row++) {
        index = addSolutionToRow(puzzle[row], solution, index)
        
    }
    
}

const rowToString = (row, isFirst = false) => {
    let str = ""

    for (let c = 0; c < row[0][0].length * row.length + row.length + 1; c++) {
        str += "-"

    }
    str += "\n"

    for (let r = 0; r < row[0].length; r++) {
        str += "|"
        for (let subgrid = 0; subgrid < row.length; subgrid++) {
            for (let c = 0; c < row[subgrid][0].length; c++) {
                str += row[subgrid][r][c].state
            }

            str += "|"
        }
        str += "\n"
    }



    return str
}

const puzzleToString = (puzzle) => {
    str = ""
    for (let row = 0; row < puzzle.length; row++) {
        str += rowToString(puzzle[row], isFirst = row == 0)
    }
    return str
}

const amountCorrect = (puzzle, solution) => {
    let gameState = puzzleToString(puzzle)

    if (gameState.length != solution.length) {
        console.log("Incorrect formatting for puzzle")
        console.log(gameState)
        console.log(solution)
        return [0, 0, 0]
    } else {
        let correct = 0
        let incorrect = 0
        let total = 0
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] == "X" || gameState[i] == "O") {
                total++;
                if (gameState[i] == solution[i]) {
                    correct++;
                } else {
                    incorrect++
                }
            } else if (gameState[i] == "*" || gameState[i] == "!" || gameState[i] == "?") {
                total++
            }
        }

        return [correct, incorrect, total]
    }
}

const isSolved = (puzzle, solution) => {
    let gameState = puzzleToString(puzzle)
    let [correct, incorrect, total] = amountCorrect(puzzle, solution)

    if (gameState.length != solution.length) {
        console.log("Incorrect formatting for puzzle")
        console.log(gameState)
        console.log(solution)
        return [0, 0]
    } else {
        let correct = 0;
        let total = 0
        for (let i = 0; i < gameState.length; i++) {
            if (solution[i] == "O") {
                total++
                if (solution[i] == gameState[i]) {
                    correct++;
                }
            }
        }
        return total == correct && incorrect == 0
    }
}

const recordPuzzle = (puzzle, solution, play, user, sessionId, sessionStart) => {
    if(solution != null){
        let mode = play? "Play":  "Reveal"
        str = puzzleToString(puzzle)
        add_click(user, sessionId, "Puzzle grid click", sessionStart, {"mode": mode, "Puzzle": str})
    }
    

 
    
}

let clearPuzzle = (puzzle) => {
    for (row of puzzle) {
        for (subgrid of row) {
            for (let i = 0; i < subgrid.length; i++) {
                for (
                    let j = 0;
                    j < subgrid[i].length;
                    j++
                ) {
                    subgrid[i][j].setState("*");
                }
            }
        }

    }

    
}


let CheckSolution = ({puzzle, solution}) => {
    let [content, setContent] = useState("")

    useEffect(()=> 
    {
        setContent("")
    }, [puzzle])


    let check = () => {
        if (isSolved(puzzle, solution)){
            setContent(<p>The solution is correct</p>)
        }else{
            setContent(<p>One or more marks is missing or incorrect</p>)
        }
    }

    return <div>
        <button disabled={solution == null} onClick={check}>Check Solution</button>
        {content}

    </div>
}


export default Puzzle =({p, solution,user, sessionId, sessionStart})=>{
    let puzzle = [[]];
    let [play, setPlay] = useState(true)
    let displayGrid = [];
    let [select, setSelect] = useState("O");
    let displayRowIdx = 1;
    let rowLength = p.leftRight.length;
  

   
    for (let row = 0; row < p.topBottom.length; row++) {
        puzzle[row] = []
        let displayColIdx = 1;
        for (let col = 0; col < rowLength; col++) {
            let subgrid = initializeSubGrid(p.numEnt, p.numEnt, puzzle, ()=>{recordPuzzle(puzzle, solution, play, user, sessionId, sessionStart)}, trueState=true);
            puzzle[row][col] = subgrid;

            topCat = null;
            leftCat = null;

            if (row == 0) {
                topCat = p.leftRight[col]
            }
            if (col == 0) {
                leftCat = p.topBottom[row]
            }
            displayGrid.push(<div style={{ gridRow: displayRowIdx, gridColumn: displayColIdx }} key={row + "," + col}><SubGrid numCols={p.numEnt} numRows={p.numEnt} cells={subgrid} select={select} topCat={topCat} leftCat={leftCat} reveal={!play}/></div>);
            displayColIdx++;
        }
        rowLength--;
        displayRowIdx++;
    }

    useEffect(()=>{

        if (solution != null){
            console.log("solution1")
            console.log(solution)
            addSolutionToPuzzle(puzzle, solution)
        }

    }, [solution])


    let clear = () => {
        add_click(user, sessionId, "Clear Puzzle", sessionStart)
        clearPuzzle(puzzle)
    }


    let playContent = <div>
        <h2>Select Mark</h2>
        <StateSelector selected={select} setSelect={setSelect} />
        <CheckSolution puzzle={puzzle} solution={solution}/>
        <button onClick={clear}>Clear</button>
    </div>
    
    let revealContent = <div>
        <p>Click anywhere on the grid to reveal the solution</p>
        <button onClick={clear}>Clear</button>
    </div>


    return (<div>
        <div className="puzzleArea">
        <div className="puzzleRight">
            <div className="puzzleGrid">
                {displayGrid}
            </div>  
     
        
        </div>


    </div>


    <div>
        {solution != null?  <div><input   onClick={()=>{clear();setPlay(!play); add_click(user, sessionId, play? "Set mode to play": "Set mode to reveal", sessionStart)}}  checked={play} type="checkbox" className="toggleCheckbox" id="playToggle"/>
      <label for="playToggle" className="toggleButton">
      <div>Reveal</div> 
        <div>Play</div> 
      </label></div> : <p>Select a puzzle to play or show solution</p>}

      {solution && (play? playContent : revealContent)}
        </div>
        </div>);
}