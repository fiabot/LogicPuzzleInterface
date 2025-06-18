export default ResponseRecorded = ({goToNextPuzzle, finish, morePuzzles}) => {
    let numPuzzles = morePuzzles()
    if(numPuzzles > 0){
        return (<div className="recorded">
            <h1>Thank you!</h1>
            <h2>We have {numPuzzles} more puzzle{numPuzzles == 1? "": "s"} for you to solve.</h2>
            <button onClick={goToNextPuzzle}>Play next puzzle</button>
            
            </div>)
    }else{
        return (<div className="recorded">
            <h1>Thank you!</h1>
            <h2>Your response has been recorded.</h2>
            <p>There are no more puzzles, you may close this window.</p>
            
            </div>)
    }
   
}