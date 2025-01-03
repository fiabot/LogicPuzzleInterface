import {api, EVOLVE_URL} from './config' 


let postEvolution = async(categories, gens = 100, popsize = 50) => {
    console.log(categories)
    request = {"puzzle": {"categories": categories}, "gens":gens, "pop_size": popsize}

    response = await api.post(EVOLVE_URL, request)

    return response.data 
}



export {postEvolution}