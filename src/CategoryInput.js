import { alertTitleClasses } from "@mui/material"
import { useEffect, useState } from "react"
import { getScenarios } from "./API/GetFromApi"
import {add_click, newScenario, update_scen} from "./API/SendToApi"
import "./AuthoringStyle.css"
import "./ViewPuzzlesStyle.css"
import Collapseable from "./Collapseable"
import EditTemplate from "./EditTemplate"
import { sanitize } from "./utils"

let CategoryWarning = ({categories, numEntities}) => {
    let insufficientWarning = <b>Add at least 2 categories to start generation</b>
    let slowdownWarning = <i><b>Warning:</b> Generation may be slow with more than 3 categories or more than 4 entities."</i>
    let insufficient = false
    let slowdown = false
    if (categories.length < 2) {
        insufficient = true
    }
    if (numEntities > 4 || categories.length > 3) {
        slowdown = true
    }

    if (insufficient && slowdown) {
        return <p>
            {insufficientWarning}
            <br/>
            {slowdownWarning}
        </p>
    } else if (insufficient) {
        return <p>{insufficientWarning}</p>
    } else if (slowdown) {
        return <p>{slowdownWarning}</p>
    } else {
        return <p/>
    }
};

let CategoryMaker = ({ categories, setCategories, index, numEntities, sessionId, sessionStart, can_save = false, user = null}) => {

    let [list, setList] = useState(categories[index].entities)
    let [name, setName] = useState(categories[index].name)
    let [is_numeric, setNumeric] = useState(categories[index].is_numeric)
    let [inc, setInc] = useState(categories[index].inc)
    let [deleteMe, setDeleteMe] = useState(false)

    

    useEffect(() => {
        const newCategories = categories.map((element, i) => {
            if (i == index) {
                if (deleteMe) {
                    setName(element.name)
                    setList(element.entities)
                    setNumeric(element.is_numeric)
                    setInc(element.inc)
                    setDeleteMe(false)
                    return element
                }
                return {
                    name: name,
                    entities: list,
                    is_numeric: is_numeric,
                    inc: inc
                }
            } else {
                return element
            }
        })

        setCategories(newCategories)

    }, [name, list, is_numeric, inc, deleteMe])


    let save_categories = () => {
        add_cat(categories[index], user)
        can_save = false

    }


    let deleteCategory = (index) => {
        setCategories(
            categories.toSpliced(index, 1)
        )
        setDeleteMe(true)
    }

    useEffect(() => {
        if (list.length < numEntities) {
            let li = list
    
            while (li.length < numEntities) {
                if (categories[index].entities.length > li.length) {
                    li.push(categories[index].entities[li.length])
                } else {
                    li.push("entity");
                }
    
            }
    
            setList(li)
    
        } else if (list.length > numEntities) {
            let li = list
            while (li.length > numEntities) {
                 li.pop()
            }
            setList(li)
        }
    }, [numEntities])

    


    let listInput = list.map((element, idx) => <li key={idx}><input value={element} onClick={() => add_click(user, sessionId,"Edit Entity", sessionStart)} onChange={(e) => {
        const nextList = list.map((element, i) => {
            if (i === idx) {
                return sanitize(e.target.value);
            } else {
                return element;
            }
        });
        setList(nextList);
    }} /></li>)

    return (<div className="categoryDiv">
        <input className="categoryInput" value={name} onChange={(e) => {setName(sanitize(e.target.value)); add_click(user, sessionId, "Edit Category", sessionStart)}} />
        <ol className="entityList">
            {listInput}
        </ol>
        <label> Category is numeric:</label><input checked={is_numeric} type="checkbox" onChange={() => setNumeric(!is_numeric)} />
      

        <button className="smallButton" onClick={() => { deleteCategory(index) }}>Delete Category</button>
    </div>)

}


let EvolveCard = ({idx, evolveId, continueEvolve, disabled,user, sessionId, sessionStart}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">Session: {idx + 1}</p>
      <p class="text-body-small">With id: {evolveId}</p>
    </div>
    <button class="card-button" disabled={disabled} onClick={() => {continueEvolve(evolveId); add_click(user, sessionId, "Continue Evolve Session", sessionStart)}}>Start Session</button>
  </div>
}


let NewCard = ({startEvolve, disabled, user, sessionId, sessionStart}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">Create New</p>
      <p class="text-body-large">+</p>
    </div>
    <button disabled={disabled} class="card-button" onClick={() => {startEvolve(); add_click(user, sessionId, "New Evolve Session", sessionStart)}}>New Session</button>
  </div>
}

function isEqual(obj1, obj2) {
    var props1 = Object.getOwnPropertyNames(obj1);
    var props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length != props2.length) {
        return false;
    }
    for (var i = 0; i < props1.length; i++) {
        let val1 = obj1[props1[i]];
        let val2 = obj2[props1[i]];
        let isObjects = isObject(val1) && isObject(val2);
        if (isObjects && !isEqual(val1, val2) || !isObjects && val1 !== val2) {
            return false;
        }
    }
    return true;
}
function isObject(object) {
  return object != null && typeof object === 'object';
}

export default PuzzleMaker = ({ startEvolve, continueEvolve, user, scenarioId, setScenarioId, scenario, setScenario, sessionId, sessionStart, goBack }) => {
    let [categories, setCategories] = useState([]);
    startingEnts = scenario["data"]["categories"].length == 0? 4: scenario["data"]["categories"][0].entities.length
    let [numEntities, setNumEntities] = useState(startingEnts);
    let [title, setTitle] = useState("")
    let [desc, setDesc] = useState("")
    startingScen = scenario["data"]["categories"].length == 0? {}: scenario["data"]
    let [tempScen, setTempScen] = useState(startingScen)
    let [canSave, setCanSave] = useState(true)
    //let [edited, setEdited] = useState(false)

    let startEvolution = () => {
        if (edited || scenarioId == null){
            alert("Please save the scenario before starting a evolution session")
        }else{
            startEvolve()
        }
    }

    edited = !((tempScen["title"] == scenario["data"]["title"]) && 
            (tempScen["desc"] == scenario["data"]["desc"]) && 
            (isEqual(tempScen["categories"], scenario["data"]["categories"])))

    let createScen = async () => {
        setCanSave(false)
        let result =await  newScenario(user, new Date(), tempScen)
        setScenarioId(result)
        setScenario({... scenario,
            "evolve_sessions": [], 
            "data":tempScen})

        setCanSave(true)
    }

    let updateScene = async () => {
        setCanSave(false)
        let result =await update_scen(user, scenarioId, new Date(),  tempScen)
        setScenarioId(result)
        setScenario({... scenario,
            "data":tempScen})
      
        setCanSave(true)
    }
    useEffect(() => {
   
            setCategories(scenario["data"]["categories"])
            setTitle(scenario["data"]["title"])
            setDesc(scenario["data"]["desc"])
    
    }, [])
    useEffect(() => {
        scen = {"title": title, "desc": desc, "categories": categories}
        setTempScen(scen)
    }, [title, desc, categories])

    let categoryCreators = categories.map((cat, idx) => {
        return <CategoryMaker key={idx} categories={categories} setCategories={setCategories} index={idx} numEntities={numEntities} starterName="name" canSave user={user} sessionId={sessionId} sessionStart={sessionStart} />
    })


    evolveCards = scenario["evolve_sessions"].map((evo,i) => <EvolveCard idx={i} disabled={edited} key={evo} evolveId={evo}  continueEvolve={continueEvolve} user={user} sessionId={sessionId} sessionStart={sessionStart}/>)

    newEvolve= <NewCard disabled={edited} key={"new"} startEvolve={startEvolution} user={user} sessionId={sessionId} sessionStart={sessionStart}/> 

    evolveCards.push(newEvolve)

    
    return <div className="body">
        

        <div className="puzzleViewLeft">

            <div className="authoringView">
            <div><button className="returnButton" onClick={goBack}><img src={"./icons/back.png"} width="30" height="30"/></button> </div>

                <h1>Scenario Title</h1>
                <input className="categoryInput" value={title} onChange={e => {setTitle(sanitize(e.target.value), title);add_click(user, sessionId, "Edit scenario title", sessionStart)}} />

                <h1>Narrative</h1>
                <textarea className={"scenarioInput"} value={desc} onChange={(e) => {setDesc(sanitize(e.target.value))}} onClick={() => add_click(user, sessionId, "Edit narrative", sessionId, sessionStart)} />




                <h1>Categories</h1>
                <div className="categories">

                    {categoryCreators}

                </div>


                <div>
            <button className="mediumButton" onClick={() => { setCategories([...categories, { name: "Name", entities: [], is_numeric: false, inc: 1 }]); add_click(user, sessionId, "New category", sessionStart) }}>Create New Category</button>
                   {scenarioId == null ? 
                    <div><button  className="mediumButton" onClick={createScen}>{edited? "*": ""} Save Scenario</button></div>
                    : 
                    <div>
                        <button disabled={!edited}  className="mediumButton" onClick={createScen}>{edited? "*": ""} Save Scenario</button>
                        <button disabled={!edited}  className="mediumButton" onClick={updateScene}>{edited? "*": ""} Save as New Scenario</button>
                    </div>
                }
                   
                </div>

                <div>
                    Number of entities: <button onClick={() => { if (numEntities > 3) { setNumEntities(numEntities - 1) } }}>-</button> {numEntities}     <button onClick={() => setNumEntities(numEntities + 1)}>+</button>
                </div>
                <div> 
                    {/*<CategoryWarning categories={categories} numEntities={numEntities}/>
                    <button className="largeButton" onClick={() => startEvolve(categories)}>Start Generation</button></div>*/}

            </div>

        </div>

        </div>
        <div className="puzzleViewRight">
            <div className="authoringView">

                
            <h1>Evolution Sessions</h1>
            <div className="cardList">
             {evolveCards}
            </div>
            
               
           
            </div>

        </div>
    
</div>


}