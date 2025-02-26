import axios from 'axios';
import { useState,} from "react";
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

export default ViewPuzzles = ({puzzles, user, setPuzzles}) => {

    let [diffRange, setDiffRange] =useState([1, 10])
    let [filter, setFilter] = useState("")


    const handleRangeChange = (event, newValue) => {
        setDiffRange(newValue);
    };

    let [puzzleView, setPuzzleView] = useState(<div>No Puzzle Selected</div>)

    let playPuzzle = (data) => {
        let p = createPuzzle(data)
        setPuzzleView(<Puzzle p={p}/>)
    }

    let puzzleList = filterBySolution(filter, puzzles).filter((puzzle) => puzzle.diff >= diffRange[0] && puzzle.diff <= diffRange[1])
    

    return <div className='puzzleView'>
        <div className='puzzleViewLeft'>
            <h1>Filter</h1>

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
            {puzzles.length > 0 ? <PuzzleFilter p={createPuzzle(puzzles[0])} setFilter={setFilter}/>  : <div> Loading</div>}
            

        </div>

        <div className='puzzleViewRight'>
            <h1>Puzzles</h1>
            <PlayablePuzzleList puzzles={puzzleList} user={user} setPuzzles={setPuzzles}/> 

        </div>
    </div>

}