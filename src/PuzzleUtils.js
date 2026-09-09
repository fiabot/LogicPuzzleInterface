import { useEffect, useState } from 'react';
import { createGamePlayInstance } from './Firestore/sendData';
import SubGrid from "./SubGrid";

function initializeSubGrid(numRows, numCols, recordPuzzle) {
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
                // run something every time something changes
                recordPuzzle()
            }, [state]);

            subgrid[i][j] = { state: state, setState: setState };
        }
    }

    return subgrid
}

const rowToString = (row, isFirst = false) => {
    if (!row || !row[0]) {
        return ""
    }
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
    if (!puzzle) {
        return ""
    }
    str = ""
    for (let row = 0; row < puzzle.length; row++) {
        str += rowToString(puzzle[row], isFirst = row == 0)
    }
    return str
}

const amountCorrect = (gameState, solution) => {
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

const isSolved = (gameState, solution) => {
    let [correct, incorrect, total] = amountCorrect(gameState, solution)

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

const recordPuzzle = (puzzle, setGridStr, solution, time, instanceId) => {
    let newTime = new Date()
    let ms = newTime - time
    gridStr = puzzleToString(puzzle)
    console.log(`updating grid str - ${gridStr}`)
    setGridStr(gridStr)
    let [correct, incorrect, total] = amountCorrect(gridStr, solution)

    if (instanceId != null) {
        addCellChange(instanceId, ms, str, correct, incorrect, isSolved(gridStr, solution));
    }
}

let clearPuzzle = (puzzle, setPuzzle, strikes, setStrikes, instanceId, time) => {
    addButtonPress(instanceId, time, "clear")
    updatePuzzle = puzzle
    for (row of updatePuzzle) {
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
    setPuzzle(updatePuzzle)
}


const cleanState = (state) => {
    if (state == "!" || state == "?") {
        return "*"
    }
    if (state == "x") {
        return "X"
    }
    if (state == "o") {
        return "O"
    }
    return state
}
const stateGridToArray = (puzzleDesc, stateGrid) => {
    let grid = {};
    for (const [I, subgridrow] of stateGrid.entries()) {
        let catI = puzzleDesc.topBottom[I].name
        for (const [J, subgrid] of subgridrow.entries()) {
            let catJ = puzzleDesc.leftRight[J].name
            let catKey = catJ + ":" + catI
            grid[catKey] = []
            for (const [i, row] of subgrid.entries()) {
                grid[catKey][i] = []
                for (const [j, cell] of row.entries()) {
                    grid[catKey][i][j] = cleanState(cell.state)
                }
            }
        }
    }
    console.log(grid)
    return grid
}

export default PuzzleGrid = ({ puzzleName, puzzle, setPuzzle, select, instanceId, setInstanceId, p, setGridStr, time }) => {
    console.log(`puzzle is now ${puzzleToString(puzzle)}`)
    let displayGrid = [];
    let displayRowIdx = 1;
    let rowLength = p.leftRight.length;
    let [isCorrect, setCorrect] = useState(false);

    let getCurGrid = () => {
        return stateGridToArray(p, puzzle)
    }

    useEffect(() => {
        async function fetchData() {
            // You can await here
            createGamePlayInstance(p.num).then((data) => { setInstanceId(data); })
        } fetchData()
    }, []);

    let recordAndSubmit = () => {
        let newTime = new Date()
        let ms = newTime - time
        addButtonPress(instanceId, ms, "submit");
        finish();
    }

    updatedPuzzle = puzzle
    for (let row = 0; row < p.topBottom.length; row++) {
        updatedPuzzle[row] = []
        let displayColIdx = 1;
        for (let col = 0; col < rowLength; col++) {
            let subgrid = initializeSubGrid(p.numEnt, p.numEnt, () => { recordPuzzle(puzzle, setGridStr, p.solutionString, time, instanceId) });
            updatedPuzzle[row][col] = subgrid;

            topCat = null;
            leftCat = null;

            if (row == 0) {
                topCat = p.leftRight[col]
            }
            if (col == 0) {
                leftCat = p.topBottom[row]
            }
            displayGrid.push(<div style={{ gridRow: displayRowIdx, gridColumn: displayColIdx }} key={row + "," + col}><SubGrid puzzleName={puzzleName} numCols={p.numEnt} numRows={p.numEnt} cells={subgrid} select={select} topCat={topCat} leftCat={leftCat} /></div>);
            displayColIdx++;
        }
        rowLength--;
        displayRowIdx++;
    }
    setPuzzle(updatedPuzzle)

    return (<div className="puzzleGrid">{displayGrid}</div>);
}

