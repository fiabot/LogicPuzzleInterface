import _axios from "axios";
import { useState } from "react";
//const API_URL = 'http://127.0.0.1:3000' 
const API_URL = 'https://christie.khoury.northeastern.edu' 

const EVOLVE_URL = API_URL + "/map_evolve"
const SAMPLE_CAT_URL = API_URL + '/sample_categories'
const ADD_ACCOUNT_URL = API_URL + "/add_account"
const LIKE_PUZZLE = API_URL + "/like_puzzle"
const REMOVE_PUZZLE = API_URL + "/remove_puzzle"
const UPDATE_PUZZLE = API_URL + "/update_puzzle"
const GET_LIKED_PUZZLES = API_URL + "/get_liked_puzzles"
const ITER_EVOLVE = API_URL + "/iterate_map_evolve"
const GET_UNUSED_GRAMMARS = API_URL + "/get_unused_grammar"
const ADD_GRAMMAR_RULE = API_URL + "/add_grammar_rule"
const ADD_CATEGORY = API_URL + "/add_category"
const ADD_SCEN = API_URL + "/add_scenario"
const UPDATE_SCEN = API_URL + "/update_scenario"
const DELETE_SCEN = API_URL + "/delete_scenario"
const GET_SCEN = API_URL + "/get_scenarios"
const GET_TEMPLATE = API_URL +'/get_template' 

const GET_BRAINSTORMS = API_URL +'/get_brainstorm' 

const ADD_BRAINSTORM = API_URL +'/add_brainstorm' 

const GET_PUBLIC_KEY = API_URL  + "/get_public_key"
const NEW_SESSION = API_URL + "/new_session"
const ADD_CLICK = API_URL + "/add_click"

const GET_POSTED_PUZZLES = API_URL + "/get_posted_puzzles"
const POST_PUZZLE = API_URL + "/post_puzzle"
const ADD_COMMENT = API_URL + "/add_comment"
const GET_LIKED_POSTED_PUZZLEs = API_URL + "/get_liked_posted_puzzles"
const LIKE_POSTED_PUZZLE = API_URL + "/like_posted_puzzle"
const UNLIKED_POSTED_PUZZLE = API_URL + "/unlike_posted_puzzle"
const VIEW_PUZZLE = API_URL + "/view_puzzle"
const ADD_SURVEY = API_URL + "/add_survey"
const NUM_SURVEYS = API_URL + "/get_num_surveys"
const REMOVE_POST = API_URL + "/delete_post"
const REMOVE_COMMENT = API_URL + "/delete_comment"
const GET_USER_DATA = API_URL + "/get_user_data"


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

export { API_URL, GET_USER_DATA,  EVOLVE_URL, REMOVE_PUZZLE, UPDATE_PUZZLE, SAMPLE_CAT_URL, ADD_ACCOUNT_URL, LIKE_PUZZLE, GET_LIKED_PUZZLES, ITER_EVOLVE, GET_UNUSED_GRAMMARS, ADD_GRAMMAR_RULE, ADD_CATEGORY, GET_TEMPLATE, GET_PUBLIC_KEY, api, GET_BRAINSTORMS, ADD_BRAINSTORM, GET_SCEN, ADD_SCEN, UPDATE_SCEN, DELETE_SCEN, NEW_SESSION, ADD_CLICK, GET_POSTED_PUZZLES, POST_PUZZLE, ADD_COMMENT, LIKE_POSTED_PUZZLE, GET_LIKED_POSTED_PUZZLEs, UNLIKED_POSTED_PUZZLE, VIEW_PUZZLE, ADD_SURVEY, NUM_SURVEYS, REMOVE_COMMENT, REMOVE_POST};
