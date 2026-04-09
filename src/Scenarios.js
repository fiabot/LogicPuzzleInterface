import { useEffect, useState } from "react"
import { getScenarios, getExamples } from "./API/GetFromApi"
import { add_click } from "./API/SendToApi"
import { useFloating,useClick,
  useDismiss,
  useRole,
  useInteractions,
  useId, FloatingOverlay, FloatingFocusManager } from '@floating-ui/react';


let ScenarioCard = ({title, desc, select,user, sessionId, sessionStart}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">{title}</p>
      <p class="text-body">{desc}</p>
    </div>
    <button class="card-button" onClick={() => {select(); add_click(user, sessionId, "Select Scenario", sessionStart)}}>Select</button>
  </div>

}

let NewCard = ({new_scen,user, sessionId, sessionStart}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">Create New</p>
      <p class="text-body-large">+</p>
    </div>
    <button class="card-button" onClick={()=> {new_scen(); add_click(user,sessionId, "New Scenario", sessionStart)}}>New Scenario</button>
  </div>
}

let PickFromExamples = ({pickScenario}) => {

  let [examples, setExamples] = useState(null)

  useEffect(() => {
    let fetch = async() => {
      e = await getExamples()

      setExamples(e)
    }
    fetch()
  }, [])
  let content = <div>loading</div>
  if (examples != null){
    console.log(examples)
    content = examples.map((e) => <ScenarioCard title={e.title} desc={e.desc} select={() => pickScenario(e)} />)
  }

  return content 

  
}

let CreateNew = ({new_scen,user, sessionId, sessionStart}) => {
  const [isOpen, setIsOpen] = useState(true);
  
 
  const {refs, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
 
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context);
 
  // Merge all the interactions into prop getters
  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
    role,
  ]);
 
  // Set up label and description ids
  const labelId = useId();
  const descriptionId = useId();

  let showExamples = () => {
    setContent(<PickFromExamples className="cardList" pickScenario={new_scen} />)
  }

  let fromScratch = <button className="mediumButton" onClick={() => {new_scen(); add_click(user, sessionId, "Create from Scratch", sessionStart)}}>Start from scratch</button>
  let fromExample =  <button  className="mediumButton" onClick={() => {showExamples(); add_click(user, sessionId, "Pick from Example", sessionStart)}}>Start from example</button>

  let [content, setContent] = useState(<div>{fromScratch}{fromExample}</div>)

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Reference element
      </button>
      {isOpen && (
        <FloatingOverlay
          lockScroll
          style={{background: 'rgba(0, 0, 0, 0.8)'}}
        >
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
            >
              <h2 id={labelId}>Heading element</h2>
              <p id={descriptionId}>Description element</p>
              {content}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
}


export default ScenarioScreen = ({user, sessionId, sessionStart, select, new_scen}) => {
    let [scenarios, setScenarios] = useState([])
    let [content, setContent] = useState(<div>Loading</div>)

    let create_new = () => {
      setContent(<CreateNew new_scen={new_scen} user={user} sessionId={sessionId} sessionStart={sessionStart} /> )
    }

    useEffect(() => {
        let get = async() =>{
            scens = await getScenarios(user)
            scenario_buttons = scens.map((scen, idx) => <ScenarioCard key={idx} title={scen["data"]["title"]}  desc={scen["data"]["description"]} user={user} sessionId={sessionId} sessionStart={sessionStart}  select={() => {select(scen)}} />)

            new_button = <NewCard new_scen={create_new} key="new" user={user} sessionId={sessionId} sessionStart={sessionStart}/> 
        
            scenario_buttons.push(new_button)
            setScenarios(scens)
            setContent(scenario_buttons)
        }
        get()
    }, [])

   


    

    return <div className="postContainer">
        {content}
    </div>
}