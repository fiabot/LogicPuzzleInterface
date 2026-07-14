import axios from 'axios';
import { useState } from "react";
import ResponseRecorded from "./ResponseRecorded";
import Category from "./categoryModel";
import Puzzle from "./puzzle";
import PuzzleModel from "./puzzleModel";
import Survey from "./survey";
import { createGamePlayInstance } from './Firestore/sendData';

function createPuzzle(data) {
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
                let time = new Date()
                setI(i + 1);
                setContent(<Puzzle p={p} hints={hints} puzzleDesc={response.data} time={time} promptMode={promptMode} continue={() => {}}/>);
            });
    }

}
function finish(setContent) {
    setContent(<div>No more puzzles!</div>)
}

function showRecordedScreen(setContent, i, setI, files, postSurvey, questions, promptMode) {
    setContent(<ResponseRecorded goToNextPuzzle={() => { load(i + 1, setI, setContent, files, postSurvey, questions, promptMode) }} finish={() => { finish(setContent) }} morePuzzles={() => { return files.length - (i + 1) }} />)
}

export default PuzzleManager = ({ files, i, setI, pid }) => {
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
