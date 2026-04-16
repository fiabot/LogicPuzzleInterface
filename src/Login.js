
import { add_account, login, new_session } from "./API/SendToApi"
import { getLikedPuzzles } from "./API/GetFromApi"
import { useEffect, useState } from "react"
import { sanitize } from "./utils";
import PlayablePuzzleList from "./PlayablePuzzleList";


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
        if (newUser.length < 5){
            alert("Invalid key, please enter the key exactly as it appears on Qualtrics")
            return 
        }
       start = new Date()
       result =  await login(sanitize(newUser), start, setUser); 

        start = new Date()
        let session = await new_session(newUser, start.toJSON())

        setSessionStart(start)
        setSessionId(session)
    
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          log_user_in()
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
            <input  onKeyDown={handleKeyDown} value={newUser} onChange={(e) => setNewuser(e.target.value)} ></input>
            <button onClick={() => {log_user_in()}}>Login</button>
        </div>
    }else{
        return <div>
            Logged in 
        </div>
    }
    
}