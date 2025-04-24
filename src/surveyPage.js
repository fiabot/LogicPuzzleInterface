

import { add_account, login, new_session } from "./API/SendToApi"
import Survey from "./survey";
import { useEffect, useState } from "react"

let Login = ( {setPassword, username, setUsername}) => {


    let [newUser, setUser] = useState("")
    let [mode, setMode] = useState(null)



    let log_user_in = async () => {
       result =  await login(newUser, setPassword,  setUsername, setMode); 
       
       if (result == null){
            alert("Key Not Regonized, try again")
       }

    }


     
    
        return <div  className='puzzlesView'>
            <h1>Enter Private Key</h1>
            <input value={newUser} onChange={(e) =>setUser(e.target.value)} ></input>
            <button onClick={() => {log_user_in()}}>Login</button>
        </div>

}


export default SurveyPage = ({}) => {

    const queryParameters = new URLSearchParams(window.location.search)
    const param = queryParameters.get("user")

    let [username, setUsername] = useState(null)
    let [password, setPassword] = useState(param)
    let [mode, setMode] = useState(null)

    if (password == null){
        return <Login username={username} setUsername={setUsername}/> 
    }else if (username == null){
        login(password, setPassword,  setUsername, setMode); 
        return <div>Logging you in....</div>
    }else {
        return <Survey user={username}/> 
    }


}