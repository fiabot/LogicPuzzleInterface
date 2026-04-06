import HintWriter from "./HintWriter"
import Collapseable from "./Collapseable"
import { useEffect, useState,  } from "react"
import { startEvolution, continueEvolution, like_puzzle,  remove_puzzle } from "./API/SendToApi"
import { getEvolveSession } from "./API/GetFromApi"
import { async } from "@firebase/util"
import PlayablePuzzleList from "./PlayablePuzzleList"
import PuzzleFilter from './puzzleFilter';
import {createPuzzle} from "./puzzleModel";
//import { Tab, Tabs, TabsList, TabPanel } from "@mui/material"
import { Tabs } from '@base-ui/react/tabs'; 

let startEvolve = async (user, scenario, cons, setPuzzles, setId, setInEvolution, startTime, setEvolveSess) => {
    console.log(cons)
    time = new Date() - startTime 
    setInEvolution(true)
    results = await startEvolution(user, time, cons, scenario)
    console.log(results)
    setPuzzles(results["output"])
    setId(results["id"])
    setEvolveSess(results["sessionId"])
    setInEvolution(false)
}

let conEvolve = async (user, cons, id, setPuzzles, setId, setInEvolution, startTime)=> {
    time = new Date() - startTime 
    setInEvolution(true)
    results = await continueEvolution(user,time, cons, id)
    setPuzzles(results["output"])
    setId(results["id"])
    setInEvolution(false)
}


let WriterManager = ({index, cons, setCons, texts, setTexts, categories}) => {
    let [editable, setEditable] = useState(true)
    let [grammar, setGrammar] = useState(cons[index])
    let [hintString, setHintString] = useState(texts[index])
    let [deleteMe, setDeleteMe] = useState(false)

    let deleteWriter = (index) => {
        setCons(
            cons.toSpliced(index, 1)
        )

        setTexts(
            texts.toSpliced(index, 1)
        )
        setDeleteMe(true)
    }

    /*useEffect(() => {
        const newCons = cons.map((element, i) => {
            if (i == index) {
               
                    return grammar
    
                
            } else {
                return element
            }
        })

        setCons(newCons)

        

    }, [grammar])*/

    let submit = () => {
        const newCons = cons.map((element, i) => {
            if (i == index) {
               
                    return grammar
    
                
            } else {
                return element
            }
        })

        setCons(newCons)
        setEditable(false)
    }

    let edit = () => {
        setEditable(true)
    }

    useEffect(() => {
        if (deleteMe){
            setGrammar(cons[index])
            setHintString(texts[index])
            setDeleteMe(false)
        }
        

        

    }, [deleteMe])
    if (editable) {
        return <div>
        <HintWriter categories={categories} setGrammar={setGrammar} grammar={grammar} hintString={hintString} setHintString={setHintString} onEnter={submit}/>
        <button onClick={deleteWriter}>Delete</button>
        <button onClick={submit}>Submit</button>
    </div>
    }else{
        return <div>
            <p>{hintString}</p>
            <button onClick={deleteWriter}>Delete</button>
            <button onClick={edit}>Edit</button>
        </div>
    }
    


}

let ConstraintWriter = ({cons, setCons, texts, setTexts, categories}) => {


    let conManagers = cons.map((f, idx) => {
        return <WriterManager index={idx} setCons={setCons} cons={cons} setTexts={setTexts} texts={texts} categories={categories}/> 
    }) 

    let add_filter = () => {
        
        c = [...cons]
        c.push(null)
        setCons(c)

        t = [...texts]
        t.push("")
        setTexts(t)


    }

    return <div>
       
        {conManagers}

        <div>
            <button className='smallButton' onClick={add_filter}>New Hint</button>
        </div>
    </div>
}


let ShowGeneratedHints = ({puzzle, toggleLike, liked}) => {
    
    if (puzzle == null){
        return <div>
            Select Generated Puzzle
        </div>
    }else{
        img = liked? "./icons/liked.png":  "./icons/unliked.png"
        return <div>
            <button className="likeButton" onClick={toggleLike}><img src={img} width="40" height="40"/></button>
                <ol className='hintList'>
            {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
            </ol>
        </div>
    }
}


let ShowGeneratedPuzzle = ({generated, select}) => {
    const [value, setValue] = useState(2)
    tabs = generated.map((li, idx) => {
        return <Tabs.Tab className="Tab" value={idx}>{idx+1} ({li.length}) </Tabs.Tab>
    })
    const handleChange = (event, newValue) => {
        setValue(newValue);
      }

    puzzlePannels = generated.map((li,idx) =>{
         puzzles= li.map((puzzle, id2) => {
            return <li className='puzzleListElement' key = {id2}>
                <h3>Hints</h3>
                <ol className='hintList'>
                {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
                </ol>
                <button onClick={()=> select(puzzle)}>Select</button>
    
            </li>
         })
         return  <Tabs.Panel className={"Panel"} value={idx}> <ol className='puzzleList'>
                    <p> Showing {puzzles.length} puzzles</p>
                    {puzzles} 

            </ol>
            </Tabs.Panel>
  
        
    })

    if (generated.length == 0){
        return <div>
            Start generation
        </div>
    }else{
       

        return <div>
                
                <Tabs.Root className={"Tabs"} onChange={handleChange}>
                <p>Difficulty</p>
                  <Tabs.List className="List"> 
                {tabs}
                <Tabs.Indicator className={"Indicator"} />
                </Tabs.List> 
                
          
             
                {puzzlePannels}
                </Tabs.Root> 

                
  

           
               
        </div>
    }
}

export default EvolveScreen = ({user,scenario, scenarioId, evolveSess, setEvolveSess, sessionId, sessionStart}) => {
    categories = scenario["data"]["categories"]
    let [evolveId, setEvolveId] = useState(null)
    let [inEvolution, setInEvolution] = useState(false)
    let [puzzles, setPuzzles] = useState([])
    let [likedPuzzles, setLikedPuzzles] = useState([])
    let [selectedPuzzle, setSelectedPuzzle] = useState(null)
    let [selectedLiked, setSelectedLiked] = useState(false)
    let [cons, setCons] = useState([])
    let [text,setTexts] = useState([])

    let p = createPuzzle({"categories": categories, "hints":cons, "solution":"", "id":-1})

    useEffect(()=>{
        let fetch = async()=>{
            if(evolveSess != null){
                console.log(evolveSess)
                sess = await getEvolveSession(user, evolveSess)
                console.log(sess)

                setLikedPuzzles(sess["likedInds"])
                setEvolveId(sess["lastId"])
            }
        }
        fetch()
    },[])

    let toggleLike = async() =>{
        if (!selectedLiked){
            results = await like_puzzle(selectedPuzzle, user, evolveId)

            new_puzzle = {...selectedPuzzle, key:results}
            setSelectedLiked(true)
            setSelectedPuzzle(new_puzzle)
            setLikedPuzzles([...likedPuzzles, new_puzzle])
        }else{
            result = await remove_puzzle(selectedPuzzle["key"], user, evolveId)
            setSelectedLiked(false)

        }
        
    }

    let generateNext = () => {
        if (evolveId == null){
            startEvolve(user, scenarioId, cons, setPuzzles, setEvolveId, setInEvolution,sessionStart, setEvolveSess )
        }else{
            conEvolve(user, cons, evolveId, setPuzzles, setEvolveId, setInEvolution, sessionStart)
        }
    }

    let design = <div className="filterView">

        <div >
            <PuzzleFilter p={p} setFilter={() => console.log("update filter")} />
            

            
        </div>

        <div>
            <h1> Locked Hints </h1>
                <ConstraintWriter cons={cons} setCons={setCons} texts={text} setTexts={setTexts} categories={categories}/>
            <h1> Selected Puzzle </h1>
                <ShowGeneratedHints  puzzle={selectedPuzzle} toggleLike={toggleLike} liked={selectedLiked}/>
        </div>

        <div className="cropped">
            <button disabled={inEvolution} onClick={generateNext}>{evolveSess == null? "Generate First Round": "Generate Next Round"}</button>
           <ShowGeneratedPuzzle generated={puzzles} select={setSelectedPuzzle} />
            
        </div>
    </div>

    let puzzleDisplay = <div>
         <PlayablePuzzleList puzzles={likedPuzzles} evolveSession={evolveSess} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
    </div>

    return <div className='body'>

        <Collapseable content={design} title={"Design Puzzle"}/> 

        <Collapseable content={puzzleDisplay} title="Liked Puzzles" /> 


    </div>

}