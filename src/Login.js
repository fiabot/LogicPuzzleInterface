
import { add_account, login, new_session } from "./API/SendToApi"
import { getLikedPuzzles } from "./API/GetFromApi"
import { useEffect, useState } from "react"

import PlayablePuzzleList from "./PlayablePuzzleList";

let adminPublicKeys = ["Admin 1"]


export default HomePage = ({ user, setUser, mode, setMode, sessionId, setSessionId, sessionStart, setSessionStart, username, setUsername}) => {
    let [puzzles, setPuzzles] = useState([])
    //let puzzles = []

    let [newUser, setNewuser] = useState("")


    let getPuzzles =() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzles = await getLikedPuzzles(user)
            resolve(puzzles)
        })
    }

    let log_user_in = async () => {
       result =  await login(newUser, setUser, setUsername, setMode); 
       
       if (result == null){
            alert("Key Not Regonized, try again")
       }else{
        start = new Date()
        let session = await new_session(newUser, start.toJSON())

        setSessionStart(start)
        setSessionId(session)
       }


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
    if (user== null){
     
    
        return <div  className='puzzlesView'>
            <h1>Enter Private Key</h1>
            <input value={newUser} onChange={(e) => setNewuser(e.target.value)} ></input>
            <button onClick={() => {log_user_in()}}>Login</button>
        </div>
    }else{
        return <div>
            Logged in 
        </div>
    }
    
}