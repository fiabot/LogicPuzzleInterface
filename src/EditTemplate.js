import { useEffect, useState} from "react"
import { get_unused_grammar, get_is_template, get_not_template, get_or_template, get_before_template } from "./API/GetFromApi"
import { add_is, add_not, add_or, add_before } from "./API/SendToApi"


let EditIs = ({empty, categories, user, update, type = "is"}) => {
    let [cat1, setCat1] = useState(null)
    let [cat2, setCat2] = useState(null)
    let [current, setCurrent] = useState("") 
    let [template, setTemplate] = useState("")


    let selectEmpty= ""
    let create = ""
    let edit = <div>Select Categories</div>

    
        if (type in empty){
            let selectButton = empty[type]["empty"].map((value, idx) => {
                return <button className="smallButton" key={idx} onClick={() => {setCat1(value.cat1); setCat2(value.cat2); setCurrent(empty[type].default_temp)}}>{value.cat1}:{value.cat2}</button>
            })
            selectEmpty = 
            <div>
            {selectButton}
            </div> }

        
        let changeCat = async (num, value) => {
            tempCat1 = cat1
            tempCat2 = cat2
            if (num == 1){
                setCat1(value)
                tempCat1 = value
            }else{
                setCat2(value)
                tempCat2 = value
            }

            if (tempCat1 != null && tempCat2 != null){
                if (type == "is"){
                    setCurrent(await get_is_template(tempCat1, tempCat2, user))
                }else{
                    setCurrent(await get_not_template(tempCat1, tempCat2, user))
                }
                

            } 

        }

        let catNames = categories.map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        catNames =  [<option key={-1} value={null}>Select....</option>].concat(catNames)

        create = <div>
            <p>Select category 1: <select onChange={(e) => changeCat(1, e.target.value)}>{catNames}</select></p>
            <p>Select category 2: <select onChange={(e) => changeCat(2, e.target.value)}>{catNames}</select></p>
        </div>
      

       
  
        let create_example= (t) => {
            cat1Ents = categories.filter((value) => value.name == cat1)[0].entities 
            cat2Ents = categories.filter((value) => value.name == cat2)[0].entities 

            ent1 =  cat1Ents[Math.floor(Math.random() * cat1Ents.length)];
            ent2 =  cat2Ents[Math.floor(Math.random() * cat2Ents.length)];

            t = t.replace("{cat1}", cat1)
            t= t.replace("{cat2}", cat2)
            t= t.replace("{ent1}", ent1)
            t= t.replace("{ent2}", ent2)
            return t
        }

        let submit = async () => {
            if (type == "is"){
                await add_is(cat1, cat2, template, user)
            }else{
                await add_not(cat1, cat2, template, user)
            }
            setCat1(null)
            setCat2(null)
            setUnspecifiedTemplate(null)
            setSpecifiedTemplate(null)
            update()
        }
        if (cat1 != null && cat2 != null){
        current_example = create_example(current)
        template_ex = create_example(template) 
        edit = <div>
            <h2>Editing "{type}" clue where: cat1 = {cat1} and cat2 = {cat2}</h2>
            {type == "is"? <p>{"Logic: The entity {ent1} in the category {cat1} is connect to the entity {ent2} in the category {cat2}"}</p> : <p>{"Logic: The entity {ent1} in the category {cat1} is not connect to the entity {ent2} in the category {cat2}"}</p> }
            <p>Current template: {current}</p>
            <p>Example of current template: {current_example}</p>
            <p>Enter template: <input value={template} onChange={(e) => setTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex}</p>
            <button onClick={submit}>Submit Template</button>

        </div>} 
    

    return <div>
        <h2>Select categories without templates</h2>
        {selectEmpty}
        <h2>Or select categories</h2>
        {create}
        <h2>Edit template</h2>
        {edit}
    </div>
}

let EditOr = ({empty, categories, user, update}) => {
    let [cat1, setCat1] = useState(null)
    let [cat2, setCat2] = useState(null)
    let [isCat, setIsCat] = useState(null)
    let [current, setCurrent] = useState("") 
    let [template, setTemplate] = useState("")


    let selectEmpty= ""
    let create = ""
    let edit = <div>Select Categories</div>

    
        if ("or" in empty){
            let selectButton = empty["or"]["empty"].map((value, idx) => {
                return <button className="smallButton" key={idx} onClick={() => {setCat1(value.cat1); setCat2(value.cat2); setIsCat(value.is_cat); setCurrent(empty["or"].default_temp)}}>{value.cat1}:{value.cat2}:{value.is_cat}</button>
            })
            selectEmpty = 
            <div>
            {selectButton}
            </div> }

        
        let changeCat = async (num, value) => {
            tempCat1 = cat1
            tempCat2 = cat2
            tempIs = isCat 
            if (num == 1){
                setCat1(value)
                tempCat1 = value
            }else if (num ==2) {
                setCat2(value)
                tempCat2 = value
            }else{
                tempIs = value
                setIsCat(value)
            }

            if (tempCat1 != null && tempCat2 != null && tempIs != null){
 
                setCurrent(await get_or_template(cat1, cat2, isCat, user))
              

            } 

        }

        let catNames = categories.map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        catNames =  [<option key={-1} value={null}>Select....</option>].concat(catNames)

        create = <div>
            <p>Select category 1: <select value={cat1} onChange={(e) => changeCat(1, e.target.value)}>{catNames}</select></p>
            <p>Select category 2: <select  value={cat2} onChange={(e) => changeCat(2, e.target.value)}>{catNames}</select></p>
            <p>Select is category: <select value={isCat} onChange={(e) => changeCat(3, e.target.value)}>{catNames}</select></p>
        </div>
      

       
  
        let create_example= (t) => {
            cat1Ents = categories.filter((value) => value.name == cat1)[0].entities 
            cat2Ents = categories.filter((value) => value.name == cat2)[0].entities 
            isCatEnts = categories.filter((value) => value.name == isCat)[0].entities

            ent1 =  cat1Ents[Math.floor(Math.random() * cat1Ents.length)];
            ent2 =  cat2Ents[Math.floor(Math.random() * cat2Ents.length)];
            isEnt =  isCatEnts[Math.floor(Math.random() * isCatEnts.length)];


            t = t.replace("{cat1}", cat1)
            t= t.replace("{cat2}", cat2)
            t= t.replace("{ent1}", ent1)
            t= t.replace("{ent2}", ent2)
            t = t.replace("{is_cat}", isCat)
            t = t.replace("{is_ent}", isEnt)
            return t
        }

        let submit = async () => {
            await add_or(cat1, cat2, isCat, template, user)
            setCat1(null)
            setCat2(null)
            setTemplate(null)
            update()
        }
        if (cat1 != null && cat2 != null && isCat != null){
        current_example = create_example(current)
        template_ex = create_example(template) 
        edit = <div>
            <h2>Editing "or" clue where: cat1 = {cat1} and cat2 = {cat2} and is_cat = {isCat}</h2>
            <p>Logic: {"Either the entity {ent1} in the category {cat1} or the entity {ent2} in the category {cat2} is connected to the entity {is_ent} in the category {is_cat}, but not both"}</p>
            <p>Current template: {current}</p>
            <p>Example of current template: {current_example}</p>
            <p>Enter template: <input value={template} onChange={(e) => setTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex}</p>
            <button onClick={submit}>Submit Template</button>

        </div>}
        else{
            edit = <div>Select categories</div>
        } 
    

    return <div>
        <h2>Select categories without templates</h2>
        {selectEmpty}
        <h2>Or select categories</h2>
        {create}
        <h2>Edit template</h2>
        {edit}
    </div>
}

let EditBefore = ({empty, categories, user, update}) => {
    let [cat1, setCat1] = useState(null)
    let [cat2, setCat2] = useState(null)
    let [numCat, setNumCat] = useState(null)
    let [currentUnspecified, setCurrentUnspecified] = useState("The {cat1} {ent1} is at least {step} {num_cat} before the {cat2} {ent2}.") 
    let [currentSpecified, setCurrentSpecified] = useState("The {cat1} {ent1} is {amount} {num_cat}s before the {cat2} {ent2}") 
    let [unspecifiedTemplate, setUnspecifiedTemplate] = useState("")
    let [specifiedTemplate, setSpecifiedTemplate] = useState("")
    let [currentStep, setCurrentStep] = useState(1)
    let [step, setStep] = useState(1) 


    let selectEmpty= ""
    let create = ""
    let edit = <div>Select Categories</div>

    
        if ("before" in empty){
            let selectButton = empty["before"]["empty"].map((value, idx) => {
                return <button className="smallButton" key={idx} onClick={() => {setCat1(value.cat1); setCat2(value.cat2); setNumCat(value.num_cat)}}>{value.cat1}:{value.cat2}:{value.num_cat}</button>
            })
            selectEmpty = 
            <div>
            {selectButton}
            </div> }

        
        let changeCat = async (num, value) => {
            tempCat1 = cat1
            tempCat2 = cat2
            tempNum = numCat 
            if (num == 1){
                setCat1(value)
                tempCat1 = value
            }else if (num ==2) {
                setCat2(value)
                tempCat2 = value
            }else{
                tempNum = value
                setNumCat(value)
            }

            if (tempCat1 != null && tempCat2 != null && numCat != null){
                console.log("Setting template")
                template = await get_before_template(cat1, cat2, numCat, user)
                setCurrentSpecified(template.timed)
                setCurrentUnspecified(template.untimed)
                setCurrentStep(template.step)
              

            } 

        }

        let catNames = categories.map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        catNames =  [<option key={-1} value={null}>Select....</option>].concat(catNames)

        let numCatName = categories.filter((value) => value.is_numerical = true).map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        numCatName =  [<option key={-1} value={null}>Select....</option>].concat(numCatName)

        create = <div>
            <p>Select category 1: <select value={cat1} onChange={(e) => changeCat(1, e.target.value)}>{catNames}</select></p>
            <p>Select category 2: <select  value={cat2} onChange={(e) => changeCat(2, e.target.value)}>{catNames}</select></p>
            <p>Select numeric category: <select value={numCat} onChange={(e) => changeCat(3, e.target.value)}>{numCatName}</select></p>
        </div>
      

       
  
        let create_example= (t, s=step) => {
            cat1Ents = categories.filter((value) => value.name == cat1)[0].entities 
            cat2Ents = categories.filter((value) => value.name == cat2)[0].entities 
 

            ent1 =  cat1Ents[Math.floor(Math.random() * cat1Ents.length)];
            ent2 =  cat2Ents[Math.floor(Math.random() * cat2Ents.length)];
           
            t = t.replace("{cat1}", cat1)
            t= t.replace("{cat2}", cat2)
            t= t.replace("{ent1}", ent1)
            t= t.replace("{ent2}", ent2)
            t = t.replace("{num_cat}", numCat)
            t = t.replace("{step}", s)
            amount = Math.floor(Math.random() * cat1Ents.length) + 1 

            t = t.replace("{amount}", amount)

    

            return t
            }

      

        let submit = async () => {
            await add_before(cat1, cat2, numCat, specifiedTemplate, unspecifiedTemplate, step, user)
    
            setCat1(null)
            setCat2(null)
            setNumCat(null)
            setSpecifiedTemplate(null)
            setUnspecifiedTemplate(null)
            update()
        }
        if (cat1 != null && cat2 != null && numCat != null){
        current_example_sp = create_example(currentSpecified, s=currentStep)
        current_example_un = create_example(currentUnspecified, s=currentStep)
        template_ex_sp = create_example(specifiedTemplate) 
        template_ex_un = create_example(unspecifiedTemplate)
        edit = <div>
            <h2>Editing "before" clue where: cat1 = {cat1} and cat2 = {cat2} and num_cat = {numCat}</h2>
            <p>Logic: { "The entity {ent1} in the category {cat1} is before/smaller then the {ent2} in the category {cat2}. The amount of which {ent1} is smaller may be specified or unspecified"}</p>
            <p>Current step: {currentStep}</p>
            <p>Enter step: <input type="number" value={step} onChange={(e) => setStep(e.target.value)}/></p>
            <p></p>
            <p>Current unspecified template: {currentUnspecified}</p>
            <p>Example of current template: {current_example_un}</p>
            <p>Enter unspecified template: <input value={unspecifiedTemplate} onChange={(e) => setUnspecifiedTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex_un}</p>
            <p></p>
            <p>Current specified template: {currentSpecified}</p>
            <p>Example of current template: {current_example_sp}</p>
            <p>Enter specified template: <input value={specifiedTemplate} onChange={(e) => setSpecifiedTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex_sp}</p>
            <button onClick={submit}>Submit Template</button>

        </div>}
        else{
            edit = <div>Select categories</div>
        } 
    

    return <div>
        <h2>Select categories without templates</h2>
        {selectEmpty}
        <h2>Or select categories</h2>
        {create}
        <h2>Edit template</h2>
        {edit}
    </div>
}

export default EditTemplates = ({categories, user}) => {

    let [numEmpty, setNumEmpty] = useState(0); 
    let [empty, setEmpty] = useState({})
    let [editType, setEditType] = useState("select")



    let update_num_empty = async(cats) => {
        let response = await get_unused_grammar(cats, user)
        let numEmpty = 0 

        setEmpty(response)

        Object.keys(response).forEach((value, index) => {numEmpty += response[value].empty.length})

        setNumEmpty(numEmpty)
    }
    let update = () => {
        update_num_empty(categories)
    }
    
    let content = <div>Select type</div>
    
    if (editType == "is"){
        content = <EditIs empty={empty} categories={categories} user={user} update={update}/>
    }else if (editType == "not"){
        content = <EditIs empty={empty} categories={categories} user={user} update={update} type ="not"/>
    }else if (editType == "or"){
        content = <EditOr empty={empty} categories={categories} user={user} update={update}/>
    }else if (editType == "before"){
        content = <EditBefore  empty={empty} categories={categories} user={user} update={update}/>
    }

 

    useEffect(()=> {
        //let cats = categories.map((value) => {return value.name})
        //console.log(cats)
        update_num_empty(categories)

    }, [categories])

    return <div>
        <h1>Manage Clue Templates</h1>
        <h2>Clues with default templates: {numEmpty}</h2>
        <h2>Select Clue type to edit</h2>
        <div>
            <button highlighted={(editType == "is")? "true": "false"} onClick={()=>setEditType("is")}className="mediumButton">IS {"is" in empty? "!" : ""}</button>
            <button  highlighted={(editType == "not")? "true": "false"} className="mediumButton" onClick={()=>setEditType("not")}>NOT {"not" in empty? "!" : ""}</button>
            <button highlighted={(editType == "before")? "true": "false"} className="mediumButton" onClick={()=>setEditType("before")}>BEFORE {"before" in empty? "!" : ""}</button>
            <button highlighted={(editType == "or")? "true": "false"} className="mediumButton" onClick={()=>setEditType("or")}>OR {"or" in empty? "!" : ""}</button>
        </div>
        {content}
    </div>

}