
import { add_account, login } from "./API/SendToApi"
import { getLikedPuzzles } from "./API/GetFromApi"
import { useEffect, useState } from "react"

import PlayablePuzzleList from "./PlayablePuzzleList";

let adminPublicKeys = ["Admin 1"]


export default HomePage = ({startGeneration, user, setUser, mode, setMode}) => {
    let [puzzles, setPuzzles] = useState([])
    //let puzzles = []
    let [username, setUsername] = useState("")
    let [publicKey, setPublicKey] = useState("")
    let [userMode, setUserMode] = useState("mixed")

    let [newPrivateKey, setNewPrivateKey] = useState("")
    let [newPublicKey, setNewPublicKey] = useState("")

    let getPuzzles =() => {
        return new Promise(async (resolve, reject) =>{
            
            puzzles = await getLikedPuzzles(user)
            resolve(puzzles)
        })
    }

    let log_user_in = async () => {
       result =  await login(username, setUser, setPublicKey, setMode); 
       if (result == null){
            alert("Key Not Regonized, try again")
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
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <button onClick={() => {log_user_in()}}>Login</button>
        </div>
    }else if (adminPublicKeys.includes(publicKey)){
        // admin view 

        let add_user = async () => {
            result =  await add_account(username, newPrivateKey, newPublicKey, userMode) 
            if (result == "failure"){
                 alert("Failed to add user")
            }else{
                alert("successfully added user")
            }
         }

        return <div className='puzzlesView'>
        <h1>Welcome {publicKey}</h1>
        <h2>Add users</h2>
            <p>Enter Public Key</p>
            <input value={newPublicKey} onChange={(e) => setNewPublicKey(e.target.value)}></input>

            <p>Enter Private Key</p>
            <input value={newPrivateKey} onChange={(e) => setNewPrivateKey(e.target.value)}></input>
            <p>Select Mode</p><select value={userMode} onChange={(e) => setUserMode(e.target.value)}>
                <option value="mixed">mixed</option>
                <option value="serious">serious</option>
                <option value="casual">casual</option>
            </select>
            <button onClick={() => {add_user()}}>Add User</button>
        <h2>Generate puzzles</h2>
        <button onClick={startGeneration}>Start</button>
        <h2>View Liked Puzzles</h2>
        <PlayablePuzzleList puzzles={puzzles} user={user} setPuzzles={setPuzzles} r={fetch} appMode={mode}/>
    </div>
    
    }else{

        return <div className='puzzlesView'>
            <div className="header">
            <h1>Welcome {publicKey}</h1>
            <h2>Start Generating</h2>
            <button onClick={startGeneration}>Start</button>
            <h2>View Liked Puzzles</h2>
            </div>
            
        
            <div className="body">
            <PlayablePuzzleList puzzles={puzzles} user={user}  setPuzzles={setPuzzles} r={fetch}  appMode={mode}/>
            </div>
           
        </div>
    }
    
}