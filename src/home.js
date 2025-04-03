
import { add_account, login, new_session } from "./API/SendToApi"
import { getLikedPuzzles } from "./API/GetFromApi"
import { useEffect, useState } from "react"

import PlayablePuzzleList from "./PlayablePuzzleList";

let adminPublicKeys = ["Admin 1"]


export default HomePage = ({username}) => {

    let [publicKey, setPublicKey] = useState("")
    let [userMode, setUserMode] = useState("mixed")

    let [newPrivateKey, setNewPrivateKey] = useState("")
    let [newPublicKey, setNewPublicKey] = useState("")

     if (adminPublicKeys.includes(publicKey)){
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
        <h1>Welcome {username}</h1>
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

    </div>
    
    }else{

        return <div className='puzzlesView'>
            <h1>Welcome {username}</h1>
            <p>Here we will give an overview of the system</p>
            <p>Here we will have a FAQ page</p>
            <p> Here</p>
           
        </div>
    }
    
}