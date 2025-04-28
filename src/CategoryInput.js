import { useEffect, useState} from "react"
import { postEvolution, add_cat, add_scen } from "./API/SendToApi"
import { getSampleCategories, getScenarios } from "./API/GetFromApi"
import "./AuthoringStyle.css"
import EditTemplate from "./EditTemplate"
import EditBrainstorm from "./EditBrainstorm"
import Collapseable from "./Collapseable"
import { add_click } from "./API/SendToApi"


let CategoryMaker = ({categories, setCategories, index, numEntities, sessionId, sessionStart, can_save = false, user=null}) => {

    let [list, setList] = useState([])
    let [name, setName] = useState(categories[index].name)
    let [is_numeric, setNumeric] = useState(categories[index].is_numeric)
    let [inc, setInc] = useState(categories[index].inc)

    const newCategories = categories.map((element, i) =>{
        if(i == index){
            return {
                name:name, 
                entities:list, 
                is_numeric:is_numeric, 
                inc: inc
            
            }
        }else{
            return element 
        }
    })

    useEffect(() =>{
        setCategories(newCategories)
    }, [name, list,is_numeric, inc])


    let save_categories = () => {
        add_cat(categories[index], user)
        can_save = false 

    }
  



    if(list.length < numEntities){
        let li = list 
        
        while (li.length < numEntities){
            if(categories[index].entities.length > li.length){
                li.push(categories[index].entities[li.length])
            }else{
                li.push("entity");  
            }
   
        }

        setList(li)
        
    }else if (list.length > numEntities){
        let li = list 
        while(li.length > numEntities){
            li.pop()
        }
        setList(li)
    }
    

    let listInput = list.map((element, idx) => <li key={idx}><input value ={element} onClick = {() => add_click(sessionId, "edit entity", sessionStart)}onChange={e => {
        const nextList= list.map((element, i) => {
            if (i === idx) {
              return e.target.value;
            } else {
              return element;
            }
          });
          setList(nextList);
    }}/></li>)

    return (<div className="categoryDiv">
        <input className="categoryInput" value={name} onChange={e => setName(e.target.value)}/>
        <ol className="entityList">
            {listInput}
        </ol>
        <label> Category is numeric:</label><input checked={is_numeric} type="checkbox" onChange={() => setNumeric(!is_numeric)}/> 
        {is_numeric?  <div><label> Increment Value:</label><input type="number" onChange={(e) => setInc(e.target.value)} value={inc}></input></div> : ""}
        
    </div>)
    
}





export default PuzzleMaker = ({startEvolve, user, mode, scenario, setScenario, name, setName, sessionId, sessionStart}) =>{
    let [categories, setCategories] = useState([]); 
    let [numEntites, setNumEntities] = useState(4); 
    let [templates, setTemplates] = useState(<div>Loading</div>)
    let [tempCats, setTempCats] = useState([])
    let [numEmpty, setNumEmpy] = useState([0])

    let [scens, setScens] = useState([])
    let [suggest, setSuggest] = useState([])
    let [other, setOther] = useState([])

    let [updatedScen, setUpdatedScen] = useState(false)



    let categoryCreators = categories.map((cat, idx) => {
        return <CategoryMaker key={idx} categories={categories} setCategories={setCategories} index ={idx} numEntities={numEntites} starterName="name" can_save user={user} sessionId={sessionId} sessionStart={sessionStart}/> 
    })

    let evolvePuzzle=() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzle = await postEvolution(categories)
            resolve(puzzle)
        })
    }

    let getScens =() => {
        return new Promise(async (resolve, reject) =>{
            
            cats = await getScenarios(user, mode == "causal" || mode == "mixed")
            resolve(cats)
        })
    }

    
    useEffect (() => 
            {async function fetch() { 
                getScens().then(
                    
                    (scens) =>{
                        console.log(scens)
                    scens.map((s) => {
                        let c = s.categories.map((cat) => {
                            let cat2 = cat
                            cat2["origin"] = s.origin 
                            return cat 

                        })

                        s.categories = c 
                        return s 
                    })
                    setScens(scens)
                })}
            fetch()
    
            }, []  )
    
            
        let updateScenario = (s) => {

           
          
            setScenario(s.scenario)
            setName(s.name)
            
            setSuggest(s.categories) 

            let others = scens.filter((s2) => s2 != s).map((s2) => s2.categories) 
            others = others.flat()
            setOther(others)
            setUpdatedScen(true)


        }
      
    console.log(other)
    tempbutton =  tempCats.map((cat, idx) => {
        return <button className="smallButton" key={idx}  onClick={()=>setCategories([...categories, cat])} >{cat.name}</button>
        })


    scenarioButton = scens.map((s, idx) => {
        return <button className={s.origin == "sample"? "sampleButton": "userButton"} key={idx}  onClick={() => {updateScenario(s); add_click(sessionId, "select scenario", sessionStart)}} >{s.name}</button>

    })


    scenarioButton.push(<button button className="userButton" key={scens.length}  onClick={() => {updateScenario({"name": "custom scenario", "scenario": "Enter scenario text", "categories": []}); add_click(sessionId, "new scenario", sessionStart)}}>Create New Scenario</button>)

    suggestedButton =  suggest.map((cat, idx) => {
        return <button className={cat.origin == "sample"? "sampleButton": "userButton"} key={idx}  onClick={()=>{setCategories([...categories, cat]); cat.origin == "sample"? add_click(sessionId, "add example category", sessionStart): ""}} >{cat.name}</button>
        })

    otherButton =  other.map((cat, idx) => {
            return <button className={cat.origin == "sample"? "sampleButton": "userButton"} key={idx}   onClick={()=>{setCategories([...categories, cat]); cat.origin == "sample"? add_click(sessionId, "add example category", sessionStart): ""}} >{cat.name}</button>
            })

    let sampleCategories = <div>

            <h1>Pick a Scenario</h1>
                <div className="categoryTemplate">
                    {scenarioButton}
                </div>

            <h1>Suggested Categories</h1>
                <div className="categoryTemplate">
                    {suggestedButton}
                </div>
            
                <h1>Other Categories</h1>
                <div className="categoryTemplate">
                    {otherButton}
                </div>
        </div>

    let editGrammar = <div>

            <EditTemplate categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
            <EditBrainstorm categories={categories} user={user}  sessionId={sessionId} sessionStart={sessionStart}/>  
    </div>

    return <div className="puzzleView">

    <div className="puzzleViewLeft">

    
        {updatedScen? <div className="authoringView">
            <h1>Name</h1>
            <input className="categoryInput" value={name} onChange={e => setName(e.target.value)}/>
       
        <h1> Scenario</h1>
        <textarea className={"scenarioInput"} value={scenario} onChange={(e)=> setScenario(e.target.value)} onClick={() => add_click(sessionId, "edit narrative", sessionStart)}/>
        

            <div>
                Number of entities: <button onClick={()=>{if(numEntites > 3) {setNumEntities(numEntites - 1)}}}>-</button> {numEntites}     <button onClick={()=>setNumEntities(numEntites + 1)}>+</button>
            </div>

        


            <h1>Categories</h1>
            <div className="categories">

            {categoryCreators}
            
            </div>


            <div>
            <button className="mediumButton" onClick={()=>add_scen(user, name, scenario, categories)}>Save Scenario</button>
            <button className="mediumButton" onClick={()=>{setCategories([...categories, {name:"Name", entities:[], is_numeric:false, inc:1}]);add_click(sessionId, "new category", sessionStart)}}>Add Custom category</button>
            <button className="mediumButton" onClick={()=>setCategories(
                        categories.slice(0, categories.length -1)
                    )}>Remove Last Category</button>
                 

              

                

                </div>
  
           




               <div> <button className="largeButton" onClick={() => startEvolve(categories)}>Start Generation</button></div>
     


        </div> : <div>Select Scenario</div>}

    </div>

    <div className="puzzleViewRight">
        <div className="authoringView">

                <Collapseable content={sampleCategories} title="Scenarios" showByDefault={true}/> 
                <Collapseable content={editGrammar} title="Edit Grammar and Ideas" showByDefault={mode == "serious"}/> 

                

            </div>

    </div> 

    </div>
    
    
}