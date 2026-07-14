
import { useEffect, useState } from 'react';
import { addPuzzleSurvey, addSubject } from './src/Firestore/sendData';
import InformedConsent from './src/InformedConsent';
import InitialSurvey from './src/InitialSurvey';
import PuzzleManager from './src/PuzzleManager';
import Tutorial from './src/Tutorial';
import * as Linking from 'expo-linking';
// import Debug from './debug';

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

export default function App() {
  let [puzzle, setPuzzle] = useState(null);
  let [i, setI] = useState(0)
  let [pid, setPID] = useState(0)
  let [files, setFiles] = useState();

  useEffect(() => {
    files = ["puzzles/Spoke1.json", "puzzles/spoke2.json", "puzzles/hub.json"]
    setFiles(files)
  }, [])
  
  let puzzleManager = <PuzzleManager promptMode={promptMode} files={files} i={i} setI={setI} pid={pid}/>


  const url = Linking.useURL();

  if (url) {
    return puzzleManager
  }else{
    return <div>Loading</div>
  }


}

