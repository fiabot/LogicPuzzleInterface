import {api, EVOLVE_URL, ADD_ACCOUNT_URL, LIKE_PUZZLE, ITER_EVOLVE} from './config' 


let postEvolution = async(categories, gens = 100, popsize = 50) => {
    request = {"puzzle": {"categories": categories}, "gens":gens, "pop_size": popsize}

    response = await api.post(EVOLVE_URL, request)

    return response.data 
}


let startIterEvolve = async(categories, user,  gens = 40, popsize = 50) => {
    request = {"puzzle": {"categories": categories}, "gens":gens, "pop_size": popsize, "user": user}

    response = await api.post(ITER_EVOLVE, request)

    return response.data 
}

let continueIterEvolve = async(id, user, gens = 40, popsize = 50) => {
    request = {"id": id, "gens":gens, "pop_size": popsize, "user": user}

    response = await api.post(ITER_EVOLVE, request)

    return response.data 
}



let add_account = async(username, setUser) => {
    request= {"username": username }
    response = await api.post(ADD_ACCOUNT_URL, request)

    if (response.status < 300){
        setUser(username)
        
    }

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



export {postEvolution, add_account, like_puzzle, startIterEvolve, continueIterEvolve}