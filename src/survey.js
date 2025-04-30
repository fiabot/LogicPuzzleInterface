import { useEffect,useState } from "react";
import { add_survey } from "./API/SendToApi";
import "./survey.css";


// questions from the video game demand scale  (cognitive) and the GUESS scale (enjoyment)
// "game" is changed to puzzle for clearity 
let creativeSupportIndex = ["The system or tool allowed other people to work with me easily.",
    " It was really easy to share ideas and designs with other people inside this system or tool.", " I would be happy to use this system or tool on a regular basis.", "I enjoyed using the system or tool.", 
    "It was easy for me to explore many different ideas, options, designs, or outcomes, using this system or tool.", "The system or tool was helpful in allowing me to track different ideas, outcomes, or possibilities.",
    "I was able to be very creative while doing the activity inside this system or tool.",
    "The system or tool allowed me to be very expressive.", "My attention was fully tuned to the activity, and I forgot about the system or tool that I was using.", 
    "I became so absorbed in the activity that I forgot about the system or tool that I was using.", " I was satisfied with what I got out of the system or tool.", "What I was able to produce was worth the effort I had to exert to produce it."
];

let openResponseQs = ["What was your goal when using the interface?", "Did you accomplish/make progress towards this goal?", "What features did you use most and why?", "What features did you try but didn't like or didn't find useful? Why?", "Is there a feature you wish was included?", "If you created a puzzle you particularly liked, please example why and include the link to the puzzle."]

let answers = ["1 (strongly disagree)", "2", "3", "4", "5", "6", "7", "8", "9", "10 (strongly agree)"];

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

let updateResponse = (q, value, responses, setResponses) => {
    let r = { ...responses };
    r[q] = value;
    setResponses(r);
}
let LikertScale = ({ question, answers, responses, setResponses }) => {
    let answerButtons = answers.map(
        (answer, idx) => {
            return (<li key={answer + idx + 1}>
                <input type="radio" name={question} value={idx + 1} onChange={() => updateResponse(question, idx + 1, responses, setResponses)} />
                <label>{answers[idx]}</label>
            </li>)
        })

    return (
        <div>
            <p className="statement">{question}</p>
            <ul className='likert'>
                {answerButtons}
            </ul>
        </div>
    );
}

let OpenResponse = ({question, responses, setResponses}) => {
    console.log(question)

    return <div> 
    <p className="statement">{question}</p>
<textarea
rows={7} 
cols={80}
placeholder={"Type answer here"}
onChange={(e) => {
    updateResponse(question, e.target.value, responses, setResponses)
}} /> 

</div>



}

let postResponse = (indexResponses, openResponses,  user) => {
    let nullResponses = Object.keys(indexResponses).filter((key) => { return indexResponses[key] == -1 });

    if (nullResponses.length > 0) {
        Promise.resolve().then(alert("Please answer all multiple-choice questions."));
    } else {
        data = {"time": new Date().toJSON, "CSI": indexResponses, "openResponses": openResponses}
        add_survey(user, data)
        alert("Survey Submitted")
    }

}

export default Survey = ({ user, username}) => {


    let r = {}
    creativeSupportIndex.map((question) => r[question] = -1);
    let r2 = {}
    openResponseQs.map((question) => r2[question] = "");

    let [indexResponses, setIndexResponses] = useState(r);
    let [openResponses, setOpenResponses] = useState(r2)
    let qs = creativeSupportIndex.map((question) => { return <LikertScale key={question} question={question} answers={answers} responses={indexResponses} setResponses={setIndexResponses} /> });

    let qs2 = openResponseQs.map((question) => { return <OpenResponse key={question} question={question} responses={openResponses} setResponses={setOpenResponses} /> });
    return (<div className="wrap">

        <h1 className="likert-header"> Please answer the questions below about your experience using the interface</h1>

        <form action="">
            {qs}

        <h1 className="likert-header"> Optionally answer any or all of the questions below </h1>
         {qs2}
    



            <button className="submit" onClick={() => postResponse(indexResponses, openResponses, user)} type="button">Submit</button>
        </form></div>);
}
