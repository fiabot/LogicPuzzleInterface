import Hints from "./Hints";
import PuzzleGrid from "./PuzzleUtils";
import StateSelector from "./StateSelector";
import FinishButtons from "./EndPuzzleButtons";

export default TacticsPuzzle =({p, time, concede, finish, puzzleDesc, hints, promptMode="none"})=>{

return (<div>
    <Hints hints={p.hints} time={time} setStrikes ={setStrikes} strikes={strikes} instanceId={instanceId}/>
    <PuzzleGrid />
    <h1>Select Mark</h1>
    <StateSelector selected={select} setSelect={setSelect} />
    <FinishButtons 
        submit={() => {recordAndSubmit()}}
        isCorrect = {() => isSolved(puzzle, p.solutionString)}
        clearPuzzle = {function () {clearPuzzle(puzzle,strikes, setStrikes,instanceId, time)}}
        puzzle={puzzle}
        instanceId={instanceId}
        time={time}
    />
</div>);
}