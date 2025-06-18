import { useContext, useState, useRef, useCallback , useEffect} from "react"
import { useIdleTimer } from "react-idle-timer"
import { getPrompt } from "./Firestore/pythonAPI"
import { addReflection } from "./Firestore/sendData"

const puzzleToString = (puzzle) => {
    str = ""
    for (let row = 0; row < puzzle.length; row++) {
        str += rowToString(puzzle[row], isFirst = row == 0)
    }
    return str
}


let CustomPrompt = ({question, mode, setMode, isOpen, setIsOpen, instanceId, puzzle, puzzleStart, promptStart}) => {

    let [answer, setAnswer] = useState(""); 
    let [response, setResponse] = useState(""); 

        // State to determine if the popup is being dragged
    const [isDragging, setIsDragging] = useState(false);

    // State to keep track of the popup's position
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Ref to store the initial mouse position when dragging starts
    const startPos = useRef({ x: 0, y: 0 });

    // Ref to store the popup element
    // This is the element we are moving
    const popupRef = useRef(null);

     // Function to handle mouse movement while dragging
    const onMouseMove = useCallback((e) => {
        if (!isDragging) return;
        setPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
        });
    }, [isDragging]);

    // Function to handle the end of a drag event
    const onMouseUp = () => {
        setIsDragging(false);
    };

    // Function to handle the start of a drag event
    const onMouseDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);
        startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    // Effect to add and clean up event listeners for dragging
    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseMove]);

    let submitAnswer = () => {
        setMode("answer"); 
        let newTime = new Date()
        let ms = newTime - puzzleStart 
        addReflection(instanceId, promptStart, ms, puzzleToString(puzzle), question, answer);
      
        

        if (answer.length < 50){
            setResponse("Continue to reflect on your process as you attempt to solve the puzzle.")

        }else if (answer.length < 100){
            setResponse("Good job taking the time to reflect on this question. ")
        }else if (answer.length < 150){
            setResponse("Great! That was a very thoughtful response.")
        }else{
            setResponse("Wow! You put some serious effort into your response. Taking time to reflect is an import part of the learning process.")
        }

        setAnswer("")
    
    }
    if (!isOpen) {return null}

    return <div className="popup-overlay">
        <div
        className="popup"
        ref={popupRef}
        onClick={(e) => e.stopPropagation()} // to prevent event delegation to the overlay
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }} //to move out popup
      >
        <div className="popup-header" onMouseDown={onMouseDown}>
            <h1>Stuck? Take a moment to reflect</h1>
            </div>
   
        <div className="popup-content">
            

            {mode == "question"? 
        <div>
            <p>{question}</p>
            <textarea onChange={(e) => setAnswer(e.target.value)} value={answer} rows={4} cols={50} />
            <br/>
            <button onClick={submitAnswer}>Submit</button>
        </div> 
        : <div>
            <p>{response}</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
        </div>}
        </div>
        </div>
    </div>
   
}


const defaultPrompts = (setQuestion, setMode, setIsOpen) => {
    prompts = ["Can you describe your process, why are you doing this the way you are?",
    "What do you know that can help you solve the problem?",
    "What assumptions are you making about the puzzle, and how can you test those assumptions?",
    "How are you monitoring your progress?",
    "What strategies did you use in prior puzzles that were effective? How can you apply them here?",
    "What makes you think your last move was correct?",
    "What does your last move tell you about the other clues you have?",
    "Can you explain to me what your approach has been so far?",
    "Can you eliminate any options based on what you know so far?"]
    let prompt_i = Math.floor(Math.random() * prompts.length);
    let pr = prompts[prompt_i]

    setQuestion(pr)
    setMode("question")
    setIsOpen(true)
}

const relevantPrompts = (setQuestion, setMode, setIsOpen, puzzle, grid, hints) => {
    console.log("relevantPrompts")
    getPrompt(puzzle, hints, grid()).then((pro) => {
        setQuestion(pro)
        setMode("question")
        setIsOpen(true)
    })
}


/**
 * @param onIdle - function to notify user when idle timeout is close
 * @param idleTime - number of seconds to wait before user is logged out
 */
export default UsePrompts = ({instanceId, startTime, promptMode, puzzle, grid, hints, displayPrompts, idleTime = 10 }) => {
    const idleTimeout = 1000 * idleTime;
    const [isIdle, setIdle] = useState(false)
    let [isOpen, setIsOpen] = useState(false); 
    let [mode, setMode] = useState("question"); 
    let [question, setQuestion] = useState("")
    let [promptStart, setPromptStart] = useState(0); 
    
    const handleIdle = () => {
        setIdle(true)
        if (displayPrompts){
            let newTime = new Date()
            let ms = newTime - time 
            setPromptStart(ms)
            if (promptMode == "generic"){
                defaultPrompts(setQuestion, setMode, setIsOpen)
            }else{
                relevantPrompts(setQuestion, setMode, setIsOpen, puzzle, grid, hints)
            }
        }
   
    }
    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        onIdle: handleIdle,
    })
    return <CustomPrompt question={question} isOpen={isOpen} setIsOpen={setIsOpen} mode={mode} setMode={setMode} puzzle={puzzle} promptStart={promptStart} puzzleStart={startTime} instanceId={instanceId}/>
    
}
