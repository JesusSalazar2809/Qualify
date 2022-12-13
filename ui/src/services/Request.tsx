import axios from "axios";
const apiURL = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_BASE_URL_DEV : process.env.REACT_APP_BASE_URL_PROD;

const methods = {

    post: async (url:string, body:object, file=false) => {
        const config = {
            headers: {
                'Authorization' : "Bearer " + localStorage.access_token,
                "Content-Type": "application/json"
            }
        }
        if(file){
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return axios.post(apiURL + url, body, config)
        .then(handleErrors)
        .then(response => {
            return response.data
        })
    },
    put: async (url:string, body:object, file=false) => {
        const config = {
            headers: {
                'Authorization' : "Bearer " + localStorage.access_token,
                "Content-Type": "application/json"
            }
        }
        if(file){
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return axios.put(apiURL + url, body, config)
        
        .then(handleErrors)
        .then(response => {
            return response.data
        })
    },
    delete: async (url:string) => {
        const config = {
            headers: {
                'Authorization' : "Bearer " + localStorage.access_token,
                "Content-Type": "application/json"
            }
        }
        return axios.delete(apiURL + url, config)
        .then(handleErrors)
        .then(response => {
            return response.data
        })
    },
    get: async (url:string) => {
        const config = {
            headers: {
                'Authorization' : "Bearer " + localStorage.access_token,
                "Content-Type": "application/json"
            }
        }
        return axios.get(apiURL + url, config)
        .then(handleErrors)
        .then(response => {
            return response.data
        })
    },
};

export default methods;

function handleErrors(response:any) {
    if(response.status === 403 ){
        delete localStorage.user;
        delete localStorage.token;
        window.location.href = "/";
    }
    return response;
}