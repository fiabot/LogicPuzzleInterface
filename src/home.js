
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


        return <div className='body'>
            <h1>Welcome {publicKey}</h1>
      
            <p>This is Puzzle Garden. This is an experimental tool for generating logic grid puzzles. With this interface you will be able to create, play, and share your own logic grid puzzles. </p>

           <p>If this is your first time, or if you need a refresher, using this interface, please refer to the tutorial page at the top menu. This will guide you with the basics you need to get started making puzzles.</p>
            


            <div className="faq">
                <h1>Frequently Asked Questions</h1>
                <p>We will update this page as we get questions. Please contact shyne.f@northeatern.edu with any questions.</p>

                <h2>What is a logic grid puzzle?</h2>
                <p>Logic grid puzzles are a particular type of puzzle that started out as pen and paper puzzles. You may also have heard them referred to as "Zebra" or "Einstein" puzzles. 
                    In these puzzles you have to use a series of hints to determine if entities are related ("O") or not related ("X").  Each entity belongs to exactly one other entity in each of the other categories. 
                    For example, in our murder mystery example scenario you have to determine where each suspect was at each time. If you have the hint "Ms. Scarlet is the study", you can place an "O" in the grid space intersecting Ms.Scarlet and Study, a "X" for all other suspects in the study, and a "X" for all other rooms Ms. Scarlet could have been in. </p>
                <h2> Why are the hints not always grammatically correct?</h2>
                <p>In our tool hints are not actually written in English, but in a format that represents the logical relationship between entities. This serves as the easiest way to communicate between human authors/readers and the generation system. A puzzle's hints can be manually edited once it is "liked". </p>
                <h2>Why does it take a long time to generate puzzles?</h2>
                <p>The larger the puzzle, the more time it will take to generate. In most cases you just need to be patient, especially if you have puzzles larger than 3 categories or 4 entities per category. Really large puzzles might cause a server timeout, and may never generate.

                    If tasks other than generations fail (e.g. logging in, posting a puzzle) please contact us at shyne.f@northeastern.edu. 
                </p>

                <h2>How are puzzles generated?</h2>
                <p>Puzzles are generated using a type of algorithm called a Genetic Algorithm. 
                    This program <b>does not</b> use generative AI (such as Chat-GPT), and does not use any training data. 
                    Instead puzzles are first randomly generated, by creating lists of hints. These puzzles are then optimized until they become solvable. This generator creates many puzzles but only keeps the puzzles with the smallest number of hints for puzzles with the same difficulty and solution.  </p>
             
            <h2>How does this project help research?</h2>
            <p>We are looking into how to best make interfaces where humans work with a computational system. By trying our system and providing feedback, you are helping other designers better create tools like this in the future.</p>
    
            </div>
           

           
        </div>
    
    
}