// provider.js
// get, push, put, delete

import axios, { AxiosPromise } from 'axios';
import { handleResponse, handleError } from './response';
import { Container, Document, ObservationBlock, Semester } from './../typings/papahana'
import { mock_get_containers, mock_get_observation_block_from_controller, mock_get_semesters } from '../mocks/mock_utils';


// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally


var PRODUCTION_URL = 'https://vm-appserver.keck.hawaii.edu/api/ddoi/v0/' //use on server (npm build)
var DEV_URL = 'http://localhost:50000/v0/' //use locally or for testing (npm start)
var BASE_URL = process.env.NODE_ENV==='production'? PRODUCTION_URL : DEV_URL
var OB_URL = BASE_URL + 'obsBlocks?' 
var CONTAINER_URL = BASE_URL + 'containers/items'
var SEMESTERS_URL = BASE_URL + 'semesterIds'

console.log('backend url set to')
console.log(BASE_URL)


const get_semesters = (observer_id: string): Promise<Semester[]> => {
    // 'http://vm-webtools.keck.hawaii.edu:50000/v0/semesterIds/?obs_id=2003'
    const url = `${SEMESTERS_URL}/?obs_id=${observer_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const get_containers = (sem_id: string, observer_id: string): Promise<Container[]> => {
    //  http://vm-webtools.keck.hawaii.edu:50001/v0/semesterIds/2020A_U169/containers?obs_id=2003
    const url = `${SEMESTERS_URL}/${sem_id}/containers?obs_id=${observer_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const get_observation_blocks_from_container = (container_id: string): Promise<ObservationBlock[]> => {
    //  http://vm-webtools.keck.hawaii.edu:50000/v0/containers/items?container_id=60a4477aac7448cc67b63758
    const url = `${CONTAINER_URL}'/?container_id='${container_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
};

const get = (resource: string, api_type: string): Promise<Document> => {
    const url = `${OB_URL}${resource}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const post = (resource: string, api_type: string, model: object): Promise<any> => {
    return axios
        .post(`${OB_URL}${resource}`, model)
        .then(handleResponse)
        .catch(handleError);
};

const put = (resource: string, api_type: string, model: object): Promise<any> => {
    const url = `${OB_URL}${resource}`
    console.log(`put url ${url}`)
    console.log(`model ${model}`)
    console.log(model)
    return axios
        .put(url, model)
        .then(handleResponse)
        .catch(handleError);
};

const remove = (resource: string, api_type: string ): Promise<any> => {
    return axios
        .delete(`${OB_URL}${resource}`)
        .then(handleResponse)
        .catch(handleError);
};


export const get_select_funcs = {
    get_semesters: process.env.NODE_ENV === 'production'? get_semesters : mock_get_semesters,
    get_containers: process.env.NODE_ENV === 'production'? get_containers : mock_get_containers,
    get_observation_blocks_from_container: process.env.NODE_ENV === 'production'? get_observation_blocks_from_container : mock_get_observation_block_from_controller
}

export const api_funcs = {
    get,
    post,
    put,
    remove,
};
