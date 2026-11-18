import _axios from "axios";
import { useState } from "react";
//const API_URL = 'http://127.0.0.1:3000' 
const API_URL = 'https://christie.khoury.northeastern.edu/tactics' 

const ADD_SUBJECT = API_URL + "/add_subject"
const ADD_TUTORIAL = API_URL + "/add_tutorial"
const ADD_GAME_PLAY_INSTANCE = API_URL + "/add_game_play_instance"
const ADD_SURVEY = API_URL + "/add_survey"
const ADD_EVENT = API_URL + "/add_event"


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

export { API_URL, api, ADD_SUBJECT, ADD_TUTORIAL, ADD_GAME_PLAY_INSTANCE, ADD_SURVEY, ADD_EVENT};
