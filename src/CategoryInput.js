import { useEffect, useState } from "react"
import { getScenarios } from "./API/GetFromApi"
import { add_cat, add_click, add_scen, postEvolution } from "./API/SendToApi"
import "./AuthoringStyle.css"
import Collapseable from "./Collapseable"
import EditTemplate from "./EditTemplate"


let CategoryMaker = ({ categories, setCategories, index, numEntities, sessionId, sessionStart, can_save = false, user = null }) => {

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


    let listInput = list.map((element, idx) => <li key={idx}><input value={element} onClick={() => add_click(sessionId, "edit entity", sessionStart)} onChange={e => {
        const nextList = list.map((element, i) => {
            if (i === idx) {
                return e.target.value;
            } else {
                return element;
            }
        });
        setList(nextList);
    }} /></li>)

    return (<div className="categoryDiv">
        <input className="categoryInput" value={name} onChange={e => setName(e.target.value)} />
        <ol className="entityList">
            {listInput}
        </ol>
        <label> Category is numeric:</label><input checked={is_numeric} type="checkbox" onChange={() => setNumeric(!is_numeric)} />
        {is_numeric ? <div><label> Increment Value:</label><input type="number" onChange={(e) => setInc(e.target.value)} value={inc}></input></div> : ""}

        <button className="smallButton" onClick={() => { deleteCategory(index) }}>Disable Category</button>
    </div>)

}





export default PuzzleMaker = ({ startEvolve, user, mode, scenario, setScenario, name, setName, sessionId, sessionStart }) => {
    let [categories, setCategories] = useState([]);
    let [numEntites, setNumEntities] = useState(4);
    let [templates, setTemplates] = useState(<div>Loading</div>)
    let [tempCats, setTempCats] = useState([])
    let [numEmpty, setNumEmpy] = useState([0])

    let [scens, setScens] = useState([])
    let [cats, setCats] = useState([])
    let [suggest, setSuggest] = useState([])
    let [scenUpdated, setScenUpdated] = useState(false)
    let [origin, setOrigin] = useState("sample")
    let [overwriting, setOverwriting] = useState(false)

    let categoryCreators = categories.map((cat, idx) => {
        return <CategoryMaker key={idx} categories={categories} setCategories={setCategories} index={idx} numEntities={numEntites} starterName="name" can_save user={user} sessionId={sessionId} sessionStart={sessionStart} />
    })

    let evolvePuzzle = () => {
        return new Promise(async (resolve, reject) => {

            puzzle = await postEvolution(categories)
            resolve(puzzle)
        })
    }

    let getScens = () => {
        return new Promise(async (resolve, reject) => {
            cats = await getScenarios(user, mode == "casual" || mode == "mixed" || mode == "admin")
            if (mode == "serious"){
                cats = cats.filter((cat) => cat.origin == "user")
            }
            resolve(cats)
        })
    }

    let fetch = async () => {
        getScens().then(
            (scens) => updateScens(scens)
        )
    }

    let updateName = (newName, scens) => {
        setName(newName)
        shouldOverwrite = false
        overwriteScen = null
        adminScen = null
        // Go through existing scenarios
        for (let scen of scens) {
            // Find any scenario with the same name
            if (scen.name == newName) {
                // Check if the scenario should be overwritten by the user (because the user created it or the user is an admin)
                if (scen.origin == "user" || mode == "admin") {
                    shouldOverwrite = true
                    overwriteScen = scen
                }
                else {
                    adminScen = scen
                }
            }
        }

        // Set the value of overwriting appropriately, 
        // if it is not currently at the correct value.
        // We check the current value to avoid triggering React updates in a loop.
        if (!overwriting && shouldOverwrite) {
            setOverwriting(true)
        } else if (overwriting && !shouldOverwrite) {
            setOverwriting(false)
        }

        shouldSuggest = []
        if (overwriteScen != null) {
            shouldSuggest = overwriteScen.categories
        } else if (adminScen != null) {
            shouldSuggest = adminScen.categories
        } 

        // Check if suggested categories should be updated.
        equal = true
        for (cat1 of shouldSuggest) {
            found = false
            for (cat2 of suggest) {
                if (cat1.name == cat2.name) {
                    found = true
                    continue
                }
            }
            if (!found) {
                equal = false
                break
            }
        }
        if (equal) {
            for (cat1 of suggest) {
                found = false
                for (cat2 of shouldSuggest) {
                    if (cat1.name == cat2.name) {
                        found = true
                        continue
                    }
                }
                if (!found) {
                    equal = false
                    break
                }
            }
        }
        if (!equal) {
            setSuggest(shouldSuggest)
        }
    }

    let updateScens = (scens) => {
        nameFound = false
        toUpdate = null
        scens.map((s) => {
            let c = s.categories.map((cat) => {
                let cat2 = cat
                cat2["origin"] = s.origin
                return cat

            })

            s.categories = c

            if (name == s.name) {
                if (s.origin == "user" || mode == "admin" || !nameFound) {
                    toUpdate = s
                    nameFound = true
                } 
            }
            return s
        })
        setScens(scens)
        let cats = scens.map((s2) => s2.categories).flat()
        let nodupes = []
        let samplecatnames = []
        let usercatnames = []
        for (let cat of cats) {
            if (cat["origin"] == "user" && !usercatnames.includes(cat["name"])) {
                usercatnames.push(cat["name"])
                nodupes.push(cat)
            }
            else if (cat["origin"] == "sample" && !samplecatnames.includes(cat["name"])) {
                samplecatnames.push(cat["name"])
                nodupes.push(cat)
            }
        }
        cats = nodupes
        setCats(cats)
        if (nameFound) {
            updateScenario(toUpdate, scens)
        }
    }

    useEffect(() => {
        async function fetch() { 
            getScens().then(
                (scens) => updateScens(scens)
            )
        }
        fetch()
    }, [])


    let updateScenario = (s, scens) => {
        setScenario(s.scenario)
        setScenUpdated(true)
        setSuggest(s.categories)
        setOrigin(s.origin)
        updateName(s.name, scens)
    }

    tempbutton = tempCats.map((cat, idx) => {
        return <button className="smallButton" key={idx} onClick={() => setCategories([...categories, cat])} >{cat.name}</button>
    })

    scenarioButton = scens.map((s, idx) => {
        className = "userButton"
        if (s.origin == "sample") {
            className = "sampleButton"
        }
        if (name == s.name) {
            if (overwriting && (s.origin == "user" || mode == "admin")) {
                className += " selectedScenario"
            } 
            else if (!overwriting && s.origin == "sample") {
                className += " selectedScenario"
            }
        } 
        return <button className={className} key={idx} onClick={() => { updateScenario(s, scens); add_click(sessionId, "select scenario", sessionStart) }} >{s.name}</button>
    })

    scenarioButton.push(<button button className="userButton" key={scens.length} onClick={() => { updateScenario({ "name": "custom scenario", "scenario": "Enter scenario text", "categories": [], "origin": "new"}, scens); add_click(sessionId, "new scenario", sessionStart) }}><b>+ New Scenario</b></button>)

    categoryButton = cats.map((cat, idx) => {
        return <button className={cat.origin == "sample" ? "sampleButton" : "userButton"} key={idx} onClick={() => { setCategories([...categories, cat]); cat.origin == "sample" ? add_click(sessionId, "add example category", sessionStart) : "" }} >{cat.name}</button>
    })

    suggestedButton = suggest.map((cat, idx) => {
        return <button className={cat.origin == "sample" ? "sampleButton" : "userButton"} key={idx} onClick={() => { setCategories([...categories, cat]); cat.origin == "sample" ? add_click(sessionId, "add example category", sessionStart) : "" }} >{cat.name}</button>
    })

    let sampleCategories = <div>

        <h1>Scenarios</h1>
        <div className="categoryTemplate">
            {scenarioButton}
            <hr />
            <p>Scenario Categories</p>
            {suggestedButton}
        </div>

        <h1>All Categories</h1>
        <div className="categoryTemplate">
            {categoryButton}
        </div>
    </div>

    let editGrammar = <div>
        <EditTemplate categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart} />
    </div>

    if (!scenUpdated) {
        updateScenario({ "name": "custom scenario", "scenario": "Enter scenario text", "categories": [], "origin": "new"}, scens)
    }

    return <div className="puzzleView">

        <div className="puzzleViewLeft">

            <div className="authoringView">
                <h1>Scenario Title</h1>
                <input className="categoryInput" value={name} onChange={e => updateName(e.target.value, scens)} />

                <h1>Narrative</h1>
                <textarea className={"scenarioInput"} value={scenario} onChange={(e) => setScenario(e.target.value)} onClick={() => add_click(sessionId, "edit narrative", sessionStart)} />




                <h1>Categories</h1>
                <div className="categories">

                    {categoryCreators}

                </div>


                <div>
                    <button className="mediumButton" onClick={() => { add_scen(user, name, scenario, categories).then(() => {fetch()}) }}>{overwriting? 'Overwrite Scenario "' + name + '"' : 'Save New Scenario'}</button>

                    <button className="mediumButton" onClick={() => { setCategories([...categories, { name: "Name", entities: [], is_numeric: false, inc: 1 }]); add_click(sessionId, "new category", sessionStart) }}>Create New Category</button>

                    {/* <button disabled={scenId == 0 || origin == "sample"} className="mediumButton" onClick={() => { update_scen(user, name, scenario, categories).then(() => fetch()) }}>Update Scenario</button>

                    <button disabled={scenId == 0 || origin == "sample"} className="mediumButton" onClick={() => { delete_scen(user, name).then(() => fetch()) }}>Delete Scenario</button> */}
                </div>

                <div>
                    Number of entities: <button onClick={() => { if (numEntites > 3) { setNumEntities(numEntites - 1) } }}>-</button> {numEntites}     <button onClick={() => setNumEntities(numEntites + 1)}>+</button>
                </div>
                <div> <button className="largeButton" onClick={() => startEvolve(categories)}>Start Generation</button></div>

            </div>

        </div>

        <div className="puzzleViewRight">
            <div className="authoringView">

                <Collapseable content={sampleCategories} title="Scenarios" showByDefault={true} />
                <Collapseable content={editGrammar} title="Edit Default Grammar and Narrative Suggestions for Current Categories" showByDefault={mode == "serious"} />
            </div>

        </div>

    </div>


}