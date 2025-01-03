import { useEffect, useState} from "react"
import { postEvolution } from "./API/SendToApi"
import { getSampleCategories } from "./API/GetFromApi"
import "./AuthoringStyle.css"


let CategoryMaker = ({categories, setCategories, index, numEntities}) => {
    console.log(categories)

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
    </div>)
    
}





export default PuzzleMaker = ({submitPuzzles}) =>{
    let [categories, setCategories] = useState([]); 
    let [numEntites, setNumEntities] = useState(4); 
    let [templates, setTemplates] = useState(<div>Loading</div>)
    let [tempCats, setTempCats] = useState([])


    let categoryCreators = categories.map((cat, idx) => {
        return <CategoryMaker key={idx} categories={categories} setCategories={setCategories} index ={idx} numEntities={numEntites} starterName="name"/> 
    })

    let evolvePuzzle=() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzle = await postEvolution(categories)
            resolve(puzzle)
        })
    }

    let getCats =() => {
        return new Promise(async (resolve, reject) =>{
            
            cats = await getSampleCategories()
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

    

    let startEvolution = () => {
        console.log("evolving")
        if(categories.length > 1){
            evolvePuzzle().then((puzzle) => {

                submitPuzzles(puzzle)
            })} 
        }
      

    tempbutton =  tempCats.map((cat, idx) => {
        return <button className="smallButton" key={idx}  onClick={()=>setCategories([...categories, cat])} >{cat.name}</button>
        })

    return <div className="authoringView">

        <div>
            Number of entities: <button onClick={()=>{if(numEntites > 3) {setNumEntities(numEntites - 1)}}}>-</button> {numEntites}     <button onClick={()=>setNumEntities(numEntites + 1)}>+</button>
        </div>

    


        <h1>Categories</h1>
        <div className="categories">

        {categoryCreators}
        
        </div>

        <h1>Example Categories</h1>
        <div className="categoryTemplate">
            {tempbutton}
        </div>

        <div className="center">


        <button className="mediumButton" onClick={()=>setCategories([...categories, {name:"Name", entities:[], is_numeric:false}])}>Add category</button>
        <button className="mediumButton" onClick={()=>setCategories(
                    categories.slice(0, categories.length -1)
                )}>Remove Category</button>

        </div>


        <div className="center">
            <button className="largeButton" onClick={startEvolution}>Start Evolution</button>
        </div>


    </div> 
    
    
}