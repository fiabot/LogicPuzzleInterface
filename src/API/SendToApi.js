import {api, EVOLVE_URL, ADD_ACCOUNT_URL, LIKE_PUZZLE, ITER_EVOLVE, ADD_GRAMMAR_RULE, ADD_CATEGORY, GET_PUBLIC_KEY, ADD_BRAINSTORM, REMOVE_PUZZLE, UPDATE_PUZZLE, ADD_SCEN, NEW_SESSION, ADD_CLICK, POST_PUZZLE, ADD_COMMENT, LIKE_POSTED_PUZZLE, UNLIKED_POSTED_PUZZLE, VIEW_PUZZLE} from './config' 


let CLICK_TYPES = {"select scenario": "casual", "add example category" : "casual", "select recommendation": "casual", "view similar": "casual", "select similar": "casual", "get brainstorm": "casual",  "copy narrative": "casual",
"new scenario": "serious", "new category": "serious", "edit entity": "serious", "add grammar": "serious", "add brainstorm": "serious", "edit hint":"serious", "edit narrative": "serious", "filter by hint": "serious", "filter by solution": "serious", "edit puzzle": "serious", 

"filter by hint size": "neutral", "filter by difficulty": "neutral", "post puzzle": "neutral", "add comment": "neutral", "save as pdf": "neutral", "open link": "neutral" 

} 

let postEvolution = async(categories, gens = 100, popsize = 50) => {
    request = {"puzzle": {"categories": categories}, "gens":gens, "pop_size": popsize}

    response = await api.post(EVOLVE_URL, request)

    return response.data 
}


let startIterEvolve = async(categories, user, name =null, scenario =null,  gens = 10, popsize = 100) => {
    request = {"puzzle": {"categories": categories}, "gens":gens, "pop_size": popsize, "user": user}

    if (name) {
        request["name"] = name
    }

    if (scenario){
        request["scenario"] = scenario
    }

    response = await api.post(ITER_EVOLVE, request)

    return response.data 
}

let continueIterEvolve = async(id, user, gens = 40, popsize = 100) => {
    request = {"id": id, "gens":gens, "pop_size": popsize, "user": user}

    response = await api.post(ITER_EVOLVE, request)

    return response.data 
}


let login = async(username, setUserId, setPublicKey, setMode) => {
    request= {"user": username }
    response = await api.post(GET_PUBLIC_KEY, request)

    if (response.status < 300){
        setUserId(username)
        setPublicKey(response.data.publicKey)

        setMode(response.data.mode)
        
        return "success"
        
    }else{
        return null 
    }

   
}



let add_account = async(username, privateKey, publicKey, mode) => {
    request= {"user": username, "privateKey": privateKey, "publicKey": publicKey, "mode":mode}
    response = await api.post(ADD_ACCOUNT_URL, request)

    if (response.status < 300){
        return "success"
        
    }else {
        return "failure"
    }

}

let new_session = async(privateKey, time) => {
    request=  {"privateKey": privateKey, "startTime": time}

    response = await api.post(NEW_SESSION, request)

    return response.data 
}

let add_click = async(sessionId, n, startTime, data = null) =>{
    time = new Date() - startTime 
    request = {"sessionID": sessionId, "name": n, type: CLICK_TYPES[n], "time":time}

    if (data != null){
        request["data"] = data 
    }

    response = await api.post(ADD_CLICK, request)

    return response 

   
}


let view_puzzle = async(puzzle, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "puzzleId":puzzle }
    response = await api.post(VIEW_PUZZLE, request)

  

    return response
}

let like_puzzle = async(puzzle, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "puzzle":puzzle }
    response = await api.post(LIKE_PUZZLE, request)

  

    return response
}

let like_posted_puzzle = async(puzzleId, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "puzzleId":puzzleId }
    response = await api.post(LIKE_POSTED_PUZZLE , request)

  

    return response
}

let unlike_posted_puzzle = async(puzzleId, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "puzzleId":puzzleId }
    response = await api.post(UNLIKED_POSTED_PUZZLE , request)

  

    return response
}


let post_puzzle = async(puzzle, title, body, time, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "puzzle":puzzle, "title": title, "body": body, "time":time}
    response = await api.post(POST_PUZZLE, request)

  

    return response
}

let add_comment = async(puzzle_id, comment,  time, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "comment": comment, "puzzleId": puzzle_id, "time":time}
    response = await api.post(ADD_COMMENT, request)

  

    return response
}

let remove_puzzle = async(key, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "key":key }
    response = await api.post(REMOVE_PUZZLE, request)

  

    return response 
}

let update_puzzle = async(key, puzzle, user) => {
    if (user == null){
        return "LOGIN"
    }
    request= {"username":user, "key":key, "puzzle":puzzle }
    response = await api.post(UPDATE_PUZZLE, request)

  

    return response 
}

let add_cat = async (cat, user) => {
    request = {"user": user, "category": cat}
    response = await api.post(ADD_CATEGORY, request)
    return response 



}


let add_scen = async (user, name, scen, cats) => {
    request = {"user": user, "name": name, "scenario":scen, categories: cats}
    response = await api.post(ADD_SCEN, request)
    return response 

}

let add_is = async (cat1, cat2, template, user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "template": template, type:"is"}
    response = await api.post(ADD_GRAMMAR_RULE, request)
    return response 

}

let add_not = async (cat1, cat2, template, user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "template": template, type:"not"}
    response = await api.post(ADD_GRAMMAR_RULE, request)
    return response 

}

let add_before  = async (cat1, cat2, num_cat,  timed_template, untimed_template, step, user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "num_cat": num_cat, "step": step, "untimed": untimed_template, timed: timed_template, type:"before"}
    response = await api.post(ADD_GRAMMAR_RULE, request)
    return response 
}


let add_or  = async (cat1, cat2, is_cat,  template, user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "is_cat": is_cat, "template": template, type:"or"}
    response = await api.post(ADD_GRAMMAR_RULE, request)
    return response 

}



let add_is_brain = async (cat1, cat2, template, user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "template": template, type:"is"}
    response = await api.post(ADD_BRAINSTORM, request)
    return response 

}

let add_not_brain = async (cat1, cat2, template, user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "template": template, type:"not"}
    response = await api.post(ADD_BRAINSTORM, request)
    return response 

}

let add_before_brain  = async (cat1, cat2, num_cat,  template, timed,  user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "num_cat": num_cat, "template": template, "timed": timed,  type:"before"}
    response = await api.post(ADD_BRAINSTORM, request)
    return response 
}


let add_or_brain  = async (cat1, cat2, is_cat,  template, user) => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "is_cat": is_cat, "template": template, type:"or"}
    response = await api.post(ADD_BRAINSTORM, request)
    return response 

}



export {postEvolution, add_account, like_puzzle, startIterEvolve, continueIterEvolve, add_is, add_not, add_before, add_or, add_cat, login,add_before_brain, add_is_brain, add_or_brain, add_not_brain, remove_puzzle, update_puzzle, add_scen, new_session, add_click, post_puzzle, add_comment, like_posted_puzzle, unlike_posted_puzzle, view_puzzle}