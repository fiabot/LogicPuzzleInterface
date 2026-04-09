import HintWriter from "./HintWriter"
import Collapseable from "./Collapseable"
import { useEffect, useState,  } from "react"
import { startEvolution, continueEvolution, like_puzzle,  remove_puzzle, add_click } from "./API/SendToApi"
import { getEvolveSession } from "./API/GetFromApi"
import { async } from "@firebase/util"
import PlayablePuzzleList from "./PlayablePuzzleList"
import PuzzleFilter from './puzzleFilter';
import {createPuzzle} from "./puzzleModel";
//import { Tab, Tabs, TabsList, TabPanel } from "@mui/material"
import { Tabs } from '@base-ui/react/tabs'; 
import PuzzleTest from "./puzzleTest"



let is_duplicate = (grammar1, grammar2) => {
    if (grammar1 == null || grammar2==null){
        return false 
    }
    kind = Object.keys(grammar1)[0]


    if (kind != Object.keys(grammar2)[0]){
        return false
    }else if (kind == "not" || kind == "is"){
        ents1 = [grammar1[kind][1], grammar1[kind][3]] 
        ents2 = [grammar2[kind][1], grammar2[kind][3]] 
        console.log(grammar1 )
        console.log(grammar2)

        

        one_match = ents1[0] == ents2[0] && ents1[1] == ents2[1]
        second_match = ents1[0] == ents2[1] || ents1[1] == ents2[0]


        return one_match || second_match 
    }else if (kind == "before"){
        if (grammar1[kind].length != grammar2[kind].length){
            return false 
        }else{
            ent1 = grammar1[kind][1] == grammar2[kind][1]
            ent2 = grammar1[kind][3] == grammar2[kind][3]
            cat = grammar1[kind][4] == grammar2[kind][4]
            amount = true 
            if (grammar1[kind].length == 6){
                amount = grammar1[kind][5] == grammar2[kind][5]
            }

            return ent1 && ent2 && cat && amount 
        }
    }else if (kind == "simple_or"){
        ents1 = [grammar1[kind][1], grammar1[kind][3]] 
        ents2 = [grammar2[kind][1], grammar2[kind][3]]
        is_ent = grammar1[kind][6] == grammar2[kind][6]
        one_match = ents1[0] == ents2[0] && ents1[1] == ents2[1]
        second_match = ents1[0] == ents2[1] || ents1[1] == ents2[0] 

        return is_ent && (one_match || second_match)
    }else if (kind == "compound_or"){
        statement1_1 = grammar1[kind][0]
        statement1_2 = grammar1[kind][1]

        statement2_1 = grammar2[kind][0]
        statement2_2 = grammar2[kind][1]

        one_same = is_duplicate(statement1_1, statement2_1)
        two_same = is_duplicate(statement1_2, statement2_2)

        one_reverse = is_duplicate(statement1_1, statement2_2)
        two_reverse = is_duplicate(statement1_2, statement2_1)

        return (one_same && two_same) || (one_reverse && two_reverse)

    }
}

let get_locked_idx = (check_grammar, grammar_list) => {
    let idx = -1 
    grammar_list.forEach((element,i) => {
        if (is_duplicate(check_grammar, element.con)){
            idx = i
        }
    });

    return idx 
}


let startEvolve = async (user, scenario, cons, setPuzzles, setId, setInEvolution, startTime, setEvolveSess) => {
    cons = cons.filter((c) => c.con != null)
    time = new Date() - startTime 
    setInEvolution(true)
    results = await startEvolution(user, time, cons, scenario)
    setPuzzles(results["output"])
    setId(results["id"])
    setEvolveSess(results["sessionId"])
    setInEvolution(false)
}

let conEvolve = async (user, cons, id, setPuzzles, setId, setInEvolution, startTime)=> {
    cons = cons.filter((c) => c.con != null)
    time = new Date() - startTime 
    setInEvolution(true)
    results = await continueEvolution(user,time, cons, id)
    setPuzzles(results["output"])
    setId(results["id"])
    setInEvolution(false)
}


let WriterManager = ({index, cons, setCons, texts, setTexts, categories, user, sessionId, sessionStart}) => {
    let [editable, setEditable] = useState(cons[index].origin == "human")
    let [grammar, setGrammar] = useState(cons[index])
    let [hintString, setHintString] = useState(texts[index])
    let [deleteMe, setDeleteMe] = useState(false)

    let deleteWriter = (index) => {
        add_click(user, sessionId, "Delete locked hint", sessionStart)
        setCons(
            cons.toSpliced(index, 1)
        )

        setTexts(
            texts.toSpliced(index, 1)
        )
        setDeleteMe(true)
    }



    let submit = () => {
        add_click(user, sessionId, "Submit locked hint", sessionStart)
        if (grammar != null){
            const newCons = cons.map((element, i) => {
                if (i == index) {
                   
                        return {con:grammar, origin:cons[index].origin}
        
                    
                } else {
                    return element
                }
            })
    
            
    
            setCons(newCons)
            setEditable(false)

        }
        
    }

    let edit = () => {
        add_click(user, sessionId, "Edit locked hint", sessionStart)
        const newCons = cons.map((element, i) => {
            if (i == index) {
                    origin = cons[index].origin == "human" ? "human" : "edited"
                    return {con:cons[index].con, origin:origin}
    
                
            } else {
                return element
            }
        })

 

        setCons(newCons)
        setEditable(true)
    }

    useEffect(() => {
        if (deleteMe){
            setGrammar(cons[index])
            setHintString(texts[index])
            setDeleteMe(false)
        }else{
            const newTexts= texts.map((element, i) => {
                if (i == index) {
                   
                        return hintString
        
                    
                } else {
                    return element
                }
            })

            setTexts(newTexts)
        }

    }, [deleteMe, hintString])
    if (editable) {
        return <div>
        <HintWriter categories={categories} setGrammar={setGrammar} grammar={grammar} hintString={hintString} setHintString={setHintString} onEnter={submit}/>
        <button disabled={grammar==null} className="smallButton" onClick={submit}>Submit</button>
        
    </div>
    }else{
        return <div className="hintWriter">
            <button className="editButton" onClick={edit}>{hintString}</button>
            <button className="lockButton" onClick={deleteWriter}><img src={"./icons/lock.png"} width="30" height="30"/></button>
        </div>
    }
    


}

let ConstraintWriter = ({cons, setCons, texts, setTexts, categories, user, sessionId, sessionStart}) => {


    let conManagers = cons.map((f, idx) => {
        return <WriterManager index={idx} setCons={setCons} cons={cons} setTexts={setTexts} texts={texts} categories={categories}/> 
    }) 

    let add_filter = () => {
        add_click(user, sessionId, "Create hint on blank", sessionStart)
        c = [...cons]
        c.push({con:null, origin:"human"})
        setCons(c)

        t = [...texts]
        t.push("")
        setTexts(t)
    }

    return <div>
        <h2>Included Hints <div class="tooltip"> &#40;  ? &#41;
            <span class="tooltiptext">
                <p>These are the hints are not in the current puzzle, but will be included in all puzzles when you generate the next round.</p>
            </span>
            </div></h2>
        <p>No generated puzzle added. Select a puzzle or generate the next round. 
        </p>
        <h2>Not Included <div class="tooltip"> &#40;  ? &#41;
            <span class="tooltiptext">
                <p>These are the hints are not in the current puzzle, but will be included in all puzzles when you generate the next round.</p>
            </span>
            </div></h2>
       
        {conManagers}

        <div>
            <button className='smallButton' onClick={add_filter}>+</button>
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
            <button className="likeButton" onClick={toggleLike}><img src={img} width="30" height="30"/></button>
                <ol className='hintList'>
            {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
            </ol>
        </div>
    }
}


let ShowAndEdit = ({generatedPuzzle, cons, setCons, texts, setTexts, categories, user, sessionId, sessionStart}) => {
    let [hints, setHints] = useState([])
    let [otherHints, setOtherHints] = useState([])

    let add_filter = () => {
        add_click(user, sessionId, "Create hint on generated", sessionStart)
        c = [...cons]
        c.push({con:{}, origin:"human"})
        setCons(c)

        t = [...texts]
        t.push("")
        setTexts(t)
    }

    let lock_hint = (grammar, text) => {
        add_click(user, sessionId, "Lock generated hint", sessionStart)
        c = [...cons]
        c.push({con:grammar, origin:"generated"})
        setCons(c)

        t = [...texts]
        t.push(text)
        setTexts(t)
    }

    useEffect(() => {
        let shownIdxs = [] 
        let hs = generatedPuzzle.hint_grammar.map((grammar, idx) => {
            let conIdx = get_locked_idx(grammar, cons)
    
            if (conIdx == -1){
                return <li>
                    {generatedPuzzle.hints[idx]}
                    <button className="unlockButton" onClick={() => lock_hint(grammar,generatedPuzzle.hints[idx] )}><img src={"./icons/lock.png"} width="30" height="30"/></button>
                    </li>
            }else{
                shownIdxs.push(conIdx)
                return <li> <WriterManager index={conIdx} setCons={setCons} cons={cons} setTexts={setTexts} texts={texts} categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart}/> </li>
            }
        })

        setHints(hs)
    
        let other = []
    
        cons.forEach((c,idx) => {
            if (! shownIdxs.includes(idx)){
                writer =  <li> <WriterManager index={idx} setCons={setCons} cons={cons} setTexts={setTexts} texts={texts} categories={categories}/> </li>
                other.push(writer)
            }

        setOtherHints(other)
        })
    }, [cons, selectedPuzzle])



   

    return <div>
        <h2>Included Hints <div class="tooltip"> &#40; ? &#41;
            <span class="tooltiptext">
                <p>These are the hints in the current puzzle. Hints can be locked to ensure they are added to all puzzles generated in the next round.</p>
            </span>
        </div></h2> 
        <ol className='hintList'>
            {hints}
        </ol>


        <h2>Not Included <div class="tooltip"> &#40;  ? &#41;
            <span class="tooltiptext">
                <p>These are the hints are not in the current puzzle, but will be included in all puzzles when you generate the next round.</p>
            </span>
            </div></h2> 
        <ol className='hintList'>
            {otherHints}
        </ol>


        <div>
            <button className='smallButton' onClick={add_filter}>+</button>
        </div>
    </div>


}

let ShowGeneratedPuzzle = ({generated, select, user, sessionId, sessionStart}) => {
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
                <button onClick={()=> {select(puzzle); add_click(user, sessionId, "Select generated puzzle", sessionStart)}}>Send to Editor</button>
    
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
                <p>Search Puzzles by Difficulty</p>
                  <Tabs.List className="List"> 
                {tabs}
                <Tabs.Indicator className={"Indicator"} />
                </Tabs.List> 
                
          
             
                {puzzlePannels}
                </Tabs.Root> 

                
  

           
               
        </div>
    }
}

export default EvolveScreen = ({user,scenario, scenarioId, evolveSess, setEvolveSess, sessionId, sessionStart, goBack}) => {
    categories = scenario["data"]["categories"]
    let [evolveId, setEvolveId] = useState(null)
    let [inEvolution, setInEvolution] = useState(false)
    let [puzzles, setPuzzles] = useState([])
    let [likedPuzzles, setLikedPuzzles] = useState([])
    let [selectedPuzzle, setSelectedPuzzle] = useState(null)
    let [solution, setSolution] = useState(null)
    let [selectedLiked, setSelectedLiked] = useState(false)
    let [cons, setCons] = useState([])
    let [text,setTexts] = useState([])

    let p = createPuzzle({"categories": categories, "hints":cons, "solution":"", "id":-1})

    useEffect(()=>{
        let fetch = async()=>{
            if(evolveSess != null){
              
                sess = await getEvolveSession(user, evolveSess)
            

                setLikedPuzzles(sess["likedInds"])
                setEvolveId(sess["lastId"])
            }
        }
        fetch()
    },[])

    useEffect(() => {
        if (selectedPuzzle != null){
            console.log(selectedPuzzle)
            setSolution(selectedPuzzle["solution"])
        }else{
            setSolution(null)
        }
        
    }, [selectedPuzzle])

    let toggleLike = async() =>{
        if (!selectedLiked){
            results = await like_puzzle(selectedPuzzle, user, evolveSess)

            new_puzzle = {...selectedPuzzle, key:results}
            setSelectedLiked(true)
            setSelectedPuzzle(new_puzzle)
            setLikedPuzzles([...likedPuzzles, new_puzzle])
            add_click(user, sessionId, "Like puzzle", sessionStart)
        }else{
            result = await remove_puzzle(selectedPuzzle["key"], user, evolveSess)
            setSelectedLiked(false)
            add_click(user, sessionId, "Remove puzzle", sessionStart)

        }
        
    }

    let generateNext = () => {
        if (evolveId == null){
            add_click(user, sessionId, "Start generation", sessionStart)
            startEvolve(user, scenarioId, cons, setPuzzles, setEvolveId, setInEvolution,sessionStart, setEvolveSess )
        }else{
            add_click(user, sessionId, "Continue generation", sessionStart)
            conEvolve(user, cons, evolveId, setPuzzles, setEvolveId, setInEvolution, sessionStart)
        }
    }

    img = selectedLiked? "./icons/liked.png":  "./icons/unliked.png"
    

    let design = <div className="design">

        <div >
            <h1>Play</h1>
            <PuzzleTest p={createPuzzle(p)} solution={solution} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
            

            
        </div>

        <div>
            <h1>Edit</h1>
            
            {selectedPuzzle == null? 
            <ConstraintWriter cons={cons} setCons={setCons} texts={text} setTexts={setTexts} categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart}/> :
            
            <div> 
                <button className="likeButton" onClick={toggleLike}><img src={img} width="30" height="30"/></button>
                <ShowAndEdit generatedPuzzle={selectedPuzzle} cons={cons} setCons={setCons} texts={text} setTexts={setTexts} categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart}/> 
                <button className="smallButton" onClick={()=> setSelectedPuzzle(null)} >Unselect Current Puzzle</button>
            </div>
               } 
        
        </div>

        <div className="cropped">
            <h1>Generate</h1>
            <button className="mediumButton" disabled={inEvolution} onClick={generateNext}>{evolveSess == null? "Generate First Round": "Generate Next Round"}</button>
           <ShowGeneratedPuzzle generated={puzzles} select={setSelectedPuzzle} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
            
        </div>
    </div>

    let puzzleDisplay = <div>

         <PlayablePuzzleList puzzles={likedPuzzles} evolveSession={evolveSess} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
    </div>

    

    return <div className='body'>
        <button className="returnButton" onClick={goBack}><img src={"./icons/back.png"} width="30" height="30"/></button>

        <Collapseable content={design} title={"Design Puzzle"}/> 

        <Collapseable content={puzzleDisplay} title="Liked Puzzles" /> 
i89

    </div>

}