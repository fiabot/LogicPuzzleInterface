import _axios from "axios";
import { useState } from "react";
const API_URL = 'http://127.0.0.1:3000' 

const EVOLVE_URL = API_URL + "/map_evolve"
const SAMPLE_CAT_URL = API_URL + '/sample_categories'
const ADD_ACCOUNT_URL = API_URL + "/add_account"
const LIKE_PUZZLE = API_URL + "/like_puzzle"
const GET_LIKED_PUZZLES = API_URL + "/get_liked_puzzles"




const handleRes = (res) => {
    return res;
};

const handleErr = (err) => {
    console.log(err);
    return err;
};

const api = _axios.create({ withCredentials: false });
api.interceptors.request.use(handleRes, handleErr);
api.interceptors.response.use(handleRes, handleErr);

export { API_URL, EVOLVE_URL, SAMPLE_CAT_URL, ADD_ACCOUNT_URL, LIKE_PUZZLE, GET_LIKED_PUZZLES, api };

