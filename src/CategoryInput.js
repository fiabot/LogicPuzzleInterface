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

let CategoryMaker = ({ categories, setCategories, index, numEntities, sessionId, sessionStart, can_save = false, user = null, setEdited }) => {

    let [list, setList] = useState([])
    let [name, setName] = useState(categories[index].name)
    let [is_numeric, setNumeric] = useState(categories[index].is_numeric)
    let [inc, setInc] = useState(categories[index].inc)
    let [deleteMe, setDeleteMe] = useState(false)

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

    useEffect(() => {
        setCategories(newCategories)
        setEdited(true)
    }, [name, list, is_numeric, inc])


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


    let listInput = list.map((element, idx) => <li key={idx}><input value={element} onClick={() => add_click(user, "edit entity", sessionStart)} onChange={e => {
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
        <input className="categoryInput" value={name} onChange={e => setName(sanitize(e.target.value))} />
        <ol className="entityList">
            {listInput}
        </ol>
        <label> Category is numeric:</label><input checked={is_numeric} type="checkbox" onChange={() => setNumeric(!is_numeric)} />
        {is_numeric ? <div><label> Increment Value:</label><input type="number" onChange={(e) => setInc(e.target.value)} value={inc}></input></div> : ""}

        <button className="smallButton" onClick={() => { deleteCategory(index) }}>Disable Category</button>
    </div>)

}


let EvolveCard = ({ evolveId, continueEvolve}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">session: {evolveId}</p>
      <p class="text-body">TODO: what to put here</p>
    </div>
    <button class="card-button" onClick={() => continueEvolve(evolveId)}>Start Session</button>
  </div>
}


let NewCard = ({startEvolve}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">Create New</p>
      <p class="text-body">TODO: replace with plus sign</p>
    </div>
    <button class="card-button" onClick={startEvolve}>New Session</button>
  </div>
}


export default PuzzleMaker = ({ startEvolve, continueEvolve, user, scenarioId, setScenarioId, scenario, setScenario, sessionId, sessionStart }) => {
    let [categories, setCategories] = useState([]);
    let [numEntities, setNumEntities] = useState(4);
    let [title, setTitle] = useState("")
    let [desc, setDesc] = useState("")
    let [tempScen, setTempScen] = useState({})
    let [canSave, setCanSave] = useState(true)
    let [edited, setEdited] = useState(false)

    let createScen = async () => {
        setCanSave(false)
        let result =await  newScenario(user, new Date(), tempScen)
        setScenarioId(result)
        setScenario({... scenario,
            "data":tempScen})
        setEdited(false)
        setCanSave(true)
    }

    let updateScene = async () => {
        setCanSave(false)
        let result =await update_scen(user, scenarioId, new Date(),  tempScen)
        setScenario({... scenario,
            "data":tempScen})
        setEdited(false)
        setCanSave(true)
    }
    useEffect(() => {
        if (scenarioId != null){
            setCategories(scenario["data"]["categories"])
            setTitle(scenario["data"]["title"])
            setDesc(scenario["data"]["desc"])
        }
    }, [])
    useEffect(() => {
        scen = {"title": title, "desc": desc, "categories": categories}
        setTempScen(scen)
    }, [title, desc, categories])

    let categoryCreators = categories.map((cat, idx) => {
        return <CategoryMaker key={idx} categories={categories} setCategories={setCategories} index={idx} numEntities={numEntities} starterName="name" canSave user={user} sessionId={sessionId} sessionStart={sessionStart} setEdited={setEdited} />
    })


    evolveCards = scenario["evolve_sessions"].map((evo) => <EvolveCard key={evo} evolveId={evo}  continueEvolve={continueEvolve}/>)

    newEvolve= <NewCard key={"new"} startEvolve={startEvolve}/> 

    evolveCards.push(newEvolve)

    
    return <div className="body">

        <div className="puzzleViewLeft">

            <div className="authoringView">
                <h1>Scenario Title</h1>
                <input className="categoryInput" value={title} onChange={e => {setTitle(sanitize(e.target.value), title);setEdited(true)}} />

                <h1>Narrative</h1>
                <textarea className={"scenarioInput"} value={desc} onChange={(e) => {setDesc(sanitize(e.target.value)); setEdited(true)}} onClick={() => add_click(user, "edit narrative", sessionId, sessionStart)} />




                <h1>Categories</h1>
                <div className="categories">

                    {categoryCreators}

                </div>


                <div>
            <button className="mediumButton" onClick={() => { setCategories([...categories, { name: "Name", entities: [], is_numeric: false, inc: 1 }]); add_click(user, "new category", sessionStart) }}>Create New Category</button>
                   {scenarioId == null ? 
                    <button disabled={!edited}  className="mediumButton" onClick={createScen}>{edited? "*": ""} Save Scenario</button>
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