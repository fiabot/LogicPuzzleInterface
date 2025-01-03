
import { useEffect, useState } from 'react';
import { addPuzzleSurvey, addSubject } from './src/Firestore/sendData';
import InformedConsent from './src/InformedConsent';
import InitialSurvey from './src/InitialSurvey';
import PuzzleManager from './src/PuzzleManager';
import Tutorial from './src/Tutorial';
import * as Linking from 'expo-linking';
import Debug from './debug';
import CategoryInput from './src/CategoryInput';
import ViewPuzzles from './src/ViewPuzzles';

let MODE = "debug"

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

  let [puzzles, setPuzzles] = useState(null)

  let [mode, setMode ] = useState("createPuzzle")

  let showPuzzles = (p) => {
    setPuzzles(p)
    setMode("showPuzzles")
  }

  if (mode == "createPuzzle") {
    return <div>
    <CategoryInput submitPuzzles={showPuzzles}/> 
  </div>
  }else{
    return <div>
      <ViewPuzzles puzzles={puzzles} />
    </div>
  }
  
  

}

