import { useEffect, useState } from "react"
import Select from 'react-select' 
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager
} from '@floating-ui/react';


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


const base_templates = {"compound_or":"Either {ent1} is {ent2} or {ent3} is {ent4}", "simple_or": "Either {ent1} or {ent2} is {is_ent}",  "not": "{ent1} is not {ent2}", "is": "{ent1} is {ent2}",  "before_un": "{ent1} has less {num_cat} than {ent2}", "before": "{ent1} has {amount} less {num_cat} then {ent2}"}
let kindAttributes = {"is": ["ent1", "ent2"], "not": [ "ent1", "ent2"], "before": [ "ent1", "ent2", "num_cat", "amount" ], "before_un": [ "ent1", "ent2", "num_cat"], "simple_or":  [ "ent1", , "ent2",  "is_ent"], "compound_or": ["ent1", "ent2", "ent3", "ent4"]}


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
    }  else if (kind == "compound_or"){
        let params1 = {"ent1": params["ent1"], "ent2": params["ent2"]} 
        let params2 = {"ent1": params["ent3"], "ent2": params["ent4"]} 

        if ((params1["ent1"] == params2["ent1"] && params1["ent2"] == params2["ent2"]) ||
        (params1["ent1"] == params2["ent2"] && params1["ent2"] == params2["ent1"])){
          return "The two statements can't be the same"
        }

        check1 = validateHint("is", params1, ent_map, categories)
        check2 = validateHint("is", params2, ent_map, categories)

        if(check1 == "" && check2 == ""){
          return ""
        }else if (check1 != ""){
          return check1 
        }else{
          return check2
        }
      
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
  }else if (kind == "simple_or"){
    attrs = [ent_map[params["ent1"]].name, params["ent1"], ent_map[params["ent2"]].name, params["ent2"],  ent_map[params["is_ent"]].name,params["is_ent"]]
  }else if (kind == "compound_or"){
    let params1 = {"ent1": params["ent1"], "ent2": params["ent2"]} 
    let params2 = {"ent1": params["ent3"], "ent2": params["ent4"]} 
    let is_1 = toGrammar("is", params1, ent_map)
    let is_2 = toGrammar("is", params2, ent_map)
    attrs = [is_1, is_2]
  }
  ob[kind] = attrs 
  return ob 
  
}

let setHintToTemplate = (setHintString, kind) => {
  setHintString(base_templates[kind])
}

let replaceParam = (hintString, setHintString, param, template, newValue) => {
  const paramNames = [];
    const regexStr = template.replace(/\{(\w+)\}/g, (_, name) => {
      paramNames.push(name);
      return '(.+)';
    });
  
    const regex = new RegExp(`^${regexStr}$`);
    const match = hintString.match(regex);
  
    if (!match) return null;
  
    // Build result object from captured groups
    let result = "";
    paramNames.forEach((name, i) => {
      if (name == param){
        result = hintString.replace(match[i+1], newValue)
      }
    });
  
    setHintString(result)
}

let getPossibleValues = (categories, ent_map, kind, param, hintString) => {
  params = matchTemplate(base_templates[kind], hintString)
  allEnts = categories.map((c) => c.entities).flat() 
  if (params == null){
    return []
  }
  if(kind == "is" || kind == "not"){
    match_ent = param == "ent1"? "ent2": "ent1"
    
    let cats = categories 

    if (params[match_ent] in ent_map){
      cats = categories.filter((c) => c.name != ent_map[params[match_ent]].name)
    }

    return cats.map((c) => c.entities).flat()
  
  }else if (kind == "before_un" || kind == "before"){
    if (param == "ent1" || param == "ent2"){
        let cats = categories 
        num_cat = categories.filter((t) => (t.name == params["num_cat"]))
        if (num_cat.length == 1){
          cats = categories.filter((t) => (t.name != params["num_cat"]))
        }

        ents = cats.map((c) => c.entities).flat()
        check_param = param == "ent1" ? "ent2" : "ent1"

        return ents.filter((e) => e != params[check_param])
        
    } else if (param == "num_cat") {
      let forbidden = []

      if (params["ent1"] in ent_map){
        forbidden.push(ent_map[params["ent1"]].name)
      }
      if (params["ent2"] in ent_map){
        forbidden.push(ent_map[params["ent2"]].name)
      }
      cats = categories.filter((c) => {
        if (! c.is_numeric){
          return false 
        }else{
          if(forbidden.includes(c.name)){
            return false
          }else{
            return true
          }
        }
      })

      return cats.map((c)=>c.name)
    } else if (param == "amount") {
      var list = [];
      for (var i = 1; i <categories[0].entities.length; i++) {
          list.push(i);
      }

      return list 
    }

  } else if (kind == "simple_or"){
    if (param == "ent1" || param == "ent2"){
      let cats = categories 
      if (params["is_ent"] in ent_map){
        cats = categories.filter((t) => (t.name != params["is_ent"]))
      }

      ents = cats.map((c) => c.entities).flat()
      check_param = param == "ent1" ? "ent2" : "ent1"

      return ents.filter((e) => e != params[check_param])
     
    }else if (param == "is_ent") {
      let cats = categories
      if (params["ent1"] in ent_map) {
        cats = cats.filter((c) => c.name != ent_map[params["ent1"]].name)
      }

      if (params["ent2"] in ent_map) {
        cats = cats.filter((c) => c.name != ent_map[params["ent2"]].name)
      }

      return cats.map((c) => c.entities).flat()

    }

  }else if (kind == "compound_or"){
    let old_params = params
    let params1 = {"ent1": params["ent1"], "ent2": params["ent2"]} 
    let params2 = {"ent1": params["ent3"], "ent2": params["ent4"]} 

    let check_params = ["ent1", "ent2", "ent3", "ent4"].filter((p) => p != param)
    let limit_params = check_params.every((p) => params[p] in ent_map)
    

    let possible = []
    if (param == "ent1" || param == "ent2"){
      let new_string = params1["ent1"] + " is " + params1["ent2"]
      possible = getPossibleValues(categories, ent_map, "is", param, new_string)
    }else{
      let new_string = params2["ent1"] + " is " + params2["ent2"]
      let new_param = param == "ent3"? "ent1": "ent2"
      possible = getPossibleValues(categories, ent_map, "is", new_param, new_string)
    }

    if (limit_params){
      let first_half = param == "ent1" || param == "ent2"
      let other_statement = first_half? ["ent3","ent4"] : ["ent1", "ent2"]
      let other_ents = other_statement.map((o) => old_params[o])
      let to_check = first_half?  param=="ent1"? "ent2":"ent1" :  param=="ent3"? "ent4":"ent3"

      if (other_ents.includes(old_params[to_check])){
        bad_ent = other_ents.filter((e) => e != old_params[to_check])[0]
        possible = possible.filter((e) => e != bad_ent)
      }
    }

    return possible

  }else{
    return []
  }

} 


export default HintWriter = ({categories, grammar, setGrammar, hintString, setHintString, onEnter}) => {
    //let [hintString, setHintString] = useState("")
    let [error, setError] = useState("Incorrect Format")
    const [isFocused, setIsFocused] = useState(false);
    let [kind, setKind] = useState(null)
    let [paramOptions, setParamOptions] = useState([])
    //let [grammar, setGrammar] = useState(null)
    let ent_map = create_entity_map(categories) 

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onEnter()
      }
    }

    const {refs, floatingStyles, context} = useFloating({
      open: isFocused,
      onOpenChange: setIsFocused,
      middleware: [offset(10), flip(), shift()],
      whileElementsMounted: autoUpdate,
      placement:"bottom-start"
    });
  
    const click = useClick(context, {toggle:false, keyboardHandlers:false});
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
      click,
      dismiss,
      role,
    ]);
  

    useEffect(() => {
        found = false 
        k = kind 
        // first check if it fits a template 
        Object.keys(base_templates).forEach((key) => {
            if (!found){
              template =matchTemplate(base_templates[key], hintString)  
              if (template != null){
                  error = validateHint(key, template, ent_map,categories)
                  setError(error)
                  setKind(key)
                  k=key 

                  if (error == "" ){
                    setGrammar(toGrammar(key, template, ent_map))
                  }else{
                    setGrammar(null)
                  }
                  found = true 
              }
            }
         
        })

  
        
          const params = k == null? [] : kindAttributes[k].map((param) => {
            let list = getPossibleValues(categories, ent_map,k, param, hintString)
            let options = list.map((e) => {
              return {value:e, label:e}
            })

            let params = matchTemplate(base_templates[k], hintString)

            value = params == null || !list.includes(params[param]) ? null : options.filter((o) => o.value == params[param])

            return <div>
              Select parameter: {param}
              <Select value={value} options={options} onChange={(e) => replaceParam(hintString, setHintString, param, base_templates[k], e.value)}/>
            </div>
          })
          setParamOptions(params) 
       

        

        if (!found){
          setError("Incorrect Format")
          setGrammar(null)
          setKind(null)
        }

    }, [hintString])

    const kindOptions = [
      {value: "is", label:"is"}, 
      {value: "not", label:"not"}, 
      {value:"before_un", label:"before unspecified"}, 
      {value: "before", label:"before specified"}, 
      {value: "simple_or", label: "simple or"}, 
      {value: "compound_or", label: "compound or"}
    ]

    

    kindChange = (e) => {
      setHintToTemplate(setHintString, e.value)

    }

    kind_value = kind == null? null : kindOptions.filter((o) => o.value == kind)[0]

    const helper = <div className="writerHelp">
      Kind <div class="tooltip"> &#40; ? &#41;
            <span class="tooltiptext">There are five kinds of hints: 
                <ol>
                    <li><b>is</b>: the first and second entity are connected</li>
                    <li><b>not</b>: the first and second entity are not connected</li>
                    <li><b>before</b>: the first entity is before/less than the second entity in a numeric category </li>
                    <li><b>simple_or</b>: either the first or the second entity is the comparison entity, but not both</li>
                    <li><b>compound_or</b>: either the first or the second <i>is</i> statement is true, but not both</li>
                </ol> 
            </span>
        </div>
      <Select value={kind_value} onChange={kindChange} options={kindOptions}/> 

      {kind != null? paramOptions: ""}
    </div>

    return <div className="hintWriter">

        <input ref={refs.setReference} {...getReferenceProps()} onKeyDown={handleKeyDown}
                value={hintString} size={40} onChange={(v) => setHintString(v.target.value)} ></input>
        <p className="error">{error}</p>
        {isFocused && <FloatingFocusManager order={"reference"} context={context} modal={true}>
          <div
            ref={refs.setFloating}
      
            {...getFloatingProps()}
          >
            {helper}
          </div>
        </FloatingFocusManager>}
    </div>
    
}