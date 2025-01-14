import {api, API_URL, SAMPLE_CAT_URL, GET_LIKED_PUZZLES} from './config'


let getLikedPuzzles = async(user) => {
    if (user == null){
        return null 
    }
    response = await api.get(GET_LIKED_PUZZLES, {params:{username:user}})
    console.log("response")
    console.log(response.status)
    if (response.status <= 300){
        return response.data
    }else{
        
        return null 
    }

    
}

let  getSampleCategories = async() => {

    response = await api.get(SAMPLE_CAT_URL)

    return response.data 
}



export {getSampleCategories, getLikedPuzzles}