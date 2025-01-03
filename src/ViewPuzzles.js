import axios from 'axios';
import { useState,} from "react";
import { Slider } from '@mui/material';
import Box from '@mui/material/Box';

import Category from "./categoryModel";
import Puzzle from "./simplePuzzle";
import PuzzleModel from "./puzzleModel";
import "./ViewPuzzlesStyle.css"; 
import simplePuzzle from './simplePuzzle';
import PuzzleFilter from './puzzleFilter';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function createPuzzle(data) {
    let categories = []
    for (cat in data.categories) {
        cat = data.categories[cat]
        categories.push(new Category(cat.name, cat.entities))
    }

    return new PuzzleModel(categories, data.hints, data.solution, data.id)

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

export default ViewPuzzles = ({puzzles}) => {

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

    let puzzleList = filterBySolution(filter, puzzles).filter((puzzle) => puzzle.diff >= diffRange[0] && puzzle.diff <= diffRange[1]).map((puzzle, idx) => {
        return <li className='puzzleListElement' key = {idx}>
            <h2>Difficulty: {puzzle.diff}</h2>
            <h2>Hints</h2>
            <ol className='hintList'>
            {puzzle.hints.map((hint, id) => <li key={id}>{hint}</li>)}
            </ol>

            <button onClick={() =>playPuzzle(puzzle)}>Play Puzzle</button>

        </li>
    })

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

            <PuzzleFilter p={createPuzzle(puzzles[0])} setFilter={setFilter}/> 

        </div>

        <div className='puzzleViewRight'>
            <h1>Puzzles</h1>
            <ol className='puzzleList'>
            {puzzleList}
            </ol>

            {puzzleView}

        </div>
    </div>

}