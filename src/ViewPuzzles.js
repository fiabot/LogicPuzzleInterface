import axios from 'axios';
import { useEffect, useState,} from "react";
import { Slider } from '@mui/material';
import Box from '@mui/material/Box';


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


let CreateHintFilter = ({filter, setFilter, categories}) => {

    let hintKinds = ["is", "not", "or", "before", "complex-or"]

    let kindAttributes = {"is": ["cat1", "ent1", "cat2", "ent2"], "not": ["cat1", "ent1", "cat2", "ent2"], "before": ["cat1", "ent1", "cat2", "ent2", "num_cat", "amount" ],  "or":  ["cat1", "ent1", "cat2", "ent2", "is_cat", "is_ent"], "complex_or": ["is", "is"]}
    let k= Object.keys(filter)[0]
    let [kind, setKind] = useState(k)
    let [attrs, setAttrs] = useState(filter[k])

    useEffect(()=>{
        let obj = {}
        obj[kind] = []
        setFilter(obj)
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
            let catNames = [<option value={""}>{"Select category"}</option>].concat(categories.map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>})) 

             if (attr == "cat2"){
                idx = 2
            }else if (attr == "is_cat"){
                idx = 4 
            }else if (attr == "num_cat"){
                idx = 4

                catNames = [<option value={""}>{"Select category"}</option>].concat(categories.filter((value) => value.is_numeric = true).map((value, idx) => {return  <option key={idx} value={value.name}>{value.name}</option>}))
            }

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

            if (attrs[idx - 1] != ""){
                let ents = categories.filter((value) => value.name == attrs[idx - 1])[0].entities 

                options = options.concat(ents.map((e) => <option value={e}>{e}</option>))

            }

            return <select disabled={attrs[idx - 1] == ""} value={attrs[idx]} onChange={(e) => {
                let a = [...attrs]

                a[idx] = e.target.value

                setAttrs(a) 
            
            }}>{options}</select>

        }else if (attr == "amount") {

            let options = [<option value={""}>unspecified</option>]

            if (attrs[4] && attrs[4] != ""){
                console.log(attrs[4])
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
        }else if (attr == "is") {
            return <div>TODO</div>
        }


       
    }

    let attrSelects = <div>Select Kind</div>
    if (kind != ""){
        // attr length not long enough 
        if (attrs.length < kindAttributes[kind].length && (kind != "before" || (kind == "before" && attrs.length < 5 ))){
            if (kind == "before"){
                setAttrs(Array(5).join(".").split(".")) 
            }else{
                setAttrs(Array( kindAttributes[kind].length).join(".").split(".")) 
            }
        }

        let selects = kindAttributes[kind].map((a) => <li>Select: {a} {create_select(a)}</li>)

        attrSelects = <ol>{selects}</ol>
    }


    return <div>
        Select hint type: <select value={kind} onChange={(e) =>setKind(e.target.value)}>
            {kindOptions}
        </select> 


        Select attributes: {attrSelects}
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
        f.push({"is": ["", "", "",""]})
        setFilters(f)
    }

    let remove_filter = () => {
        f = [...filters]
        f.pop()
        setFilters(f)
    }

    return <div>
        <button onClick={add_filter}>Add Hint Filter</button>
        <button onClick={remove_filter}>Remove Hint Filter</button>
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

    console.log(hasHints(hintFilters, puzzles))


    let puzzleList = filterBySolution(filter, hasHints(hintFilters, puzzles)).filter((puzzle) => (puzzle.diff >= diffRange[0] && puzzle.diff <= diffRange[1]) && (puzzle.hints.length >= hintRange[0] && puzzle.hints.length <= hintRange[1]))
    

    let viewAll = <div className='filterView'>
        <div>
            <h1>Filter</h1>

            <h2>Filter Hints</h2>
            {puzzles.length > 0 ? <HintFilters setFilters={setHintFilters} filters={hintFilters}  categories={createPuzzle(puzzles[0]).categories} sessionId={sessionId} sessionStart={sessionStart}/> : ""} 

            <h2>Hint Range</h2>
        
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
                <h2>Difficulty Range</h2>
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
            {puzzles.length > 0 ? <PuzzleFilter className="playable" p={createPuzzle(puzzles[0])} setFilter={setFilter} sessionId={sessionId} sessionStart={sessionStart}/>  : <div> Loading</div>}
            

        </div>

        <div className='cropped'>
            <h1>Puzzles</h1>
            <PlayablePuzzleList puzzles={puzzleList} user={user} setPuzzles={setPuzzles} showMutants={mode == "casual" || mode == "mixed"} appMode={mode} sessionId={sessionId} sessionStart={sessionStart}/> 

        </div>
    </div>

    let personas = <Personas puzzles={puzzleList} user={user} appMode={mode} sessionId={sessionId} sessionStart={sessionStart}/>

    if (mode == "serious"){
        return viewAll
    }else if (mode == "casual"){
        return personas
    }else{
        return <div className='body'>
           
            <Collapseable title={"Evaluators Recommendations"} content={personas}  /> 
            <Collapseable title={"View All Puzzles"} content={viewAll} showByDefault={false} />
            
        </div>
    }

}