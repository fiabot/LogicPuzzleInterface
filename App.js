import { useEffect, useState } from 'react';
import { addPuzzleSurvey, addSubject } from './src/Firestore/sendData';
import InformedConsent from './src/InformedConsent';
import InitialSurvey from './src/InitialSurvey';
import PuzzleManager from './src/PuzzleManager';
import Tutorial from './src/Tutorial';
import * as Linking from 'expo-linking';
import "./src/style.css";

<script src="https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js"></script>

let MODE = "consent"

let questions = ["The puzzle was cognitively demanding.", "I had to think very hard when playing the puzzle.",
    "The puzzle required a lot of mental gymnastics.", "The puzzle stimulated my brain.", "This puzzle doesn’t require a lot of mental effort.", 
    "The puzzle made me draw on all of my mental resources.", "The mental challenges in this puzzle had an impact on how I played.",

    "I think the puzzle is fun.", "I enjoy playing the puzzle.",
    "I feel bored while playing the puzzle.", "I am likely to recommend this puzzle to others.",
    "If given the chance, I want to play this puzzle again."];

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function createPuzzle(data, setPuzzle) {
  console.log(data)
  let categories = []
  for (cat in data.categories) {
    cat = data.categories[cat]
    categories.push(new Category(cat.name, cat.entities))
  }

  setPuzzle(new PuzzleModel(categories, data.hints, data.solution))

}

function getFiles() {

  let columns = [0, 1, 3, 5]
  let solutions = [12, 199, 352, 444]
  let files = []

  //shuffleArray(solutions)

  for (i in columns) {
    files.push("puzzles/puzzle_" + solutions[0] + "_" + columns[i] + ".json")
  }

  return files


}

export default function App() {
  let [puzzle, setPuzzle] = useState(null);
  let [i, setI] = useState(0)
  let [mode, setMode] = useState(MODE)
  let [pid, setPID] = useState(0)
  let [content, setContent] = useState(<Tutorial imageFolder="tutorialSlides" numSlides={29} canSkip={12} startGame={() => { startGame() }} />);
  let [files, setFiles] = useState();
  let [promptMode, setPromptMode] = useState("none") 

  useEffect(() => {

    let level_modes = ["hub", "scaffolded", "not_scaffolded"];
    let mode_i = Math.floor(Math.random() * level_modes.length);
    let level_mode = level_modes[mode_i]

    let prompt_modes = ["none", "generic", "relevant"];
    mode_i = Math.floor(Math.random() * prompt_modes.length);
    setPromptMode(prompt_modes[mode_i]) 
    let files = []

    if (level_mode == "hub"){
      files = ["puzzles/hub.json"]
    }else if (level_mode == "scaffolded"){
      files = ["puzzles/Spoke1.json", "puzzles/spoke2.json", "puzzles/hub.json"]
    }else{
      files = ["puzzles/help1.json","puzzles/help2.json","puzzles/hub.json"]
    }

    setFiles(files)

    console.log(level_mode, prompt_modes[mode_i])
  }, [])
  
  let consent = <div className='parent'><InformedConsent consent={() => setMode("survey")} /></div>
  let tutorial = <Tutorial imageFolder="tutorialSlides" numSlides={29} canSkip={12} startGame={() => { startGame() }} />
  let puzzleManager = <PuzzleManager promptMode={promptMode} files={files} i={i} setI={setI} pid={pid} postSurvey={addPuzzleSurvey} questions = {questions}/>

  let startGame = () => {
    setMode("puzzle")
  }

  let submitInitalSurvey = (logicPuz, gridPuzz) => {
    setMode("tutorial");
    addSubject(logicPuz, gridPuzz)
  }

  const url = Linking.useURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  

    mode = "puzzle"
    if (mode == "consent") {
      return (consent)
    } else if (mode == "survey") {
      return (

        <InitialSurvey postAnswers={submitInitalSurvey} />
      )
    } else if (mode == "tutorial") {
      return (<div className='parent'>{tutorial}</div>)
    } else {
      return (<div className='parent'>
        <div className='codeBanner'>
          <div>
            Your completion code is CKKCGFDC<br />
            You may enter this at anytime
          </div>

        </div>
        {puzzleManager}</div>)
    }

  } else {
    return <div>Loading</div>
  }


}