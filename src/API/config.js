import _axios from "axios";
import { useState } from "react";
const API_URL = 'http://127.0.0.1:3000' 

const EVOLVE_URL = API_URL + "/map_evolve"
const SAMPLE_CAT_URL = API_URL + '/sample_categories'
const ADD_ACCOUNT_URL = API_URL + "/add_account"
const LIKE_PUZZLE = API_URL + "/like_puzzle"
const GET_LIKED_PUZZLES = API_URL + "/get_liked_puzzles"
const ITER_EVOLVE = API_URL + "/iterate_map_evolve"
const GET_UNUSED_GRAMMARS = API_URL + "/get_unused_grammar"
const ADD_GRAMMAR_RULE = API_URL + "/add_grammar_rule"
const ADD_CATEGORY = API_URL + "/add_category"
const GET_TEMPLATE = API_URL +'/get_template' 





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

export { API_URL, EVOLVE_URL, SAMPLE_CAT_URL, ADD_ACCOUNT_URL, LIKE_PUZZLE, GET_LIKED_PUZZLES, ITER_EVOLVE, GET_UNUSED_GRAMMARS, ADD_GRAMMAR_RULE, ADD_CATEGORY, GET_TEMPLATE,  api };

