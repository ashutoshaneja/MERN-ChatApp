import axios from 'axios';
import {
    GET_CHATS,
    AFTER_POST_MESSAGE
} from './types';
import { CHAT_SERVER } from '../components/Config.js';

//Get Request to fetch chat messages from API
export function getChats(){
    const request = axios.get(`${CHAT_SERVER}/getChats`)
        .then(response => response.data);
    
    return {
        type: GET_CHATS,
        payload: request
    }
}

//API Request to return latest sent message as payload to render in real time
export function afterPostMessage(data){
   
    return {
        type: AFTER_POST_MESSAGE,
        payload: data
    }
}

