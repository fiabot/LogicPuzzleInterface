import { useReactToPrint } from "react-to-print";
import { get_is_brainstorm, get_not_brainstorm, get_or_brainstorm, get_before_brainstorm } from "./API/GetFromApi";
let printDocument=(ref) =>{
    const reactToPrintFn = useReactToPrint({ ref })

    reactToPrintFn()
;
  }

  let getBrainStormIdeas = async (clueGrammar, user) => {
    let kind = Object.keys(clueGrammar)[0]
    attributes = clueGrammar[kind]
    if (kind == "not"){
      cat1 = attributes[0]
      ent1 = attributes[1]
      cat2 = attributes[2]
      ent2 = attributes[3]

      let li = await get_not_brainstorm(cat1, cat2,user)

      li = li.map((el) => {
        el = el.replace("{ent1}", ent1)
        el = el.replace("{ent2}", ent2)
        el = el.replace("{cat1}", cat1)
        el = el.replace("{cat2}", cat2)
        return el 
      })

      return li 
    }

    else if (kind == "is"){
        
        let cat1 = attributes[0]
        let ent1 = attributes[1]
        let cat2 = attributes[2] 
        let ent2 = attributes[3]

        let li = await get_is_brainstorm(cat1, cat2,user)

      li = li.map((el) => {
        el = el.replace("{ent1}", ent1)
        el = el.replace("{ent2}", ent2)
        el = el.replace("{cat1}", cat1)
        el = el.replace("{cat2}", cat2)
        return el 
      })

      return li 
  }
    else if (kind == "before"){
            let cat1 = attributes[0]
            let ent1 = attributes[1]
            let cat2 = attributes[2]
            let ent2 = attributes[3]

            let num_cat = attributes[4]

            let brainstorm = await get_before_brainstorm(cat1, cat2, num_cat, user)

            if (attributes.length == 6){
              let amount = attributes[5]

              let li = brainstorm["timed"]

              li = li.map((el) => {
                el = el.replace("{ent1}", ent1)
                el = el.replace("{ent2}", ent2)
                el = el.replace("{cat1}", cat1)
                el = el.replace("{cat2}", cat2)
                el = el.replace("{num_cat}", num_cat)
                el = el.replace("{amount}", amount)
                return el 
              })
        
              return li 

            }
            else{
              let li = brainstorm["untimed"]
              li = li.map((el) => {
                el = el.replace("{ent1}", ent1)
                el = el.replace("{ent2}", ent2)
                el = el.replace("{cat1}", cat1)
                el = el.replace("{cat2}", cat2)
                el = el.replace("{num_cat}", num_cat)
                return el 
              })
        
              return li
            }
            
    }
    else if (kind == "simple_or"){
        let cat1 = attributes[0]
        let ent1 = attributes[1]
        let cat2 = attributes[2]
        let ent2 = attributes[3]

        let is_cat = attributes[4]
        let is_ent = attributes[5] 

        let li = await get_or_brainstorm(cat1, cat2,is_cat,user)

      li = li.map((el) => {
        el = el.replace("{ent1}", ent1)
        el = el.replace("{ent2}", ent2)
        el = el.replace("{cat1}", cat1)
        el = el.replace("{cat2}", cat2)
        el = el.replace("{is_cat}", is_cat)
        el = el.replace("{is_ent}", is_ent)
        return el 
      })

      return li 
    }
    else if (kind == "compound_or"){
        let hint1 = attributes[0]
        let hint2 = attributes[1]
        return []
    }

  }


  let getClueLogic = (clueGrammar) => {

    let kind = Object.keys(clueGrammar)[0]
    attributes = clueGrammar[kind]
    if (kind == "not"){
      cat1 = attributes[0]
      ent1 = attributes[1]
      cat2 = attributes[2]
      ent2 = attributes[3]

      return `${ent1} in the category ${cat1} is not ${ent2} in the category ${cat2}`
    }

    else if (kind == "is"){
        
        let cat1 = attributes[0]
        let ent1 = attributes[1]
        let cat2 = attributes[2] 
        let ent2 = attributes[3]

        return `${ent1} in the category ${cat1} is not ${ent2} in the category ${cat2}`
  }
    else if (kind == "before"){
            let cat1 = attributes[0]
            let ent1 = attributes[1]
            let cat2 = attributes[2]
            let ent2 = attributes[3]

            let num_cat = attributes[4]

            if (attributes.length == 6){
              let amount = attributes[5]

              return `${ent1} in the category ${cat1} is ${amount} units before/less in ${num_cat} then ${ent2} in the category ${cat2}`

            }
            else{
              return `${ent1} in the category ${cat1} is some amount before/less in ${num_cat} then ${ent2} in the category ${cat2}`
            }
            
    }
    else if (kind == "simple_or"){
        let cat1 = attributes[0]
        let ent1 = attributes[1]
        let cat2 = attributes[2]
        let ent2 = attributes[3]

        let is_cat = attributes[4]
        let is_ent = attributes[5] 

        return `Either ${ent1} in the category ${cat1} or ${ent2} in the category ${cat2} is the ${is_ent} in the category ${is_cat}, but not both.`
    }
    else if (kind == "compound_or"){
        let hint1 = attributes[0]
        let hint2 = attributes[1]

        hint1 = getClueLogic(hint1)
        hint2 = getClueLogic(hint2)

        return `One, but not both of these statements is true: ${hint1} OR ${hint2}`
    }

  }

  export {printDocument, getClueLogic, getBrainStormIdeas}


