import {api, API_URL, SAMPLE_CAT_URL} from './config'



let  getSampleCategories = async() => {

    response = await api.get(SAMPLE_CAT_URL)

    return response.data 
}



export {getSampleCategories}