import "./ViewPuzzlesStyle.css"; 
import lzString from  "lz-string"
import { like_puzzle } from './API/SendToApi';

export default PuzzleList= ({puzzles, user}) => {
    const openInNewTab = (url) => {
        window.open(url, "_blank", "noreferrer");
      };

    let playPuzzle = (puzzle) => {
        str = JSON.stringify(puzzle)
        compStr = lzString.compressToEncodedURIComponent(str)
        url_str =  pathname = window.location.href +"play?puzzle=" + compStr
        openInNewTab(url_str)
    }
    let puzzleList = puzzles.map((puzzle, idx) => {
        return <li className='puzzleListElement' key = {idx}>
        <h2>Difficulty: {puzzle.diff}</h2>
        <h2>Hints</h2>
        <ol className='hintList'>
        {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
        </ol>
        <button onClick={()=> playPuzzle(puzzle)}>Play Puzzle</button>
        {user? <button onClick={() => like_puzzle(puzzle, user)}>Like Puzzle</button> : ""}
        </li>
    })

    return <ol className='puzzleList'>
            {puzzleList} 
        </ol>


}