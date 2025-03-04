import { startIterEvolve, continueIterEvolve } from "./API/SendToApi"
import { useState, useEffect } from "react"
import ViewPuzzles from "./ViewPuzzles";


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

export default EvolveManager = ({categories, user}) => {

    let [puzzles, setPuzzles] = useState([]); 
    let [archive, setArchive] = useState([]); 
    let [id, setId] = useState(-1); 
    let [iters, setIters] = useState(0); 
    let [maxIters, setMaxIters] = useState(10)
    let [conEvolve, setContinue] = useState(true); 

    let [showArchive, setShowArchive] = useState(false); 

    useEffect(() => {
        evolveNext()
    }, [iters])

    let evolveNext = async () => {
       
        if (iters >= maxIters){
            if (confirm(puzzles.length + " puzzle have been created, would you like to continue evolving?")){
                setMaxIters(maxIters + 5); 
            }else{
                return 
            }
        }
        if (id == -1) {
            data = await  startIterEvolve(categories, user);
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


    return <div>
        <h1>Generating New Puzzles</h1>
        <h2> Generation: {iters * 40}, total puzzles: {showArchive? puzzles.length + archive.length: puzzles.length}</h2>
        <button onClick={()=> setShowArchive(!showArchive)}>{showArchive? "Show Best": "Show All"}</button>
        <ViewPuzzles puzzles={showArchive? puzzles.concat(archive): puzzles} user={user} setPuzzles={setPuzzles}/> 
    </div>







}