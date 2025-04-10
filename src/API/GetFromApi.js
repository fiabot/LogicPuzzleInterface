import {api, API_URL, SAMPLE_CAT_URL, GET_LIKED_PUZZLES, GET_UNUSED_GRAMMARS, GET_TEMPLATE, GET_BRAINSTORMS, GET_SCEN, GET_POSTED_PUZZLES, GET_LIKED_POSTED_PUZZLEs} from './config'


let getLikedPuzzles = async(user) => {
    if (user == null){
        return null 
    }
    response = await api.get(GET_LIKED_PUZZLES, {params:{username:user}})

    if (response.status <= 300){
        return response.data
    }else{
        
        return null 
    }
}

let getLikedPostedPuzzles = async(user) => {
    if (user == null){
        return null 
    }
    response = await api.get(GET_LIKED_POSTED_PUZZLEs, {params:{username:user}})

    if (response.status <= 300){
        return response.data
    }else{
        
        return null 
    }
}

let get_posted_puzzles = async(user) => {
    if (user == null){
        return null 
    }
    response = await api.get(GET_POSTED_PUZZLES, {params:{username:user}})

    if (response.status <= 300){
        return response.data
    }else{
        
        return null 
    }
}

let get_unused_grammar = async(cats, user=null) => {

    response = await api.post(GET_UNUSED_GRAMMARS, {cats:cats, username:user})

    return response.data 
}

let  getSampleCategories = async(user = null) => {

    if (user == null){
        response = await api.get(SAMPLE_CAT_URL)
    }else{
        response = await api.get(SAMPLE_CAT_URL, {params:{user:user}})
    }

    return response.data 
}


let  getScenarios = async(user = null, getSample = true) => {

    if (user == null){
        response = await api.get(GET_SCEN, {params:{getSample: getSample}})
    }else{
        response = await api.get(GET_SCEN, {params:{user:user, getSample: getSample}})
    }

    return response.data 
}


let get_is_template = async(cat1, cat2, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, type:"is"}
    response = await api.post(GET_TEMPLATE, request)
    return response.data 
}

let get_not_template = async(cat1, cat2, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, type:"not"}
    response = await api.post(GET_TEMPLATE, request)
    return response.data 
}

let get_or_template = async(cat1, cat2, is_cat, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "is_cat": is_cat, type:"or"}
    response = await api.post(GET_TEMPLATE, request)
    return response.data 
}

let get_before_template = async(cat1, cat2, num_cat, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "num_cat": num_cat, type:"before"}
    response = await api.post(GET_TEMPLATE, request)
    return response.data 
}


let get_is_brainstorm = async(cat1, cat2, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, type:"is"}
    response = await api.post(GET_BRAINSTORMS, request)
    return response.data 
}

let get_not_brainstorm= async(cat1, cat2, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, type:"not"}
    response = await api.post(GET_BRAINSTORMS, request)
    return response.data 
}

let get_or_brainstorm = async(cat1, cat2, is_cat, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "is_cat": is_cat, type:"or"}
    response = await api.post(GET_BRAINSTORMS, request)
    console.log(response)
    return response.data 
}

let get_before_brainstorm = async(cat1, cat2, num_cat, user)  => {
    request = {"user": user, "cat1": cat1, "cat2": cat2, "num_cat": num_cat, type:"before"}
    response = await api.post(GET_BRAINSTORMS, request)
    return response.data 
}



export {getSampleCategories, getLikedPuzzles, get_unused_grammar, get_is_template, get_not_template, get_before_template, get_or_template, get_before_brainstorm, get_is_brainstorm, get_not_brainstorm,get_or_brainstorm, getScenarios, get_posted_puzzles, getLikedPostedPuzzles}