import TacticsPuzzle from "./TacticsPuzzle";
import MainPuzzle from "./MainPuzzle"

export default Puzzle =({p, time, concede, finish, puzzleDesc, hints, promptMode="none"})=>{
    return (
    <div className="puzzleArea">
        <MainPuzzle p={p} hints={hints} puzzleDesc={puzzleDesc} time={time} promptMode={promptMode} continue={() => {}}/>
        <TacticsPuzzle p={p} hints={hints} puzzleDesc={puzzleDesc} time={time} promptMode={promptMode} continue={() => {}}/>
    </div>);
}