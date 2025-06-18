import _axios from "axios";
import { useState } from "react";
const API_URL = 'http://127.0.0.1:3000' 
//const API_URL = 'https://christie.khoury.northeastern.edu' 
const GET_PROMPT = API_URL + "/get_reflective_prompt"
const handleRes = (res) => {
    return res;
};

const handleErr = (err) => {
    console.log(err);
    return err;
};

const api = _axios.create( {credentials: false});
api.interceptors.request.use(handleRes, handleErr);
api.interceptors.response.use(handleRes, handleErr);


let getPrompt = async(puzzleDesc, hints, currGrid) => {
    response = await api.post(GET_PROMPT, {puzzle: puzzleDesc, hints:hints, currGrid: currGrid})

    if (response.status <= 300){
        return response.data
    }else{
        
        return null 
    }
}

export{getPrompt}