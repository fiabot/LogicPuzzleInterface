import { useEffect, useState } from "react";
import Puzzle from "./Puzzle";
import ResponseRecorded from "./ResponseRecorded";
import Survey from "./survey";

function startSurvey(instanceId, i, setI, setContent, files, postSurvey, questions) {
    setContent(<Survey instanceId={instanceId} questions={questions} submit={(responses) => {
        postSurvey(puzzle, responses)
        showRecordedScreen(setContent, i, setI, files, postSurvey, questions)
    }} />);
    setI(i + 1)
}


function showRecordedScreen(setContent, i, files, setDoneWithPuzzle) {
    setContent(<ResponseRecorded goToNextPuzzle={() => { setDoneWithPuzzle(false) }} morePuzzles={() => { return files.length - (i + 1) }} />)
}

export default PuzzleManager = ({ files, pid, postSurvey, questions, studyMode }) => {
    let [i, setI] = useState(0);
    let [file, setFile] = useState(files[i])
    let [doneWithPuzzle, setDoneWithPuzzle] = useState(false);
    let [content, setContent] = useState(<div>loading</div>);

    useEffect(() => {
        console.log(`next puzzle`)
        if (i > files.length - 1) {
            setContent(<div>No more puzzles</div>)
        }
        else {
            setFile(files[i + 1])
            setI(i + 1)
            setContent(<Puzzle file={file} studyMode={studyMode} finish={() => {
                showRecordedScreen(setContent, i, files, setDoneWithPuzzle)
            }} />)
        }
    }, [doneWithPuzzle]);

    if (files) {
        return (content)
    } else {
        return <div>Loading files</div>
    }

}
