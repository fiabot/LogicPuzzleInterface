import Hints from "./Hints";
import PuzzleGrid from "./PuzzleUtils";
import StateSelector from "./StateSelector";
import FinishButtons from "./EndPuzzleButtons";

export default MainPuzzle =({p, time, concede, finish, puzzleDesc, hints, promptMode="none"})=>{

return (<div>
    <div className="puzzleLeft">
        <h1>Puzzle</h1>
        <PuzzleGrid />
        <h1>Select Mark</h1>
        <StateSelector selected={select} setSelect={setSelect} />
    </div>
    <div className="puzzleRight">
        <Hints hints={p.hints} time={time} setStrikes ={setStrikes} strikes={strikes} instanceId={instanceId}/>
        <FinishButtons 
            submit={() => {recordAndSubmit()}}
            isCorrect = {() => isSolved(puzzle, p.solutionString)}
            clearPuzzle = {function () {clearPuzzle(puzzle,strikes, setStrikes,instanceId, time)}}
            puzzle={puzzle}
            instanceId={instanceId}
            time={time}
        />
    </div>
</div>);
}