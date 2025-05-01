
import { add_account, login, new_session } from "./API/SendToApi"
import { getNumSurveys } from "./API/GetFromApi"
import { useEffect, useState } from "react"

import PlayablePuzzleList from "./PlayablePuzzleList";

let adminPublicKeys = ["Admin 1", "Admin 2"]

let openSurvey= (password) => {
    url_str =  pathname = window.location.href +"survey?user=" + password
    window.open(url_str, "_blank", "noreferrer");

}


let researchScore =  ["Seed","Sprout", "Seedling", "Bud", "Flower", "Fruit", "Pollinator"]
let desc = {"Seed": "You currently have the potential to contribute to the growth of research.", 
            "Sprout": "You have begun your journey of participating in research.", 
            "Seedling": "You are contributing to the growth of research", 
            "Bud": "You are on the verge of greatly contributing to research.", 
            "Flower": "You have made a great contribution to research", 
            "Fruit": "Your contributions to research will continue to nourish the community", 
            "Pollinator": "Your contributions will encourage the growth of more research"}

let images = {"Seed": "./icons/people/seed.png", 
            "Sprout": "./icons/people/sprout.png", 
            "Seedling": "./icons/people/seedling.png", 
            "Bud": "./icons/people/bud.png", 
            "Flower": "./icons/people/flower.png", 
            "Fruit": "./icons/people/fruit.png", 
            "Pollinator":"./icons/people/polinator.png"}


export default HomePage = ({user, publicKey  }) => {

    let [userMode, setUserMode] = useState("mixed")

    let [numSurveys, setNumSurvey] = useState(-1); 

    let [score, setScore] = useState("Seed")

    let [nextLevel, setNextLevel] = useState(1)

    let [newPrivateKey, setNewPrivateKey] = useState("")
    let [newPublicKey, setNewPublicKey] = useState("")

    useEffect(() => {
        let fetch = async() => {
            let surveys = await getNumSurveys(user)
            if (surveys != null){
                setNumSurvey(surveys)

                if (surveys > 0){
                    level = Math.floor((surveys - 1) / 2)
                    if (level + 1 < researchScore.length){
                        setScore(researchScore[level + 1])
                        if (surveys % 2 == 1){
                            setNextLevel(2)
                        }else{
                            setNextLevel(1)
                        }
                    }else{
                        setScore(researchScore[researchScore.length -1])
                        setNextLevel(-1)
                    }
                    

                }else{
                    
                }


            }

        }
        fetch()
    }, [])

     if (adminPublicKeys.includes(publicKey)){
        // admin view 

        let add_user = async () => {
            result =  await add_account(user, newPrivateKey, newPublicKey, userMode) 
            if (result == "failure"){
                 alert("Failed to add user")
            }else{
                alert("successfully added user")
            }
         }

        return <div className='body'>
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
                <option value="admin">admin</option>
            </select>
            <button onClick={() => {add_user()}}>Add User</button>

    </div>
    
    }else{

        return <div className='body'>
            <h1>Welcome {publicKey}</h1>
            <p>This is Puzzle Garden. This is an experimental tool for generating logic grid puzzles, with or without narrative elements. With this interface you will be able to create, play, and share your own logic grid puzzles. </p>
        
            <div className="personaCard">
            <div className="researchIcon">
            <img src={images[score]} width="500" height="500"/>
            </div>
            <div className="personaText">
            <h1>Research Zone</h1>
            <p> This is primarily a research project, so we greatly appreciate you contributing to our research by periodically filling out our survey.</p>
            <p>You have filled out <b>{numSurveys} surveys</b>, which makes you a {score}. {desc[score]} Fill out <b>{nextLevel} more surveys</b> to progress your research score. </p>
            <p><b>You have not filled out a survey yet</b>, we highly encourage you to fill out one now!</p>
            </div>
       
        
        </div>
        <button className="selectButton" onClick={() => openSurvey(user)}>Fill out a survey!</button>

            <div className="faq">
                <h1>Frequently Asked Questions</h1>
                <p>We will update this page as we get questions. Please contact shyne.f@northeatern.edu with any questions.</p>

                <h2>Question 1</h2>
                <p>Answer 1</p>
            </div>
           

           
        </div>
    }
    
}