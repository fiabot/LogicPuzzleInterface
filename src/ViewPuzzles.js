import axios from 'axios';
import { useEffect, useState,} from "react";
import { Slider } from '@mui/material';
import Box from '@mui/material/Box';
import { categoryFilter, entityFilter } from './utils';


import Category from "./categoryModel";
import Puzzle from "./simplePuzzle";
import {createPuzzle} from "./puzzleModel";
import "./ViewPuzzlesStyle.css"; 
import simplePuzzle from './simplePuzzle';
import PuzzleFilter from './puzzleFilter';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { like_puzzle } from './API/SendToApi';
import PlayablePuzzleList from './PlayablePuzzleList';
import { hasHints } from './utils';
import Personas from './Personas';
import Collapseable from "./Collapseable" 
import { add_click } from './API/SendToApi';
import {  createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#776274',
      },
      secondary: {
        main: '#A07178>',
      },
    },
  });



let nameDict = {"is1": "First Statement", "is2": "Second Statement", "cat1": "First Category", "cat2": "Second Category", "ent1": "First Entity", "ent2": "Second Entity", "is_cat": "Comparison Category", "is_ent": "Comparison Entity", "num_cat":"Numerical Category", "amount": "Number of Units"}

let IsFilter = ({attrs, setAttrs, idx, categories}) => {

    let [thisAttrs, setThisAttrs] = useState(["", "","",""])
    let attributes = ["cat1", "ent1", "cat2", "ent2"]

    useEffect(() => {

        if (attrs.length == 2){
            let a = [...attrs]

            a[idx] = {"is": thisAttrs}
    
            setAttrs(a) 

        }
   
    }, [thisAttrs])

    let create_select = (attr) => {
        if (attr.includes("cat")){

            let idx = 0 
            // let catNames = [<option value={""}>{"Select category"}</option>].concat(categories.map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})) 

             if (attr == "cat2"){
                idx = 2
            }else if (attr == "is_cat"){
                idx = 4 
            }else if (attr == "num_cat"){
                idx = 4

               
            }
            let  catNames = [<option value={""}>{"Select category"}</option>].concat(categories.filter((value) => categoryFilter("is", value, attr, thisAttrs)).map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>}))
            return <select value={thisAttrs[idx]} onChange={(e) => {
                let a = [...thisAttrs]

                a[idx] = e.target.value

                setThisAttrs(a) 
            
            }}>{catNames}</select>
            
        }else if (attr.includes("ent")) {

            let idx = 1 
            let options = [<option value={""}>Select entity</option>]

            if (attr == "ent1"){
                idx = 1
          
            }else if (attr == "ent2"){
                idx = 3
            }

            if (typeof thisAttrs[idx - 1] == "string" && thisAttrs[idx - 1] != ""){
                let ents = categories.filter((value) => value.name == thisAttrs[idx - 1])[0].entities 

                console.log("categories", categories)

                options = options.concat(ents.filter((value) => entityFilter("is", value, attr, thisAttrs)).map((e) => <option value={e}>{e}</option>))

            }else{
                console.log("selected cat", typeof thisAttrs[idx - 1]  )
            }

            return <select disabled={thisAttrs[idx - 1] == ""} value={thisAttrs[idx]} onChange={(e) => {
                let a = [...thisAttrs]

                a[idx] = e.target.value

                setThisAttrs(a) 
            
            }}>{options}</select>

        }

    }

    return <ol>{attributes.map((a, idx) => <li key={idx}>{nameDict[a]} {create_select(a)}</li>)}</ol>
}



let CreateHintFilter = ({filter, setFilter, categories}) => {

    let hintKinds = ["is", "not", "simple_or", "before", "compound_or"]

    let kindAttributes = {"is": ["cat1", "ent1", "cat2", "ent2"], "not": ["cat1", "ent1", "cat2", "ent2"], "before": ["cat1", "ent1", "cat2", "ent2", "num_cat", "amount" ],  "simple_or":  ["cat1", "ent1", "cat2", "ent2", "is_cat", "is_ent"], "compound_or": ["is1", "is2"]}
    let k= Object.keys(filter)[0]
    let [kind, setKind] = useState(k)
    let [attrs, setAttrs] = useState(filter[k])

    useEffect(()=>{
       
        if (kind == ""){
            setAttrs([])
            setFilter("")
        }else{
            let obj = {}
            obj[kind] = []

            if (kind == "before"){
                setAttrs(Array(5).join(".").split(".")) 
            }else if (kind ==  "compound_or") {
                setAttrs([{"is": ["","","",""]}, {"is": ["","","",""]}])
            }else{
                setAttrs(Array( kindAttributes[kind].length).join(".").split(".")) 
            }
            setFilter(obj)
        }
      
    }, [kind])

    useEffect(()=>{
        let obj = {}
        obj[kind] = attrs

    
        setFilter(obj)
    }, [attrs])

    let kindOptions = [<option value={""}>{"Select hint type"}</option>].concat (hintKinds.map((k) => <option value={k}>{k}</option>)) 

    let create_select = (attr) => {
        if (attr.includes("cat")){

            let idx = 0 
            //let catNames = [<option value={""}>{"Select category"}</option>].concat(categories.map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})) 

             if (attr == "cat2"){
                idx = 2
            }else if (attr == "is_cat"){
                idx = 4 
            }else if (attr == "num_cat"){
                idx = 4

                
            }

            let  catNames = [<option value={""}>{"Select category"}</option>].concat(categories.filter((value) => categoryFilter(kind, value, attr, attrs)).map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>}))

            return <select value={attrs[idx]} onChange={(e) => {
                let a = [...attrs]

                a[idx] = e.target.value

                setAttrs(a) 
            
            }}>{catNames}</select>
            
        }else if (attr.includes("ent")) {

            let idx = 1 
            let options = [<option value={""}>Select entity</option>]

            if (attr == "ent1"){
                idx = 1
          
            }else if (attr == "ent2"){
                idx = 3
            }else if (attr == "is_ent"){
                idx = 5 
            }

            if (typeof attrs[idx - 1] == "string" && attrs[idx - 1] != ""){
                let ents = categories.filter((value) => value.name == attrs[idx - 1])[0].entities 

                options = options.concat(ents.filter((value) => entityFilter(kind, value, attr, attrs)).map((e) => <option value={e}>{e}</option>))

            }

            return <select disabled={attrs[idx - 1] == ""} value={attrs[idx]} onChange={(e) => {
                let a = [...attrs]

                a[idx] = e.target.value

                setAttrs(a) 
            
            }}>{options}</select>

        }else if (attr == "amount") {

            let options = [<option value={""}>unspecified</option>]

            if (typeof attrs[4] == "string" && attrs[4] != ""){
                let numOptions = categories.filter((value) => value.name == attrs[4])[0].entities.length 
                let nums = [...Array(numOptions).keys()].map((n) => n + 1)
                options= options.concat(nums.map((n) => <option value ={n}>{n} units</option>))
                
            }

            let setAmount = (amount) => {
                let a = [...attrs]

                if (amount == ""){
                    a = a.slice(0,5)
                    setAttrs(a) 
                }else{
                    if (a.length <= 5){
                        a.push(amount)
                    }else{
                        a[5] = amount
                    }

                    console.log(a)

                    setAttrs(a)
                }
            }

            return <select disabled={!attrs[4] || attrs[4] == ""} value={attrs.length==6? attrs[5]: ""} onChange={(e) => setAmount(e.target.value)}> {options}</select>
        }else if (attr == "is1") {
            return <div> <IsFilter attrs={attrs} setAttrs={setAttrs} idx={0} categories={categories}/></div>
        }else if (attr == "is2"){
            return <div><IsFilter attrs={attrs} setAttrs={setAttrs} idx={1} categories={categories}/></div>
        }


       
    }

    let attrSelects = <div>Select Kind</div>
    if (kind != ""){

        let selects = kindAttributes[kind].map((a) => <li>{nameDict[a]} {create_select(a)}</li>)

        attrSelects = <ol>{selects}</ol>
    }


    return <div className='hintFilter'>
        Select hint type:     

      
        
        <select value={kind} onChange={(e) =>setKind(e.target.value)}>
            {kindOptions}
        </select> 

        <div class="tooltip"> &#40;  Help &#41;
            <span class="tooltiptext">There are five kinds of hints: 
                <ol>
                    <li><b>is</b>: the first and second entity are connected</li>
                    <li><b>not</b>: the first and second entity are not connected</li>
                    <li><b>before</b>: the first entity is before/less than the second entity in a numeric category </li>
                    <li><b>simple_or</b>: either the first or the second entity is the comparison entity, but not both</li>
                    <li><b>compound_or</b>: either the first or the second <i>is</i> statement is true, but not both</li>
                </ol> 
            </span>
          </div>

        <p>Select attributes:</p> {attrSelects}
    </div>

}


let HintFilters = ({filters, setFilters, categories, sessionId, sessionStart}) => {


    let manageFilter = (idx) => {
        let setFilter = (f) => {
            fs = [...filters]
            fs[idx] = f

            setFilters(fs)

        }

        return <CreateHintFilter filter={filters[idx]} setFilter={setFilter} categories={categories}/> 
    }

    let filterManagers = filters.map((f, i) => manageFilter(i)) 

    let add_filter = () => {
        add_click(sessionId, "filter by hint", sessionStart)
        f = [...filters]
        f.push({"": ["", "", "",""]})
        setFilters(f)
    }

    let remove_filter = () => {
        f = [...filters]
        f.pop()
        setFilters(f)
    }

    return <div>

    
        <div>
            <button className='smallButton' onClick={add_filter}>Add Hint Filter</button>
            <button className='smallButton' onClick={remove_filter}>Remove Hint Filter</button>
        </div>
       
        {filterManagers}
    </div>

}

function filterBySolution(f, puzzles ){


    return puzzles.filter((puzzle) => {
        for (let i = 0; i < f.length; i++) {
            if (f[i] == "X" || f[i] == "O") {

                if (f[i] != puzzle.solution[i]) {
                    return false; 
                } 
            }
        }

        return true; 
    })
    } 

export default ViewPuzzles = ({puzzles, user, setPuzzles, mode, sessionId, sessionStart}) => {

    let [diffRange, setDiffRange] =useState([1, 10])
    let [hintRange, setHintRange] = useState([1, 10])
    let [filter, setFilter] = useState("")
    let [hintFilters, setHintFilters] = useState([])


    const handleRangeChange = (event, newValue) => {
        add_click(sessionId, "filter by difficulty", sessionStart )
        setDiffRange(newValue);
    };

    const handleHintRangeChange = (event, newValue) => {
        add_click(sessionId, "filter by hint size", sessionStart )
        setHintRange(newValue);
    };




    let puzzleList = filterBySolution(filter, hasHints(hintFilters, puzzles)).filter((puzzle) => (puzzle.diff >= diffRange[0] && puzzle.diff <= diffRange[1]) && (puzzle.hints.length >= hintRange[0] && puzzle.hints.length <= hintRange[1]))
    

    let viewAll = <div className='filterView'>
        <div>
            <h1>Filter</h1>

            <h2>Filter Hints</h2>
            {puzzles.length > 0 ? <HintFilters setFilters={setHintFilters} filters={hintFilters}  categories={createPuzzle(puzzles[0]).categories} sessionId={sessionId} sessionStart={sessionStart}/> : ""} 

            <h2>Filter by Hint Size</h2>
        
            <div className='center'>

            <Box sx={{ width: 300 }}>
                <Slider
    
                    getAriaLabel={() => 'Number of Hints'}
                    value={hintRange}
                    onChange={handleHintRangeChange}
                    valueLabelDisplay="on"
                    min={1}
                    max={10}
                    marks
                    />
                </Box>
                </div>
                <h2>Filter by Difficulty</h2>
                <div className='center'>
                <Box sx={{ width: 300 }}>
                <Slider
     
                    getAriaLabel={() => 'Difficulty range'}
                    value={diffRange}
                    onChange={handleRangeChange}
                    valueLabelDisplay="on"
                    min={1}
                    max={10}
                    marks
                    />
                </Box>
            </div>
            <h2>Filter By Solution</h2>
            {puzzles.length > 0 ? <PuzzleFilter className="playable" p={createPuzzle(puzzles[0])} setFilter={setFilter} sessionId={sessionId} sessionStart={sessionStart}/>  : <div> Loading</div>}
            

        </div>

        <div className='cropped'>
            <h1>Puzzles</h1>
            <PlayablePuzzleList puzzles={puzzleList} user={user} setPuzzles={setPuzzles} showMutants={mode == "casual" || mode == "mixed" || mode == "admin"} appMode={mode} sessionId={sessionId} sessionStart={sessionStart}/> 

        </div>
    </div>

    let personas = <Personas puzzles={puzzleList} user={user} appMode={mode} sessionId={sessionId} sessionStart={sessionStart}/>

    if (mode == "serious"){
        return <div className='body'>
            {viewAll}
        </div>
    }else if (mode == "casual"){
        return personas
    }else{
        return <div className='body'>
           
            <Collapseable title={"Evaluators Recommendations"} content={personas}  /> 
            <Collapseable title={"View All Puzzles"} content={viewAll} showByDefault={false} />
            
        </div>
    }

}