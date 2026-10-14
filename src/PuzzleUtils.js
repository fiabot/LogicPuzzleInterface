import { useEffect, useState } from 'react';
import { createGamePlayInstance } from './Firestore/sendData';
import SubGrid from "./SubGrid";
import Category from "./categoryModel";
import PuzzleModel from "./puzzleModel";
import { addButtonPress } from './Firestore/sendData';

import axios from 'axios';
export function loadPuzzle(file, setP) {
    axios.get(file)
        .then(response => {
            setP(createPuzzle(response.data));
        });
}

function initializeSubGrid(numRows, numCols) {
    let subgrid = []
    for (let i = 0; i < numRows; i++) {
        subgrid[i] = [];
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            // let [state, setState] = useState("*")

            // subgrid[i][j] = { state: state, setState: setState };
            subgrid[i][j] = "*"
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
                str += row[subgrid][r][c]
            }

            str += "|"
        }
        str += "\n"
    }



    return str
}

export const puzzleToString = (puzzle) => {
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

export const checkSolution = (puzzle, solution, setStruggling) => {
    gameState = puzzleToString(puzzle)
    if (gameState.length != solution.length) {
        console.log("Incorrect formatting for puzzle")
        console.log(gameState)
        console.log(solution)
        return [0, 0, 0]
    } 
    let correct = 0
    let incorrect = 0
    let todo = 0
    console.log(solution)
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] == "X" || gameState[i] == "O") {
            if (gameState[i] == solution[i]) {
                correct++;
            } else {
                incorrect++
            }
        } else if (solution[i] == "X" || solution[i] == "O") {
            todo++
        }
    }

    if (incorrect + todo == 0) {
        // The solution is complete and correct
        setStruggling(false);
        alert("Your solution is correct!")
    } else if (incorrect > 0) {
        // There is at least one mistake
        alert("There is at least one mistake in your solution.")
    } else {
        // There are no mistakes, but there are still deductions to be made
        alert("Your answers so far are correct, but there is more to discover.")
    }
    return [correct, incorrect, todo]
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

export const recordPuzzle = (puzzle, solution, time, instanceId) => {
    let newTime = new Date()
    let ms = newTime - time
    gridStr = puzzleToString(puzzle)
    let [correct, incorrect, total] = amountCorrect(gridStr, solution)

    if (instanceId != null) {
        addCellChange(instanceId, ms, str, correct, incorrect, isSolved(gridStr, solution));
    }
}

export const clearPuzzle = (puzzle, setPuzzle, strikes, setStrikes, instanceId, time) => {
    addButtonPress(instanceId, time, "clear")
    updatePuzzle = JSON.parse(JSON.stringify(puzzle));
    for (row of updatePuzzle) {
        for (subgrid of row) {
            for (let i = 0; i < subgrid.length; i++) {
                for (
                    let j = 0;
                    j < subgrid[i].length;
                    j++
                ) {
                    subgrid[i][j] = "*";
                }
            }
        }

    }
    let newStrikes = []
    for (i in strikes) {
        newStrikes.push(false);
    }

    setStrikes(newStrikes);
    setPuzzle(updatePuzzle);
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
    return grid
}

export function createPuzzle(data) {
    let categories = []
    for (cat in data.categories) {
        cat = data.categories[cat]
        categories.push(new Category(cat.name, cat.entities))
    }

    return new PuzzleModel(categories, data.hints, data.hint_grammar, data.solution, data.id)
}

export const initializePuzzle = (p) => {
    puzzle = [[]]
    let rowLength = p.leftRight.length;
    for (let row = 0; row < p.topBottom.length; row++) {
        puzzle[row] = []
        for (let col = 0; col < rowLength; col++) {
            let subgrid = initializeSubGrid(p.numEnt, p.numEnt);
            puzzle[row][col] = subgrid;
        }
        rowLength--;
    }
    return puzzle
}

export const recordAndSubmit = (instanceId, time, finish) => {
    console.log("FINAL FIN???")
    console.log(finish)
    let newTime = new Date()
    let ms = newTime - time
    addButtonPress(instanceId, ms, "submit");
    finish();
}

export default PuzzleGrid = ({ puzzleName, puzzle, setPuzzle, select, instanceId, setInstanceId, p, time }) => {
    let displayGrid = [];
    let displayRowIdx = 1;
    let [isCorrect, setCorrect] = useState(false);

    let getCurGrid = () => {
        return stateGridToArray(p, puzzle)
    }

    useEffect(() => {
        async function fetchData() {
            // You can await here
            createGamePlayInstance(p.num).then((data) => { setInstanceId(data); })
        } fetchData()
    }, [p]);

    let rowLength = p.leftRight.length;
    for (let row = 0; row < p.topBottom.length; row++) {
        let displayColIdx = 1;
        for (let col = 0; col < rowLength; col++) {
            subgrid = puzzle[row][col]

            topCat = null;
            leftCat = null;

            if (row == 0) {
                topCat = p.leftRight[col]
            }
            if (col == 0) {
                leftCat = p.topBottom[row]
            }
            displayGrid.push(<div style={{ gridRow: displayRowIdx, gridColumn: displayColIdx }} key={row + "," + col}><SubGrid puzzleName={puzzleName} puzzle={puzzle} setPuzzle={setPuzzle} row={row} col={col} numCols={p.numEnt} numRows={p.numEnt} cells={subgrid} select={select} topCat={topCat} leftCat={leftCat} /></div>);
            displayColIdx++;
        }
        rowLength--;
        displayRowIdx++;
    }
    
    return (<div className="puzzleGrid">{displayGrid}</div>);
}

