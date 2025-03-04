
import { useEffect, useState } from 'react';
import { addPuzzleSurvey, addSubject } from './src/Firestore/sendData';
import InformedConsent from './src/InformedConsent';
import InitialSurvey from './src/InitialSurvey';
import PuzzleManager from './src/PuzzleManager';
import Tutorial from './src/Tutorial';
import Debug from './debug';
import CategoryInput from './src/CategoryInput';
import ViewPuzzles from './src/ViewPuzzles';
import HomePage from './src/home';
import Puzzle from './src/puzzle';
import Category from './src/categoryModel';
import {PuzzleModel,createPuzzle} from './src/puzzleModel';
import lzString from  "lz-string"
import EvolveManager from './src/EvolveManager';
import EditPuzzle from './src/EditPuzzle';


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

/*function createPuzzle(data, setPuzzle) {
  console.log(data)
  let categories = []
  for (cat in data.categories) {
    cat = data.categories[cat]
    categories.push(new Category(cat.name, cat.entities))
  }

  setPuzzle(new PuzzleModel(categories, data.hints, data.solution))

}*/ 

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



let PlayPuzzle = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const param = queryParameters.get("puzzle")


  try{
    const decom = lzString.decompressFromEncodedURIComponent(param)
    console.log("decom" + decom)
    puzzleObj = JSON.parse(decom)
    let p = createPuzzle(puzzleObj)
    return <Puzzle p={p}/> 

  }catch (e) {
    console.log("execept" + e)
    return <div>Input error</div>
  }
 
}




 export default function Main({}) {

  let [puzzles, setPuzzles] = useState([])
  
  let [categories, setCategories] = useState(null); 

  let [mode, setMode ] = useState("home")

  let [user, setUser] = useState(null) 

  let startGeneration =() =>{
    setMode("createPuzzle")
  }

  let showPuzzles = (p) => {
    setPuzzles(p)
    setMode("showPuzzles")
  }


  let startEvolve = (categories) => {
    setCategories(categories)
    setMode("evolve")

  }

  pathname = window.location.pathname

  if (pathname == "/play"){
    return <PlayPuzzle/> 
  }else{

 
    if (mode == "home"){
      return <HomePage startGeneration={startGeneration} user={user} setUser={setUser}/> 
    }
    else if (mode == "createPuzzle") {
      return <div>
      <CategoryInput startEvolve={startEvolve} user={user}/> 
    </div>
    }else{
      return <div>
        <EvolveManager categories={categories} user={user}/>
      </div>
    }
}

  
  

}



