import { useEffect, useState } from "react";
import FinishButtons from "./EndPuzzleButtons";
import Hints from "./hints";
import StateSelector from "./stateSelector";
import SubGrid from "./subgrid";
import { createGamePlayInstance, addCellChange, addButtonPress } from "./Firestore/sendData";

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

const recordPuzzle = (puzzle, solution) => {

    str = puzzleToString(puzzle)

    let [correct, incorrect, total] = amountCorrect(puzzle, solution)
 

 
    
}

let clearPuzzle = (puzzle, strikes, setStrikes) => {
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
    for(i in strikes){
        newStrikes.push(false); 
    }

    setStrikes(newStrikes);
    
}

export default Puzzle =({p})=>{
    let puzzle = [[]];
    let displayGrid = [];
    let [select, setSelect] = useState("O");
    let displayRowIdx = 1;
    let rowLength = p.leftRight.length;
    let [strikes, setStrikes] = useState([]);
    let [isCorrect, setCorrect] = useState(false);
    let [instanceId, setInstanceId] = useState(null); 


   
    for (let row = 0; row < p.topBottom.length; row++) {
        puzzle[row] = []
        let displayColIdx = 1;
        for (let col = 0; col < rowLength; col++) {
            let subgrid = initializeSubGrid(p.numEnt, p.numEnt, puzzle, ()=>{recordPuzzle(puzzle, p.solutionString)});
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

  


    return (<div className="puzzleArea">
        <div className="puzzleLeft">
            <div className="puzzleGrid">
                {displayGrid}
            </div>

            <h2>Select Mark</h2>
            <StateSelector selected={select} setSelect={setSelect} />
        </div>
        <div className="puzzleRight">
            <Hints hints={p.hints} time={0} setStrikes ={setStrikes} strikes={strikes} instanceId={instanceId}/>
            <FinishButtons 
                giveUp={() => {console.log("concede")}}
                isCorrect = {() => isSolved(puzzle, p.solutionString)}
                clearPuzzle = {function () {clearPuzzle(puzzle,strikes, setStrikes)}}
                finish = {() => {console.log("finish")}}
                puzzle={puzzle}
                instanceId={instanceId}
                time={0}

            />
        </div>
    </div>);
}