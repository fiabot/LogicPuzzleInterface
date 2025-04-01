import React, { useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getAvailableMoves } from "./API/GetFromApi";
import FinishButtons from "./EndPuzzleButtons";
import { addButtonPress, addCellChange, createGamePlayInstance } from "./Firestore/sendData";
import Hints from "./hints";
import "./narrative.css";
import StateSelector from "./stateSelector";
import SubGrid from "./subgrid";

ClueViewer = ({ clues, n, printable, black }) => {

    clues = clues.map((clue) => {
        paragraphs = clue.split("\n")
        paragraphs = paragraphs.map((p) => p == "" ? <br /> : <p>{p}</p>)
        return paragraphs
    })

    if (!printable) {
        [selectedClue, selectClue] = useState(0)


        let buttons = clues.map((ele, i) =>
            <button className={i == selectedClue ? "selected_n" : "unselected_n"} key={ele} onClick={() => selectClue(i)}>

                {i == 0 ? "Story" : "Clue " + i}

            </button>)




        return <div>
            <h1>{n}</h1>
            {buttons}
            <div className='clueBlock' >{clues[selectedClue]}</div>
        </div>
    } else {
        let block = clues.map((clue, i) => {
            return <div key={i}>
                <h1>{i == 0 ? n : "Clue " + i}</h1>
                <p>{clue}</p>
            </div>

        })

        return <div className={!printable || !black ? "hints" : "hintsBlack"}>
            {block}

        </div>
    }
}
function initializeSubGrid(numRows, numCols, puzzle, recordPuzzle) {
    let subgrid = []
    for (let i = 0; i < numRows; i++) {
        subgrid[i] = [];
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            let [state, setState] = useState("*")
            useEffect(() => {
                // run something every time name changes
                recordPuzzle()
            }, [state]);

            subgrid[i][j] = { state: state, setState: setState };
        }
    }

    return subgrid
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

const stateGridToArray = (puzzleDesc, stateGrid) => {
    let grid = {};
    for (const [I, subgridrow] of stateGrid.entries()) {
        let catI = puzzleDesc.leftRight[I].name
        for (const [J, subgrid] of subgridrow.entries()) {
            let catJ = puzzleDesc.topBottom[J].name
            let catKey = catI + ":" + catJ
            grid[catKey] = []
            for (const [i, row] of subgrid.entries()) {
                grid[catKey][i] = []
                for (const [j, cell] of row.entries()) {
                    grid[catKey][i][j] = cell.state
                }
            }
        }
    }
    console.log(grid)
    return grid
}

// Choose easiest next move, hint moves in order followed by grid-based moves
const chooseFromAvailableMoves = (available_moves) => {
    let best_move = available_moves[0];
    let best_idx = 100;
    let best_difficulty = 100;

    for (move of available_moves) {
        if (move["insights"]) {
            for (insight of move["insights"]) {
                // Only bother replacing the current best if the difficulty is <=
                if (insight["difficulty"] <= best_difficulty) {
                    best_difficulty = insight["difficulty"];
                    let move_idx = 100
                    if ("hint" in move) {
                        move_idx = move["hint"]["idx"];
                    }
                    // If the difficulty is <, replace in any case. Otherwise, only replace if the hint is earlier in the list
                    if (insight["difficulty"] < best_difficulty || move_idx < best_idx) {
                        best_move = move
                        best_hint = move["hint"]["idx"]
                    }
                }
            }
        }
    }
    return best_move
}

const showNextMove = async (puzzleDesc, stateGrid) => {
    let available_moves_info = await getAvailableMoves(puzzleDesc, stateGridToArray(puzzleDesc, stateGrid));
    let chosen_move = available_moves_info["available_moves"][0]
    
    if (!available_moves_info["is_valid"]) {
    }
    else {
        chosen_move = chooseFromAvailableMoves(available_moves_info["available_moves"]);
        result_grid = chosen_move["result"]["curr_grid"];
        setSuggestedGrid(puzzleDesc, stateGrid, result_grid);
    }
    if (result == null) {
        alert("Unable to retrieve suggested move")
    }
}

const setSuggestedGrid = (puzzleDesc, currGrid, suggestedGrid) => {
    for (const [R, leftCat] of puzzleDesc.topBottom.entries()) {
        for (const [C, topCat] of puzzleDesc.leftRight.entries()) {
            let key = topCat.name + ":" + leftCat.name
            if (suggestedGrid[key]) {
                let suggestedSubGrid = suggestedGrid[key]
                for (const [i, cellrow] of suggestedSubGrid.entries()) {
                    for (const [j, cell] of cellrow.entries()) {
                        if (cell != currGrid[R][C][i][j].state) {
                            currGrid[R][C][i][j].setState(cell)
                        }
                    } 
                }
            }
        }
    }
}

const recordPuzzle = (puzzle, solution, time, instanceId) => {
    let newTime = new Date()
    let ms = newTime - time
    //console.log("Time since start:" + ms)
    str = puzzleToString(puzzle)
    //console.log(str)
    //console.log(solution)
    let [correct, incorrect, total] = amountCorrect(puzzle, solution)
    //console.log("Correct: " + correct + ", incorrect: " + incorrect + ", total:" + total)
    //console.log("Is solved: " + isSolved(puzzle, solution));
    // addUserSolution(pid, str, correct, incorrect, isSolved)

    if (instanceId != null) {
        addCellChange(instanceId, ms, str, correct, incorrect, isSolved(puzzle, solution));

    }
}

let clearPuzzle = (puzzle, strikes, setStrikes, instanceId, time) => {
    addButtonPress(instanceId, time, "clear")
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
    let newStrikes = []
    for (i in strikes) {
        newStrikes.push(false);
    }

    setStrikes(newStrikes);

}

export default Puzzle = ({ p, time, concede, finish }) => {
    let puzzle = [[]];
    let displayGrid = [];
    let [select, setSelect] = useState("O");
    let displayRowIdx = 1;
    let [strikes, setStrikes] = useState([]);
    let [isCorrect, setCorrect] = useState(false);
    let [instanceId, setInstanceId] = useState(null);
    let [printable, setPrintable] = useState(false)
    let [black, setBlack] = useState(false)
    let [narrative, setNarrative] = useState(false)

    let ref = React.useRef(null)

    useEffect(() => {
        async function fetchData() {
            // You can await here
            createGamePlayInstance(p.num).then((data) => { setInstanceId(data); })


        }
        fetchData()
    }, []);

    let recordAndConcede = () => {
        let newTime = new Date()
        let ms = newTime - time
        addButtonPress(instanceId, ms, "concede");
        concede();
    }

    let recordAndSubmit = () => {
        let newTime = new Date()
        let ms = newTime - time
        addButtonPress(instanceId, ms, "submit");
        finish();
    }

    let rowLength = p.leftRight.length;
    for (let row = 0; row < p.topBottom.length; row++) {
        puzzle[row] = []
        let displayColIdx = 1;
        for (let col = 0; col < rowLength; col++) {
            let subgrid = initializeSubGrid(p.numEnt, p.numEnt, puzzle, () => { recordPuzzle(puzzle, p.solutionString, time, instanceId) });
            puzzle[row][col] = subgrid;

            topCat = null;
            leftCat = null;

            if (row == 0) {
                topCat = p.leftRight[col]
            }
            if (col == 0) {
                leftCat = p.topBottom[row]
            }
            displayGrid.push(<div style={{ gridRow: displayRowIdx, gridColumn: displayColIdx }} key={row + "," + col}><SubGrid numCols={p.numEnt} numRows={p.numEnt} cells={subgrid} select={select} topCat={topCat} leftCat={leftCat} /></div>);
            displayColIdx++;
        }
        rowLength--;
        displayRowIdx++;
    }

    /*useEffect(() => {
        // run something every time name changes
        recordPuzzle(puzzle, p.solutionString, time)
    }, [puzzle]);*/

    /*setInterval(() => {
      setTime( 1)
  }, 1000);*/
    const reactToPrintContent = () => {
        return ref.current;
    };

    //let [hints, setHints] = useState(<Hints hints={p.hints} time={time} setStrikes ={setStrikes} strikes={strikes}/>); 
    const reactToPrintFn = useReactToPrint({
        documentTitle: "SuperFileName"
    });


    return (<div className="printArea" ><div>

        {("narratives" in p && p["narratives"].length > 0) ? <button onClick={() => setNarrative(!narrative)}>{narrative ? "Show Logic" : "Show Narrative"}</button> : ""}
        <button onClick={() => setPrintable(!printable)}>{printable ? "Show Interactive" : "Show printable"}</button>


        {printable ? <button onClick={() => setBlack(!black)}>{black ? "Make Full Color" : "Make Black and White"}</button> : ""}
        {printable ? <button onClick={() => reactToPrintFn(reactToPrintContent)}>Save as PdF</button> : ""}

    </div>
        <div className={printable ? "printable" : "puzzleArea"} id={"divToPrint"} ref={ref}>
            <div className={printable ? "" : "puzzleLeft"}>

                {narrative ? <ClueViewer clues={[p.scenarioText].concat(p["narratives"])} n={p.title} printable={printable} black={black} /> :
                    <div className={!printable || !black ? "hints" : "hintsBlack"}>
                        <h1>{p.title}</h1>
                        <p>{p.scenarioText}</p>


                        <Hints hints={p.hints} time={time} setStrikes={setStrikes} strikes={strikes} instanceId={instanceId} printable={printable} />


                    </div>}
            </div>
            <div className={printable ? "printableRight" : "puzzleRight"}>
                <h1>Puzzle Grid</h1>
                <div className="puzzleGrid">
                    {displayGrid}
                </div>

                {!printable ? <div><h1>Select Mark</h1>
                    <StateSelector selected={select} setSelect={setSelect} /></div> : ""}

                {!printable ? <FinishButtons
                    giveUp={() => { recordAndConcede() }}
                    isCorrect={() => isSolved(puzzle, p.solutionString)}
                    clearPuzzle={function () { clearPuzzle(puzzle, strikes, setStrikes, instanceId, time) }}
                    showNextMove={function () { showNextMove(p, puzzle) }}
                    finish={() => { recordAndSubmit() }}
                    puzzle={puzzle}
                    instanceId={instanceId}
                    time={time}

                /> : ""}


            </div>

        </div>


    </div>);
}