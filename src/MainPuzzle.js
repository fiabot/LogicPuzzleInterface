import { useState } from 'react';
import FinishButtons from "./EndPuzzleButtons";
import Hints from "./Hints";
import PuzzleGrid from "./PuzzleUtils";
import { isSolved, clearPuzzle } from "./PuzzleUtils";
import StateSelector from "./StateSelector";

export default MainPuzzle = ({ p, gridStr, setGridStr, time, hints, promptMode = "none" }) => {
    let [select, setSelect] = useState("O");
    let [strikes, setStrikes] = useState([]);
    let [instanceId, setInstanceId] = useState(null);
    let [puzzle, setPuzzle] = useState([[]])

    return (<div className="mainPuzzleContainer">
        <h1>Puzzle</h1>
        <div className="mainPuzzle">
            <div className="puzzleLeft" >
                <PuzzleGrid puzzleName={"main"} puzzle={puzzle} setPuzzle={setPuzzle} select={select} instanceId={instanceId} setInstanceId={setInstanceId} p={p} time={time} setGridStr={setGridStr} />
                <h3>Select Mark</h3>
                <StateSelector selected={select} setSelect={setSelect} />
            </div>
            <div className="puzzleRight">
                <Hints hints={p.hints} time={time} setStrikes={setStrikes} strikes={strikes} instanceId={instanceId} />
                <FinishButtons
                    submit={() => { recordAndSubmit() }}
                    isCorrect={() => isSolved(gridStr, p.solutionString)}
                    clearPuzzle={function () { clearPuzzle(puzzle, setPuzzle, strikes, setStrikes, instanceId, time) }}
                    puzzle={puzzle}
                    setPuzzle={setPuzzle}
                    instanceId={instanceId}
                    time={time}
                />
            </div>
        </div>
    </div>);
}