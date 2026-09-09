import { useState, useEffect } from 'react';
import FinishButtons from "./EndPuzzleButtons";
import Hints from "./Hints";
import PuzzleGrid from "./PuzzleUtils";
import StateSelector from "./StateSelector";
import { usePyodide } from './usePyodide';
import axios from 'axios';
import { createPuzzle } from './PuzzleManager';

export default TacticsPuzzle = ({ mainPuzzle, mainPuzzleGridStr, time, mainPuzzleHints, promptMode = "none" }) => {
    let tacticsSolved = []
    let [puzzle, setPuzzle] = useState([[]])
    let [select, setSelect] = useState("O");
    let [strikes, setStrikes] = useState([]);
    let [instanceId, setInstanceId] = useState(null);
    let [gridStr, setGridStr] = useState("")
    let [p, setP] = useState(null)
    let [hints, setHints] = useState(null)
    let [loading, setLoading] = useState(true)
    let [currentTactic, setCurrentTactic] = useState(null)

    let categories = structuredClone(mainPuzzle.leftRight)
    categories.push(mainPuzzle.topBottom[0])

    const {
        pyodide,
        loading: pyodideLoading,
        error: pyodideError,
    } = usePyodide();

    useEffect(() => {
        setLoading(true)
        const updateTacticsPuzzle = async () => {
            if (!mainPuzzleGridStr) {
                console.log("no main puzzle grid")
            } 
            if (!pyodide) {
                console.log("no pyodide...")
            }
            if (!mainPuzzleGridStr || !pyodide) return;
            console.log(`js grid str: ${mainPuzzleGridStr}`);
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

                let pyGridStr = getPyGridStr(mainPuzzleGridStr, JSON.stringify(categories))
                console.log(`py grid str: ${pyGridStr}`)
                let tactics = Array.from(getAvailableTactics(mainPuzzleGridStr, JSON.stringify(categories), JSON.stringify(mainPuzzleHints)));
                console.log(`py tactics: ${tactics}`)
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
                console.log(`choose tactic: ${chosenTactic}`)
                if (chosenTactic == currentTactic) {
                    setLoading(false)
                }
                else { 
                    console.log(`${currentTactic} != ${chosenTactic}`)
                    setCurrentTactic(chosenTactic)
                //     // axios.get(`puzzles/tactics_${chosenTactic}.json`)
                    axios.get("puzzles/help1.json")
                        .then(response => {
                            console.log("loaded puzzle")
                            setLoading(false)
                            setP(createPuzzle(response.data))
                        })
                        .catch((error) => {
                            console.log(error.message)
                        })
                }
            } catch (error) {
                console.log(`Error running Python code: ${error}`);
            }
        };
        updateTacticsPuzzle()
        // TODO: when tactic is solved, add to tacticsSolved
    }, [mainPuzzleGridStr, pyodide]);

    // Propagate main puzzle state to be used to select tactic problems.
    // Selecting which tactic:
    // If there are any errors in the puzzle state, select a tactic that would correct the error (if exists)
    // Otherwise, select the next easiest tactic (preferring one that has not already been solved), according to the puzzle with incorrect marks removed and cross-outs applied.
    // Record which tactic problems are supplied when, as well as the clicks on the tactics problems. 

    if (loading) {
        return (<div className='tacticsSidebar'>
            <h2>Mini Puzzle</h2>
            ...Loading
        </div>)
    } else {
        return (<div className='tacticsSidebar'>
            <h2>Mini Puzzle</h2>
            <Hints hints={p.hints} time={time} setStrikes={setStrikes} strikes={strikes} instanceId={instanceId} />
            <PuzzleGrid puzzleName={"tactics"} select={select} puzzle={puzzle} setPuzzle={setPuzzle} instanceId={instanceId} setInstanceId={setInstanceId} p={p} time={time} setGridStr={setGridStr} />
            <h3>Select Mark</h3>
            <StateSelector selected={select} setSelect={setSelect} />
            <FinishButtons
                submit={() => { recordAndSubmit() }}
                isCorrect={() => isSolved(gridStr, p.solutionString)}
                clearPuzzle={function () { clearPuzzle(puzzle, setPuzzle, strikes, setStrikes, instanceId, time) }}
                puzzle={puzzle}
                setPuzzle={setPuzzle}
                instanceId={instanceId}
                time={time}
            />
        </div>);
    }
}