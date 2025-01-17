import { startIterEvolve, continueIterEvolve } from "./API/SendToApi"
import { useState, useEffect } from "react"
import ViewPuzzles from "./ViewPuzzles";


export default EvolveManager = ({categories, user}) => {

    let [puzzles, setPuzzles] = useState([]); 
    let [id, setId] = useState(-1); 
    let [iters, setIters] = useState(0); 
    let [conEvolve, setContinue] = useState(true); 

    useEffect(() => {
        evolveNext()
    }, [iters])

    let evolveNext = async () => {
       

        if (id == -1) {
            data = await  startIterEvolve(categories, user);
            setPuzzles(puzzles.concat(data["puzzles"]))
            setId(data["id"])
        }else{
            console.log("Continuing")
            data = await continueIterEvolve(id, user); 

            setPuzzles(puzzles.concat(data["puzzles"]))

      
        }

        setIters(iters + 1); 

   
    }


    return <div>
        <h1>Generating New Puzzles</h1>
        <h2> Generation: {iters * 40}, total puzzles: {puzzles.length}</h2>
        <ViewPuzzles puzzles={puzzles} user={user}/> 
    </div>







}