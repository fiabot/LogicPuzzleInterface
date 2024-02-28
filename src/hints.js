import { useState , useEffect} from "react"

let recordHint = (time, hint, striked) =>{
    let newTime = new Date()
    let ms = newTime - time 
    console.log("The hint '" + hint + "' was set to '" + striked + "' at time '" + ms +"'" )
}


export default HintDisplay = ({hints, time}) => {
    let makeHint = (hint) =>{
        let [strike, setStrike] = useState(false)

        useEffect(() => {
            // run something every time name changes
            recordHint(time, hint, strike)
          }, [strike]);

        if (strike){
            return ( <li className="strikedText" key={hint} onClick = {() => {setStrike(!strike)}}>{hint}</li>); 
        }else{
            return ( <li key={hint} onClick = {() => {setStrike(!strike)}}>{hint}</li>); 
        }
    }
    let hintsList = hints.map((hint) => makeHint(hint))
    hintsList = <ol>{hintsList}</ol>
    return (     
        <div>
        <h1>Hints</h1>
        {hintsList}
    </div>); 
}