import _axios from "axios";
const API_URL = 'http://127.0.0.1:3000' 

const EVOLVE_URL = API_URL + "/map_evolve"
const SAMPLE_CAT_URL = API_URL + '/sample_categories'



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

export { API_URL, EVOLVE_URL, SAMPLE_CAT_URL,  api };

