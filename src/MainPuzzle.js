import { useEffect, useState } from 'react';
import Hints from "./Hints";
import PuzzleGrid, { clearPuzzle, initializePuzzle, recordAndSubmit, recordPuzzle } from "./PuzzleUtils";
import StateSelector from "./StateSelector";
import { useInterval } from './useInterval';

export default MainPuzzle = ({ p, gridState, setGridState, time, timeout=10, finish, studyMode, struggling, setStruggling }) => {
    let [select, setSelect] = useState("O");
    let [strikes, setStrikes] = useState([]);
    let [instanceId, setInstanceId] = useState(null);
    let [idleTime, setIdleTime] = useState("O");
    useInterval(() => {
        // Your custom logic here
        setIdleTime(idleTime + 1);
        if (idleTime > timeout) {
            setStruggling(true);
        }
    }, 1000);
    useEffect(() => {
        if (p) {
            setGridState(initializePuzzle(p))
        }
    }, [p])
    useEffect(() => {
        // run something every time something changes
        if (p && gridState.length > 0 && gridState[0].length > 0) {
            recordPuzzle(gridState, p.solutionString, time, instanceId)
        }
        setIdleTime(0);
        setStruggling(false);
    }, [gridState]);
    useEffect(() => {
        if (!struggling) {
            setIdleTime(0);
        }
    }, [struggling])

    disabled = (studyMode == "FORCED" && struggling)
    if (p && gridState.length > 0 && gridState[0].length > 0) {
        return (<div disabled={disabled} style={{opacity: disabled? ".5": "1", pointerEvents: disabled? "none" : "auto"}} className="mainPuzzleContainer">
            <h1>Puzzle</h1>
            <p>Fill in the grid!</p>
            <div className="mainPuzzle">
                <div className="puzzleLeft" >
                    <PuzzleGrid puzzleName={"main"} puzzle={gridState} setPuzzle={setGridState} select={select} instanceId={instanceId} setInstanceId={setInstanceId} p={p} time={time} />
                    <h3>Select Mark</h3>
                    <StateSelector selected={select} setSelect={setSelect} />
                </div>
                <div className="puzzleRight">
                    <Hints hints={p.hints} time={time} setStrikes={setStrikes} strikes={strikes} instanceId={instanceId} />
                    <button onClick={() => clearPuzzle(gridState, setGridState, strikes, setStrikes, instanceId, time)}>Clear Grid</button>
                    <br />
                    <button onClick={() => recordAndSubmit(instanceId, time, finish)}>Finish</button>
                    <br />
                    {studyMode == "REQUESTED" &&
                        <button onClick={() => setStruggling(true)}>Request Help</button>
                    }
                </div>
            </div>
        </div>);
    } else {
        return (<div className="mainPuzzleContainer">
            Loading...
        </div>)
    }
}