import { useState } from "react";
import MainPuzzle from "./MainPuzzle";
import { loadPuzzle } from "./PuzzleUtils";
import TacticsPuzzle from "./TacticsPuzzle";

export default Puzzle = ({ file, studyMode = "PERMANENT", finish }) => {
    let [mainP, setMainP] = useState(null)
    let [mainGridState, setMainGridState] = useState([[]])
    let [struggling, setStruggling] = useState(false)
    if (file && !mainP) {
        loadPuzzle(file, setMainP)
    }
    let time = new Date()
    studyMode = "FORCED"
    timeout = 10
    return (
        <div className="puzzleArea">
            <MainPuzzle p={mainP} gridState={mainGridState} setGridState={setMainGridState} time={time} timeout={timeout} studyMode={studyMode} finish={finish} struggling={struggling} setStruggling={setStruggling} />
            <TacticsPuzzle mainP={mainP} mainGridState={mainGridState} time={time} studyMode={studyMode} struggling={struggling} setStruggling={setStruggling} />
        </div>);
}