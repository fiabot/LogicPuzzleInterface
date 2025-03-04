import { useEffect, useState} from "react"
import { postEvolution, add_cat } from "./API/SendToApi"
import { getSampleCategories } from "./API/GetFromApi"
import "./AuthoringStyle.css"
import EditTemplate from "./EditTemplate"
import EditBrainstorm from "./EditBrainstorm"


let CategoryMaker = ({categories, setCategories, index, numEntities, can_save = false, user=null}) => {

    let [list, setList] = useState([])
    let [name, setName] = useState(categories[index].name)
    let [is_numeric, setNumeric] = useState(categories[index].is_numeric)

    const newCategories = categories.map((element, i) =>{
        if(i == index){
            return {
                name:name, 
                entities:list, 
                is_numeric:is_numeric 
            
            }
        }else{
            return element 
        }
    })

    useEffect(() =>{
        setCategories(newCategories)
    }, [name, list,is_numeric])


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
    

    let listInput = list.map((element, idx) => <li key={idx}><input value ={element} onChange={e => {
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
        {can_save ? <button onClick={save_categories}>save</button>: ""}
    </div>)
    
}





export default PuzzleMaker = ({startEvolve, user, mode}) =>{
    let [categories, setCategories] = useState([]); 
    let [numEntites, setNumEntities] = useState(4); 
    let [templates, setTemplates] = useState(<div>Loading</div>)
    let [tempCats, setTempCats] = useState([])
    let [numEmpty, setNumEmpy] = useState([0])

    console.log(mode)


    let categoryCreators = categories.map((cat, idx) => {
        return <CategoryMaker key={idx} categories={categories} setCategories={setCategories} index ={idx} numEntities={numEntites} starterName="name" can_save user={user}/> 
    })

    let evolvePuzzle=() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzle = await postEvolution(categories)
            resolve(puzzle)
        })
    }

    let getCats =() => {
        return new Promise(async (resolve, reject) =>{
            
            cats = await getSampleCategories(user)
            resolve(cats)
        })
    }

    
    useEffect (() => 
            {async function fetch() { 
                getCats().then(
                    
                    (cats) =>{
                 
                    setTempCats(cats)
                })}
            fetch()
    
            }, []  )
    
   
      

    tempbutton =  tempCats.map((cat, idx) => {
        return <button className="smallButton" key={idx}  onClick={()=>setCategories([...categories, cat])} >{cat.name}</button>
        })

    return <div className="puzzleView">

    <div className="puzzleViewLeft">

    
        <div className="authoringView">

       

        

            <div>
                Number of entities: <button onClick={()=>{if(numEntites > 3) {setNumEntities(numEntites - 1)}}}>-</button> {numEntites}     <button onClick={()=>setNumEntities(numEntites + 1)}>+</button>
            </div>

        


            <h1>Categories</h1>
            <div className="categories">

            {categoryCreators}
            
            </div>

            {mode == "casual" || mode == "mixed" ?<div><h1>Example Categories</h1>
            <div className="categoryTemplate">
                {tempbutton}
            </div> </div>: ""}

  



            {mode == "serious" || mode == "mixed"? <div><button className="mediumButton" onClick={()=>setCategories([...categories, {name:"Name", entities:[], is_numeric:false}])}>Add category</button>
            <button className="mediumButton" onClick={()=>setCategories(
                        categories.slice(0, categories.length -1)
                    )}>Remove Category</button>
                 

              

                

                </div> : ""} 

                <button className="largeButton" onClick={() => startEvolve(categories)}>Start Evolution</button>
     


        </div> 

    </div>

    {mode == "serious" || mode == "mixed" ? <div className="puzzleViewRight">

                <div className="authoringView">
                <EditTemplate categories={categories} user={user}/>
                <EditBrainstorm categories={categories} user={user} />  
            </div>

    </div> :""} 

    </div>
    
    
}