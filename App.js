
import { useEffect, useState } from 'react';
import { addPuzzleSurvey, addSubject } from './src/Firestore/sendData';
import InformedConsent from './src/InformedConsent';
import InitialSurvey from './src/InitialSurvey';
import PuzzleManager from './src/PuzzleManager';
import Tutorial from './src/Tutorial';
// import Debug from './debug';
import CategoryInput from './src/CategoryInput';
import Scenarios from './src/Scenarios';
import ViewPuzzles from './src/ViewPuzzles';
import HomePage from './src/home';
import Puzzle from './src/puzzle';
import Category from './src/categoryModel';
import {PuzzleModel,createPuzzle} from './src/puzzleModel';
import lzString from  "lz-string"
import EvolveManager from './src/EvolveManager';
import EditPuzzle from './src/EditPuzzle';
import './src/style.css';
import Login from './src/Login';
import ViewLikedPuzzles from './src/ViewLikedPuzzles';
import {CommunityPage} from './src/CommunityPage';
import SurveyPage from './src/surveyPage';
import InteractiveEvolve from './src/InteractiveEvolve';
let MODE = "mixed"



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


let testPuzzle = `{
  "solution": "------|XXXO||OXXX||XXOX||XOXX|",
  "categories": [
      {
          "name": "oz",
          "entities": [
              "20oz",
              "40oz",
              "60oz",
              "80oz"
          ],
          "is_numeric": true
      },
      {
          "name": "plant",
          "entities": [
              "Potatoes",
              "Green Onions",
              "Eggplant",
              "Broccoli"
          ],
          "is_numeric": false
      }
  ],
  "hints": [
      "The Green Onions need 40oz less then the Eggplant.",
      "The plant that needs 40oz of water is Broccoli."
  ],
  "id": "0:1"
}`


let printPuzzle = (puzzle) => {
  compStr = lzString.compressToEncodedURIComponent(puzzle)
  url_str =  pathname = window.location.href +"play?puzzle=" + compStr
  console.log(url_str)
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
  
  let [userMode, setUserMode] = useState(MODE)
  let [categories, setCategories] = useState(null); 
  let [scenario, setScenario] = useState("")
  let [scenarioId, setScenarioId] = useState(null)
  let [name, setName] = useState("")

  let [mode, setMode ] = useState("home")

  let [user, setUser] = useState(null) 
  let [username, setUsername] = useState("user")
  let [sessionId, setSessionID] = useState(null)
  let [sessionStart, setSessionStart] = useState(null) 
  let [evolveId, setEvolveId] = useState(null)
  let [evolveSess, setEvolveSess] = useState(null) 
  
  printPuzzle(testPuzzle); 

  

  let checkIfSaved = () => {
    if (mode == "createPuzzle" || mode == "evolve") {
      return confirm("Are you sure you want to leave the page? Any unsaved content will be lost")
    }else {
      return true 
    }
  }

  let selectScenario = (scen) => {
    console.log(scen)
    setScenario(scen)
    setScenarioId(scen["_id"])
    setMode("createPuzzle")
  }

  let createNewScen = (scen = null) =>{
    if (scen == null){
      blankScen = {
        "evolve_sessions":[], 
        "data": {
          "title":"", 
          "desc": "", 
          "categories":[]
        }
      }
      
    }else{
      blankScen = {
        "evolve_sessions":[], 
        "data": scen
        }
      }
    
    
    setScenario(blankScen)
    setMode("createPuzzle")
  }

  let startGeneration =() =>{
    setMode("scenarios")
  }

  let goBackToScen = () => {
    setMode("createPuzzle")
  }


  let startEvolve = () => {
    categories = scenario["data"]["categories"]
    if (categories.length < 2) {
      alert("Please add at least 2 categories to start generation")
      return
    }
    setCategories(categories)
    setMode("evolve")

  }

  let conEvolve = (sessId) => {
    categories = scenario["data"]["categories"]
    if (categories.length < 2) {
      alert("Please add at least 2 categories to start generation")
      return
    }
    setEvolveSess(sessId)
    setCategories(categories)
    setMode("evolve")

  }



  let goHome = () => {
    if (checkIfSaved()){
      setMode("home")
    }
    
  }

  let showLikedPuzzles = () => {
    if (checkIfSaved()){
      setMode("liked")
    }
    
  }

   let showCommunity = () => {
    if (checkIfSaved()) {
      setMode("community")
    }
    
   }

   let showTutorial = () => {
    if (checkIfSaved()) {
      setMode("tutorial")
    }
    
   }


   let showConsent = () => {
    if (checkIfSaved()) {
      setMode("consent")
    }
    
   }



   let openSurvey= (password) => {
    url_str =  pathname = window.location.href +"survey?user=" + password
    window.open(url_str, "_blank", "noreferrer");

}

  pathname = window.location.pathname

  let header = 
 <div className="topnav">
         <img src="./icons/logo.png" width="100" height="60"/>
  <button className={mode == "home"? "active": ""} onClick={goHome}>Home</button>
  <button className={mode == "createPuzzle" || mode == "evolve"? "active": ""} onClick={startGeneration} >Generate Puzzles</button>
  {/*<button className={mode == "liked"? "active": ""} onClick={showLikedPuzzles}>View Liked Puzzles</button>
  <button className={mode == "community"? "active": ""} onClick={showCommunity} >Community Puzzles</button>*/}
  <button className={mode == "tutorial"? "active": ""} onClick={showCommunity} >Tutorial</button>
  <button className={mode == "consent"? "active": ""} onClick={showConsent} >View Informed Consent Form</button>
  <button onClick={() => openSurvey(user)} >Fill out a survey</button>
</div>

   let content = <div>None</div>
   if (mode == "home"){
    content = <HomePage user={user} /> 
   }else if (mode == "scenarios"){
    content = <Scenarios user={user} select={selectScenario} new_scen={createNewScen} sessionId={sessionId} sessionStart={sessionStart}/>
   }else if (mode == "createPuzzle"){
    content = <CategoryInput goBack={startGeneration} continueEvolve={conEvolve} startEvolve={startEvolve} user={user} scenario={scenario} setScenario={setScenario} scenarioId={scenarioId} setScenarioId={setScenarioId} name={name} setName={setName} /> 
  
   }else if (mode == "evolve"){
    content =  <InteractiveEvolve goBack={goBackToScen} user={user} mode={userMode} evolveSess={evolveSess} setEvolveSess={setEvolveSess} name={name} scenario={scenario} scenarioId={scenarioId} sessionStart={sessionStart} sessionId={sessionId}/>
   }else if (mode == "liked"){
    content = <ViewLikedPuzzles  user={user} mode={userMode}  sessionStart={sessionStart} sessionId={sessionId}/> 
   }else if (mode == "community"){
    content = <CommunityPage user={user} appMode={userMode}  sessionStart={sessionStart} sessionId={sessionId}/> 
   }else if (mode == "consent"){
    content = <InformedConsent /> 
   }
 

  if (pathname == "/play"){
    return <PlayPuzzle/> 
  }else if (pathname == "/survey") {
    return <SurveyPage /> 
  }else if (user == null){
    return <Login  user={user} setUser={setUser} sessionId={sessionId} setSessionId={setSessionID} setSessionStart={setSessionStart}/>
  } else{
    return <div>
      {header}
      {content}
    </div>
  }

 

  
  

}


