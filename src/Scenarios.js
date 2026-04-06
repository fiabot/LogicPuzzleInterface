import { useEffect, useState } from "react"
import { getScenarios } from "./API/GetFromApi"
import { add_click } from "./API/SendToApi"


let ScenarioCard = ({title, desc, select}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">{title}</p>
      <p class="text-body">{desc}</p>
    </div>
    <button class="card-button" onClick={select}>Select</button>
  </div>

}

let NewCard = ({new_scen}) => {
    return <div class="card">
    <div class="card-details">
      <p class="text-title">Create New</p>
      <p class="text-body">TODO: replace with plus sign</p>
    </div>
    <button class="card-button" onClick={new_scen}>New Scenario</button>
  </div>
}


export default ScenarioScreen = ({user, sessionId, select, new_scen}) => {
    let [scenarios, setScenarios] = useState([])

    

    useEffect(() => {
        let get = async() =>{
            scens = await getScenarios(user)
            setScenarios(scens)
        }
        get()
    }, [])

    scenario_buttons = scenarios.map((scen, idx) => <ScenarioCard key={idx} title={scen["data"]["title"]}  desc={scen["data"]["description"]}  select={() => {select(scen)}} />)

    new_button = <NewCard new_scen={new_scen} key="new"/> 

    scenario_buttons.push(new_button)

    return <div className="postContainer">
        {scenario_buttons}
    </div>
}