import { useEffect, useState } from 'react';
import Hints from "./Hints";
import PuzzleGrid, { checkSolution, clearPuzzle, createPuzzle, puzzleToString, recordPuzzle } from './PuzzleUtils';
import StateSelector from "./StateSelector";
import { usePyodide } from './usePyodide';

export default TacticsPuzzle = ({ mainP, mainGridState, time, studyMode = "PERMANENT", struggling, setStruggling }) => {
    let tacticsSolved = []
    let [select, setSelect] = useState("O");
    let [strikes, setStrikes] = useState([]);
    let [instanceId, setInstanceId] = useState(null);
    let [gridState, setGridState] = useState([[]]);

    let [p, setP] = useState(null)
    let [currentTactic, setCurrentTactic] = useState(null)

    useEffect(() => {
        if (p && gridState.length > 0 && gridState[0].length > 0) {
            // run something every time something changes
            recordPuzzle(gridState, p.solutionString, time, instanceId)
        }
    }, [gridState]);

    const {
        pyodide,
        loading: pyodideLoading,
        error: pyodideError,
    } = usePyodide();

    useEffect(() => {
        if (mainP) {
            let categories = structuredClone(mainP.leftRight)
            categories.push(mainP.topBottom[0])
            const updateTacticsPuzzle = async () => {
                if (!pyodide) {
                    console.log("no pyodide...")
                    return
                }
                mainPuzzleGridStr = puzzleToString(mainGridState)
                try {
                    await pyodide.runPythonAsync(`
                        from pyodide.http import pyfetch
                        response = await pyfetch("../assets/logic_solver.py")
                        with open("logic_solver.py", "wb") as f:
                            f.write(await response.bytes())
                    `)
                    logic_solver = pyodide.pyimport("logic_solver");

                    const getAvailableTactics = logic_solver.get_available_tactics
                    const getPyGridStr = logic_solver.grid_str_to_grid_str
                    const genTacticPuzzle = logic_solver.gen_tactic_puzzle

                    let pyGridStr = getPyGridStr(mainPuzzleGridStr, JSON.stringify(categories))
                    let tactics = Array.from(getAvailableTactics(mainPuzzleGridStr, JSON.stringify(categories), JSON.stringify(mainP.hint_grammar)));
                    chosenTactic = null
                    for (tactic of tactics) {
                        if (!tacticsSolved.includes(tactic)) {
                            chosenTactic = tactic
                            break
                        }
                    }
                    if (chosenTactic == null) {
                        // Fallback to most complex solved.
                        chosenTactic = tactics[tactics.length - 1]
                    }
                    if (chosenTactic != currentTactic) {
                        setP(null)
                        setCurrentTactic(chosenTactic)
                        tactic_puzzle = JSON.parse(genTacticPuzzle(chosenTactic))
                        setP(createPuzzle(tactic_puzzle));
                        setGridState(tactic_puzzle.curr_state)
                        console.log(`Next tactic: ${chosenTactic}`)
                    }
                } catch (error) {
                    console.log(`Error running Python code: ${error}`);
                }
            };
            updateTacticsPuzzle()
            // TODO: when tactic is solved, add to tacticsSolved
        }
    }, [mainGridState, mainP, pyodide]);

    // Propagate main puzzle state to be used to select tactic problems.
    // Selecting which tactic:
    // If there are any errors in the puzzle state, select a tactic that would correct the error (if exists)
    // Otherwise, select the next easiest tactic (preferring one that has not already been solved), according to the puzzle with incorrect marks removed and cross-outs applied.
    // Record which tactic problems are supplied when, as well as the clicks on the tactics problems. 
    
    if (studyMode == "PERMANENT" || struggling) {
        if (!p || gridState.length == 0 || gridState[0].length == 0) {
            return (<div className='tacticsSidebar'>
                <h2>Mini Puzzle</h2>
                ...Loading
            </div>)
        } else {
            return (<div className='tacticsSidebar'>
                <h2>Mini Puzzle</h2>
                <p>Fill in as many cells as you can (the grid may not be complete).</p>
                <p><i><b>Warning: </b>This puzzle may change or disappear when changes are made to the main puzzle.</i></p>
                <Hints hints={p.hints} time={time} setStrikes={setStrikes} strikes={strikes} instanceId={instanceId} />
                <PuzzleGrid puzzleName={"tactics"} select={select} puzzle={gridState} setPuzzle={setGridState} instanceId={instanceId} setInstanceId={setInstanceId} p={p} time={time} />
                <h3>Select Mark</h3>
                <StateSelector selected={select} setSelect={setSelect} />
                <button onClick={() => clearPuzzle(gridState, setGridState, strikes, setStrikes, instanceId, time)}>Clear Grid</button>
                <button onClick={() => checkSolution(gridState, p.solutionString, setStruggling)}>Check Solution</button>
            </div>);
        }
    } else {
        return (<div className='tacticsSidebar' />)
    }
}