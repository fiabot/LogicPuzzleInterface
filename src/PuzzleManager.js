import axios from 'axios';
import { useState } from "react";
import ResponseRecorded from "./ResponseRecorded";
import Category from "./categoryModel";
import Puzzle from "./Puzzle";
import PuzzleModel from "./puzzleModel";
import Survey from "./survey";
import UsePrompts from "./PromptUser";

export function createPuzzle(data) {
    let categories = []
    for (cat in data.categories) {
        cat = data.categories[cat]
        categories.push(new Category(cat.name, cat.entities))
    }

    return new PuzzleModel(categories, data.hints, data.solution, data.id)

}


function load(i, setI, setContent, files, postSurvey, questions, promptMode) {
    if (i >= files.length) {
        setContent(<div>No more puzzles</div>);
    } else {
        axios.get(files[i])
            .then(response => {
                console.log(files[i])
                let p = createPuzzle(response.data);
                let hints = response.data["hint_grammar"]
                setI(i + 1);
                setContent(
                    <Puzzle p={p} hints={hints} puzzleDesc={response.data} promptMode={promptMode} continue={() => {}}/>
                );
            });
    }

}
function finish(setContent) {
    setContent(<div>No more puzzles!</div>)
}

function showRecordedScreen(setContent, i, setI, files, postSurvey, questions, promptMode) {
    setContent(<ResponseRecorded goToNextPuzzle={() => { load(i + 1, setI, setContent, files, postSurvey, questions, promptMode) }} finish={() => { finish(setContent) }} morePuzzles={() => { return files.length - (i + 1) }} />)
}

export default PuzzleManager = ({ files, i, setI, pid, postSurvey, questions, promptMode}) => {
    let [content, setContent] = useState(<div>loading</div>);
    let [puzzle, setPuzzle] = useState(null);
    let [puzzleId, setPuzzleId] = useState(-1);

    if (files){
        if (i == 0) {
            load(i, setI, setContent, files, postSurvey, questions, promptMode);
        }
    
        return (content)
    }else{
        return <div>Loading files</div>
    }

}
