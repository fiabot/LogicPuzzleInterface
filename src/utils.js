import { useReactToPrint } from "react-to-print";
import { get_is_brainstorm, get_not_brainstorm, get_or_brainstorm, get_before_brainstorm } from "./API/GetFromApi";
import { stringSimilarity } from "string-similarity-js"; 
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

        return `${ent1} in the category ${cat1} is ${ent2} in the category ${cat2}`
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

  let grammar_equal= (g1, g2, loose=true) => {
    let kind = Object.keys(g1)[0]
    let attributes = g1[kind]

    let test_kind = Object.keys(g2)[0]
    let test_attributes = g2[kind]

    if (loose && (kind == "" || test_kind == "")){
        return true
    }

    else if (attributes && test_attributes && attributes.length != test_attributes.length){
      return false 
    }

    else if (kind != "compound_or" && test_kind == kind){
      let matches = test_attributes.filter((a, i) => ((a == attributes[i]) || (loose && (a == "" || attributes[i] ==""))))
      return matches.length == test_attributes.length 
    }else if (kind == "compound_or" && test_kind == kind){
        let test1 = grammar_equal(attributes[0], test_attributes[0])
        let test2 = grammar_equal(attributes[1], test_attributes[1])

        return test1 && test2 
    
    }else{
      return false 
    }
  }


  let hasHint =(hintTemplate, puzzleGrammar) => {

      let sameHints = puzzleGrammar.filter((g) => {return grammar_equal(hintTemplate, g)})

      return sameHints.length > 0

  }

  let numberHintsInCommon = (hints1, hints2) => {
    let matches = hints1.filter((h) => hasHint(h, hints2))
    return matches.length 

  }

  let hasHints = (hints, puzzleList) => {
    let filter = puzzleList.filter((p) => {
      let puzzleGrammar = p["hint_grammar"]
      let matches = hints.filter((h) => hasHint(h, puzzleGrammar))
      return matches.length == hints.length
    })

    return filter 
  }


  let findMutants = (puzzle, puzzleList) => {
    puzzleList = puzzleList.filter((p) => p != puzzle)
    let puzzleGrammar = puzzle["hint_grammar"]


    // sort by hints in common 
    let sorted = puzzleList.toSorted((a, b) =>{
      let matches1 = numberHintsInCommon(puzzleGrammar, a["hint_grammar"])
      let matches2= numberHintsInCommon(puzzleGrammar, b["hint_grammar"])

    

      if (matches1 > matches2) {
        return -1 
      }else if (matches1 < matches2) {
        return 1 
      }else{
        let stringSimilarity1 = stringSimilarity(puzzle["solution"], a["solution"])
        let stringSimilarity2 = stringSimilarity(puzzle["solution"], b["solution"])

        if (stringSimilarity1 > stringSimilarity2){
          return -1 
        }else if (stringSimilarity1 < stringSimilarity2){
          return 1
        }else{
          return 0 
        }
      }
    
    } )

    let sameDiff = sorted.filter((a) => a["diff"] == puzzle["diff"])
    let harder = sorted.filter((a) => a["diff"] > puzzle["diff"])
    let easier = sorted.filter((a) => a["diff"] < puzzle["diff"])

    return [sameDiff, harder, easier]



  }


  let formatTime = (jsonStr) => {
    let time = new Date(jsonStr)
    time = time.toLocaleDateString(undefined, {"month": "short", "day":"numeric"}) + "," + time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

    return time 
  }

  let categoryFilter =(kind, cat, att, allAttrs) => {
    if (kind == "is" || kind == "not"){
        if (att == "cat1"){
            return allAttrs[2] == "" || allAttrs[2] != cat.name
        }else if (att == "cat2"){
            return allAttrs[0] == "" || allAttrs[0] != cat.name
        }
    }else if (kind == "simple_or"){
        if (att == "cat1" || att == "cat2"){
            return true
        }else{
            let cat1 = allAttrs[0] == "" || allAttrs[0] != cat.name
            let cat2 = allAttrs[2] == "" || allAttrs[2] != cat.name

            return cat1 && cat2 
        }
    }else if (kind == "before"){
        if (att == "cat1" || att == "cat2"){
            return true
        }else{
            let cat1 = allAttrs[0] == "" || allAttrs[0] != cat.name
            let cat2 = allAttrs[2] == "" || allAttrs[2] != cat.name
            
            return cat1 && cat2 && cat.is_numeric

        }
    }else{
        return true 
    }
}

let entityFilter =(kind, ent, att, allAttrs) => {
    if (kind == "is" || kind == "not"){
        return true 
    }else if (kind == "simple_or" || kind == "before"){
        if (att == "is_ent"){
            return true
        }else if (att == "ent1"){
          return allAttrs[3] == "" || allAttrs[3] != ent
        }else{
            return allAttrs[1] == "" || allAttrs[1] != ent
          }
    }else{
        return true 
    }
}

function sanitize(string) {
  const map = {
      '&': 'and',
      '<': '(',
      '>': ')',
      "/": '|',
  };
  const reg = /[&<>/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

let adminPublicKeys = ["Admin 1", "Admin 2"]

  export {printDocument, getClueLogic, getBrainStormIdeas, hasHints, findMutants, formatTime, categoryFilter, entityFilter, sanitize, adminPublicKeys}


