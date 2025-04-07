
import { add_account, login, new_session } from "./API/SendToApi"
import { getLikedPuzzles } from "./API/GetFromApi"
import { useEffect, useState } from "react"

import PlayablePuzzleList from "./PlayablePuzzleList";

let adminPublicKeys = ["Admin 1"]


export default ViewLikedPuzzles = ({ user, mode, sessionId,  sessionStart}) => {
    let [puzzles, setPuzzles] = useState([])

    let getPuzzles =() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzles = await getLikedPuzzles(user)
            resolve(puzzles)
        })
    }



    async function fetch() { 
        getPuzzles().then(
            
            (p) =>{

                if (p != "LOGIN" && p != null){
                    setPuzzles(p)
                }
         
            
        })}
    
    useEffect (() => 
            {
            fetch()
    
            }, [user]  )


        return <div className="body">
            <PlayablePuzzleList puzzles={puzzles} user={user}  setPuzzles={setPuzzles} r={fetch}  appMode={mode}  sessionId = {sessionId} sessionStart={sessionStart}/>
           
        </div>
    
    
}