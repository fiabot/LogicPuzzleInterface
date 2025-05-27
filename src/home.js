
import { add_account, login, new_session } from "./API/SendToApi"
import { getNumSurveys, getUserData } from "./API/GetFromApi"
import { useEffect, useState } from "react"
import { adminPublicKeys } from "./utils";
import "./AuthoringStyle.css" 
import PlayablePuzzleList from "./PlayablePuzzleList";

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


export default HomePage = ({user, publicKey, mode}) => {

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

        const downloadFile = ({ data, fileName, fileType }) => {
            // Create a blob with the data we want to download as a file
            const blob = new Blob([data], { type: fileType })
            // Create an anchor element and dispatch a click event on it
            // to trigger a download
            const a = document.createElement('a')
            a.download = fileName
            a.href = window.URL.createObjectURL(blob)
            const clickEvt = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
            })
            a.dispatchEvent(clickEvt)
            a.remove()
          }
          const exportToJson = e => {
            downloadFile({
              data: JSON.stringify(e),
              fileName: 'data.json',
              fileType: 'text/json',
            })
          }

          let get_user_data = async () =>{
            let data = await getUserData(user)
            exportToJson(data)
          }

        return <div className='body'>
            <h1>Welcome {publicKey}</h1>
            <button className="largeButton" onClick={get_user_data}>Download Data</button>
            <p>This is Puzzle Garden. This is an experimental tool for generating logic grid puzzles, with or without narrative elements. With this interface you will be able to create, play, and share your own logic grid puzzles. </p>

           
            {mode == "mixed"? <p>Watch the beginner tutorial <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=6WtjwUvARt0"> here </a> and the advanced tutorial <a target="_blank" rel="noopener noreferrer" href=" https://www.youtube.com/watch?v=ssL9TOQTVsA">here</a></p>
                :<p>Watch the video tutorial at <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=nAX14YCeD3o">here</a>.</p>}
            {mode == "mixed"? <p>Get the written guide <a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/drive/folders/1D0A6Xbcipixa8_38pyC4gIsceHqOa8er?usp=sharing"> here </a>. </p>:
                <p>Get the written guide <a  target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/1xS9zKdgJvt3lNenDzV_Z2OwrLVOeFSKK/view">here</a>.</p>}
            <div className="personaCard">
            <div className="researchIcon">
            <img src={images[score]} width="500" height="500"/>
            </div>
            <div className="personaText">
            <h1>Research Zone</h1>
            <p> This is primarily a research project, so we greatly appreciate you contributing to our research by periodically filling out our survey.</p>
            <p>You have filled out <b>{numSurveys} surveys</b>, which makes you a {score}. {desc[score]} Fill out <b>{nextLevel} more surveys</b> to progress your research score. </p>
            <p><b>After generating some puzzles</b>, please come back here to fill out a survey!</p>
            </div>
       
        
        </div>
        <button className="selectButton" onClick={() => openSurvey(user)}>Fill out a survey!</button>

            <div className="faq">
                <h1>Frequently Asked Questions</h1>
                <p>We will update this page as we get questions. Please contact shyne.f@northeatern.edu with any questions.</p>


                <h2>How do like save/post puzzles?</h2>
                <p>When generating puzzles you save them by clicking the like button on the upper left-hand corner. You can then come back to these puzzles in the liked puzzles tab of the webpage. Additionally you can click the open link icon (box with an arrow) when will give you a unique URL to view your puzzle with. You won't need to login to view this link and it can be shared with other people. </p>

                <p>To post a puzzle, go to the community page and click the post puzzle button. This will show all your liked puzzle and you can select one to post. You can also add a post title and body to give people more information about your puzzle. </p>

                <h2>Why does it take a long time to generate puzzles?</h2>
                <p>The larger the puzzle, the more time it will take to generate. In most cases you just need to be patient, especially if you have puzzles larger than 3 categories or 4 entities per category. Really large puzzle might cause a server timeout, and may never generate. 

                    If task other then generations (e.g. logging in, posting a puzzle) please contact us at shyne.f@northeastern.edu. 
                </p>

                <h2>How are puzzles generated?</h2>
                <p>Puzzles are generated using a type of algorithm called a Genetic Algorithm. 
                    This program <b>does not</b> use generative AI (such as Chat-GPT), and does not use any training data. 
                    Instead puzzles are first randomly generated, by creating lists of clues. These puzzles are then optimized until they become solvable. This generator creates many puzzles but only keeps the puzzle with the smallest hint size for puzzles with the same difficulty and solution.  </p>
                
                <h2>Why do I need to add a grammar for new categories?</h2>
                <p>Our generator only knows logic, not the English language. Because of this, clues end up looking awkward if you don't tell the generator how to phrase different clues.</p>
            

            <h2>How does this project help research?</h2>
            <p>We are looking how to best make interfaces where humans work with a computational system. By trying our system and providing feedback, you are helping other designers better create tools like this in the future.</p>
    
            </div>
           

           
        </div>
    }
    
}