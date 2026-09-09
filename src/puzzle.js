import TacticsPuzzle from "./TacticsPuzzle";
import MainPuzzle from "./MainPuzzle"
import { useState } from "react";

export default Puzzle =({p, concede, finish, puzzleDesc, hints, promptMode="none"})=>{
    let [mainPuzzleGridStr, setMainPuzzleGridStr] = useState("")
    let time = new Date()
    return (
    <div className="puzzleArea">
        <MainPuzzle p={p} hints={hints} gridStr={mainPuzzleGridStr} setGridStr={setMainPuzzleGridStr} time={time} promptMode={promptMode}/>
        <TacticsPuzzle mainPuzzle={p} mainPuzzleGridStr={mainPuzzleGridStr} mainPuzzleHints={hints} time={time} promptMode={promptMode} concede={() => {}}/>
    </div>);
}