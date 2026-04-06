import { useEffect, useState } from "react"


function matchTemplate(template, input) {
    // Extract parameter names from the template
    const paramNames = [];
    const regexStr = template.replace(/\{(\w+)\}/g, (_, name) => {
      paramNames.push(name);
      return '(.+)';
    });
  
    const regex = new RegExp(`^${regexStr}$`);
    const match = input.match(regex);
  
    if (!match) return null;
  
    // Build result object from captured groups
    const result = {};
    paramNames.forEach((name, i) => {
      result[name] = match[i + 1];
    });
  
    return result;
  }


const base_templates = { "not": "{ent1} is not {ent2}", "is": "{ent1} is {ent2}",  "before_un": "{ent1} has less {num_cat} than {ent2}", "before": "{ent1} has {amount} less {num_cat} then {ent2}", "simple_or": "Either {ent1} or {ent2} is {is_ent}"}
let kindAttributes = {"is": ["cat1", "ent1", "cat2", "ent2"], "not": ["cat1", "ent1", "cat2", "ent2"], "before": ["cat1", "ent1", "cat2", "ent2", "num_cat", "amount" ],  "simple_or":  ["cat1", "ent1", "cat2", "ent2", "is_cat", "is_ent"], "compound_or": ["is1", "is2"]}


let create_entity_map = (categories) => {
  let map = {} 
  categories.forEach((cat) => {
    cat.entities.forEach((ent) => {
      map[ent] = cat 
    })
  })

  return map 
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseInt(str)) // ...and ensure strings of whitespace fail
}

let validateHint = (kind, params, ent_map, categories) => {
    if(kind == "is" || kind == "not"){
      if (params["ent1"] in ent_map && params["ent2"] in ent_map){
          if (ent_map[params["ent1"]].name != ent_map[params["ent2"]].name){
            return ""
          }else{
            return "Entities can't be in the same category"
          }
      }else{
        return "Entities must be in the puzzle"
      }
    }else if (kind == "before_un" || kind == "before"){
      num_cat = categories.filter((t) => (t.name == params["num_cat"]))
      if (params["ent1"] in ent_map && params["ent2"] in ent_map && num_cat.length == 1){
        if (num_cat[0].is_numeric){
            if (params["ent1"] == params["ent2"]){
              return "Entities can't be before themselves"
            } 

            if (kind == "before"){
                if (!isNumeric(params["amount"])){
                  return "Amount must be an integer"
                }else{
                  number = parseInt(params["amount"])
                  entities = num_cat[0].entities 
                  
                  if (number <1  || number > entities.length) {
                    return "Amount must be between 1 and " + entities.length 
                  }else{
                    return ""
                  }
                  }

              
              }else{
                return ""
              }
            
        }else{
          return params["num_cat"] + " is not a numeric category"
        }
      }else{
        return "Entities must be in the puzzle"
      }

    } else if (kind == "simple_or"){
      if (params["ent1"] in ent_map && params["ent2"] in ent_map && params["is_ent"] in ent_map){
        if (ent_map[params["ent1"]].name != ent_map[params["is_ent"]].name && ent_map[params["ent2"]].name != ent_map[params["is_ent"]].name){
          if (params["ent1"] == params["ent2"]){
            return  params["ent1"] + " and " + params["ent2"] + "must be different"
          }else{
            return ""
          }
        }else {
          return params["is_ent"] + "must be in a different category to " + params["ent1"] + " and " + params["ent2"]
        }
      }else{
        return "Entities must be in the puzzle"
      }
    }  else{
      return "TODO: rest of kinds"
    }
}

let toGrammar = (kind, params, ent_map) =>{

  ob = {}
  attrs = [] 

  if (kind == "is" | kind == "not"){
    attrs = [ent_map[params["ent1"]].name, params["ent1"], ent_map[params["ent2"]].name, params["ent2"]]
  }else if (kind == "before_un"){
    kind = "before"
    attrs = [ent_map[params["ent1"]].name, params["ent1"], ent_map[params["ent2"]].name, params["ent2"], params["num_cat"]]
  }else if (kind == "before"){
    attrs = [ent_map[params["ent1"]].name, params["ent1"], ent_map[params["ent2"]].name, params["ent2"], params["num_cat"], parseInt(params["amount"])]
  }else if (kind == "or"){
    attrs = [ent_map[params["ent1"]].name, params["ent1"], ent_map[params["ent2"]].name, params["ent2"],  ent_map[params["is_ent"]].name,params["is_ent"]]
  }
  ob[kind] = attrs 
  return ob 
  
}


export default HintWriter = ({categories, grammar, setGrammar, hintString, setHintString, onEnter}) => {
    //let [hintString, setHintString] = useState("")
    let [error, setError] = useState("Incorrect Format")
    //let [grammar, setGrammar] = useState(null)
    let ent_map = create_entity_map(categories) 

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onEnter()
      }
    }
  

    useEffect(() => {
        found = false 
        // first check if it fits a template 
        Object.keys(base_templates).forEach((key) => {
            if (!found){
              template =matchTemplate(base_templates[key], hintString)  
              if (template != null){
                  error = validateHint(key, template, ent_map,categories)
                  setError(error)

                  if (error == "" ){
                    setGrammar(toGrammar(key, template, ent_map))
                  }else{
                    setGrammar(null)
                  }
                  found = true 
              }
            }
         
        })

        if (!found){
          setError("Incorrect Format")
          setGrammar(null)
        }

    }, [hintString])

    return <div>

        <input onKeyDown={handleKeyDown}  value={hintString} onChange={(v) => setHintString(v.target.value)} ></input>
        <p color="red">{error}</p>
    </div>
    
}