import { startIterEvolve, continueIterEvolve } from "./API/SendToApi"
import { useState, useEffect } from "react"
import ViewPuzzles from "./ViewPuzzles";
import "./ViewPuzzlesStyle.css"; 


let archivePuzzles =(oldPuzzles, newPuzzles) => {
    let isBetter = (p) => {
        let matches = newPuzzles.filter((newP) => (newP["diff"] == p["diff"]) && (newP["solution"] == p["solution"]))


        return matches.length > 0;
    }

    let archive = []
    let keep = []

    
    oldPuzzles.forEach((puzzle) => {
        if (isBetter(puzzle)){
            archive.push(puzzle)
        }else{
            keep.push(puzzle)
        }
    })

    keep = newPuzzles.concat(keep)


    return [archive, keep]

}

export default EvolveManager = ({categories, user, scenario, name, sessionId, sessionStart, mode = "mixed"}) => {

    let [puzzles, setPuzzles] = useState([]); 
    let [archive, setArchive] = useState([]); 
    let [id, setId] = useState(-1); 
    let [iters, setIters] = useState(0); 
    let [maxIters, setMaxIters] = useState(10)
   

    let [showArchive, setShowArchive] = useState(false); 

    useEffect(() => {
        evolveNext()
    }, [iters, maxIters])

    let evolveNext = async () => {
       
        if (iters >= maxIters){
            return 
        }
        if (id == -1) {
            data = await  startIterEvolve(categories, user,name, scenario);
            setPuzzles(puzzles.concat(data["puzzles"]))
            setId(data["id"])
        }else{
            data = await continueIterEvolve(id, user); 

            let filtered = archivePuzzles(puzzles, data["puzzles"])

            setPuzzles(filtered[1])
            setArchive(filtered[0])

      
        }

        setIters(iters + 1); 

   
    }


    return <div className="puzzlesView">
        <div className="header">

    
        <h2> Generation Cycle: {iters} of {maxIters}. Total puzzles: {showArchive? puzzles.length + archive.length: puzzles.length} <button className='smallButton' onClick={()=> setMaxIters(maxIters + 5)}>+ cycles</button>        </h2>

        <input    onClick={()=> setShowArchive(!showArchive)}  checked={showArchive} type="checkbox" className="toggleCheckbox" id="colorToggle"/>
      <label for="colorToggle" className="toggleButton">
      <div>Show Best</div> 
        <div>Show All</div> 
      </label>
        
        
        

        </div>



       
        <ViewPuzzles puzzles={showArchive? puzzles.concat(archive): puzzles} user={user} setPuzzles={setPuzzles} mode={mode} sessionId={sessionId} sessionStart={sessionStart}/> 
 
    </div>







}