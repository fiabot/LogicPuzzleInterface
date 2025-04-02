import { useEffect, useState} from "react"
import { get_is_brainstorm, get_not_brainstorm, get_or_brainstorm, get_before_brainstorm } from "./API/GetFromApi"
import { add_is_brain, add_not_brain, add_or_brain, add_before_brain, add_click } from "./API/SendToApi"


let  get_ideas = (current, currentEx, setCurrentEx, create_example)  => {

    console.log(current)

    ex  = currentEx 

    let new_idea = () => {
        if(current  != null){

      
        if (current.length == 0){
            ex = "No ideas available yet" 
        }else{
            template = current[Math.floor(Math.random() * current.length)]
            ex = create_example(template)
        }

        setCurrentEx(ex)
        }
    }

    if (currentEx == ""){
        new_idea()
    }

    return <div>
        <p>Idea: {ex}</p>
        <button onClick={new_idea}>New Idea</button>
    </div>

}


let EditIs = ({ categories, user, type = "is", sessionId, sessionStart}) => {
    let [cat1, setCat1] = useState(null)
    let [cat2, setCat2] = useState(null)
    let [current, setCurrent] = useState(null) 
    let [currentEx, setCurrentEx] = useState("")
    let [template, setTemplate] = useState("")

    let edit = <div>Select Categories</div>

        
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
                    setCurrent(await get_is_brainstorm(tempCat1, tempCat2, user))
                }else{
                    setCurrent(await get_not_brainstorm(tempCat1, tempCat2, user))
                }
                

            }else{
                setCurrent(null)
                setCurrentEx("")
            } 

        }

        let cat1Names = categories.filter((c) => c.name != cat2).map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        cat1Names =  [<option key={-1} value={null}>Select....</option>].concat(cat1Names)

        let cat2Names = categories.filter((c) => c.name != cat1).map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        cat2Names =  [<option key={-1} value={null}>Select....</option>].concat(cat2Names)
      


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
            add_click(sessionId, "add brainstorm", sessionStart)

            if (type == "is"){
                await add_is_brain(cat1, cat2, template, user)
            }else{
                await add_not_brain(cat1, cat2, template, user)
            }
            setCat1(null)
            setCat2(null)
            setTemplate(null)
            setCurrent(null)
            setCurrentEx("")

        }
        if (cat1 != null && cat2 != null){
        current_example = get_ideas(current, currentEx, setCurrentEx, create_example)
        template_ex = create_example(template) 
        edit = <div>
            <h2>Editing "{type}" clue where: cat1 = {cat1} and cat2 = {cat2}</h2>
            {type == "is"? <p>{"Logic: The entity {ent1} in the category {cat1} is connect to the entity {ent2} in the category {cat2}"}</p> : <p>{"Logic: The entity {ent1} in the category {cat1} is not connect to the entity {ent2} in the category {cat2}"}</p> }
            <p>Number of current ideas: {current == null? "loading" :  current.length}</p>
            <p>Current Ideas: {current_example}</p>
            <p>Enter new brainstorm: <input value={template} onChange={(e) => setTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex}</p>
            <button onClick={submit}>Submit Template</button>

        </div>} 
    

    return <div>
 
        <h2>Select categories</h2>
        <div>
            <p>Select category 1: <select className="form-control" value={cat1} onChange={(e) => changeCat(1, e.target.value)}>{cat1Names}</select></p>
            <p>Select category 2: <select className="form-control" value={cat2} onChange={(e) => changeCat(2, e.target.value)}>{cat2Names}</select></p>
        </div>
        <h2>Add Brainstorm</h2>
        {edit}
    </div>
}

let EditOr = ({categories, user, sessionId, sessionStart}) => {
    let [cat1, setCat1] = useState(null)
    let [cat2, setCat2] = useState(null)
    let [isCat, setIsCat] = useState(null)
    let [current, setCurrent] = useState(null) 
    let [currentEx, setCurrentEx] = useState("") 
    let [template, setTemplate] = useState("")


    let create = ""
    let edit = <div>Select Categories</div>

        
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
 
                setCurrent(await get_or_brainstorm(tempCat1, tempCat2, tempIs, user))
                
                
            }else{
                setCurrent(null)
                setCurrentEx("")
            } 

        }

        let catNames = categories.map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        catNames =  [<option key={-1} value={null}>Select....</option>].concat(catNames)

        let isNames = categories.filter((c) => c.name != cat1 && c.name!= cat2  ).map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})
        isNames =  [<option key={-1} value={null}>Select....</option>].concat(catNames)

        create = <div>
            <p>Select category 1: <select value={cat1} onChange={(e) => changeCat(1, e.target.value)}>{catNames}</select></p>
            <p>Select category 2: <select  value={cat2} onChange={(e) => changeCat(2, e.target.value)}>{catNames}</select></p>
            <p>Select is category: <select value={isCat} onChange={(e) => changeCat(3, e.target.value)}>{isNames}</select></p>
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
            add_click(sessionId, "add brainstorm", sessionStart)
            await add_or_brain(cat1, cat2, isCat, template, user)
            setCat1(null)
            setCat2(null)
            setIsCat(null)
            setTemplate(null)
            setCurrent(null)
            setCurrentEx("")
        }
        if (cat1 != null && cat2 != null && isCat != null){
        current_example = get_ideas(current, currentEx, setCurrentEx, create_example)
        template_ex = create_example(template) 
        edit = <div>
            <h2>Editing "or" clue where: cat1 = {cat1} and cat2 = {cat2} and is_cat = {isCat}</h2>
            <p>Logic: {"Either the entity {ent1} in the category {cat1} or the entity {ent2} in the category {cat2} is connected to the entity {is_ent} in the category {is_cat}, but not both"}</p>
            <p>Number of current ideas: {current == null? "loading" :  current.length}</p>
            <p>Current Ideas: {current_example}</p>
            <p>Enter new brainstorm: <input value={template} onChange={(e) => setTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex}</p>
            <button onClick={submit}>Submit Template</button>

        </div>}
        else{
            edit = <div>Select categories</div>
        } 
    

    return <div>
        <h2>Select categories</h2>
        {create}
        <h2>Edit template</h2>
        {edit}
    </div>
}

let EditBefore = ({categories, user, sessionId, sessionStart}) => {
    let [cat1, setCat1] = useState(null)
    let [cat2, setCat2] = useState(null)
    let [numCat, setNumCat] = useState(null)
    let [current, setCurrent] = useState(null) 

    let [specifiedEx, setSpecifiedEx] = useState("") 
    let [unspecifiedEx, setUnspecifiedEx] = useState("") 
    let [unspecifiedTemplate, setUnspecifiedTemplate] = useState("")
    let [specifiedTemplate, setSpecifiedTemplate] = useState("")
    let [step, setStep] = useState(1)



    let selectEmpty= ""
    let create = ""
    let edit = <div>Select Categories</div>




        
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

            if (tempCat1 != null && tempCat2 != null && tempNum != null){
                console.log("Setting template")
                template = await get_before_brainstorm(tempCat1, tempCat2, tempNum, user)
                setCurrent(template)
            } else{
                setSpecifiedEx("")
                setUnspecifiedEx("")
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

      

        let submit = async (timed=true) => {
            add_click(sessionId, "add brainstorm", sessionStart)
            if (timed){
                await add_before_brain(cat1, cat2, numCat, specifiedTemplate, true, user)
            } else{
                await add_before_brain(cat1, cat2, numCat, unspecifiedTemplate, false, user)
            }
    
            setSpecifiedTemplate("")
            setUnspecifiedTemplate("")
        }
        if (cat1 != null && cat2 != null && numCat != null){
        if (current == null){
            specified_brains = null
            unspecified_brains = null
        }else{
            specified_brains = current["timed"]
            unspecified_brains = current["untimed"]
        }
        current_example_sp = get_ideas(specified_brains, specifiedEx, setSpecifiedEx, create_example)
        current_example_un =  get_ideas(unspecified_brains, unspecifiedEx, setUnspecifiedEx, create_example)
        template_ex_sp = create_example(specifiedTemplate) 
        template_ex_un = create_example(unspecifiedTemplate)
        edit = <div>
            <h2>Editing "before" clue where: cat1 = {cat1} and cat2 = {cat2} and num_cat = {numCat}</h2>
            <p>Logic: { "The entity {ent1} in the category {cat1} is before/smaller then the {ent2} in the category {cat2}. The amount of which {ent1} is smaller may be specified or unspecified"}</p>
            <p>Enter step: <input type="number" value={step} onChange={(e) => setStep(e.target.value)}/></p>
            <p></p>
            <p>Number of current specified ideas: {specified_brains== null? "loading" :  specified_brains.length}</p>
            <p>Current Specified Ideas: {current_example_sp}</p>
            <p>Enter new brainstorm: <input  onChange={(e) => setSpecifiedTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex_sp}</p>
            <button onClick={() => submit(timed=true)}>Submit Template</button>
            <p></p>
            <p>Number of current unspecified ideas: {unspecified_brains== null? "loading" :  unspecified_brains.length}</p>
            <p>Current Unspecified Ideas: {current_example_un}</p>
            <p>Enter new brainstorm: <input  onChange={(e) => setUnspecifiedTemplate(e.target.value)}/></p>
            <p>Example of new template: {template_ex_un}</p>
            <button onClick={() => submit(timed=false)}>Submit Template</button>

        </div>}
        else{
            edit = <div>Select categories</div>
        } 
    

    return <div>
        <h2>Select categories</h2>
        {create}
        <h2>Edit template</h2>
        {edit}
    </div>
}

export default EditTemplates = ({categories, user, sessionId, sessionStart}) => {


    let [empty, setEmpty] = useState({})
    let [editType, setEditType] = useState("select")



    
    let content = <div>Select type</div>
    
    if (editType == "is"){
        content = <EditIs  categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
    }else if (editType == "not"){
        content = <EditIs  categories={categories} user={user} type ="not" sessionId={sessionId} sessionStart={sessionStart}/>
    }else if (editType == "or"){
        content = <EditOr categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
    }else if (editType == "before"){
        content = <EditBefore categories={categories} user={user} sessionId={sessionId} sessionStart={sessionStart}/>
    }


    return <div>
        <h1>Add Narrative  Ideas</h1>
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