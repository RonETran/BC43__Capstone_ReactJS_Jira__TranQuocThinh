import axios from "axios";
import { history } from "../index";

export const DOMAIN = 'https://jiranew.cybersoft.edu.vn';
export const TOKEN = 'accessToken';
export const USER_LOGIN = 'userLogin';
export const TOKEN_CYBERSOFT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA0MyIsIkhldEhhblN0cmluZyI6IjA0LzExLzIwMjMiLCJIZXRIYW5UaW1lIjoiMTY5OTA1NjAwMDAwMCIsIm5iZiI6MTY2OTQ4MjAwMCwiZXhwIjoxNjk5MjAzNjAwfQ.7A1g8RqPPK_ttr9NYitsWT7Cbe11nz4qye-QxZ_b8fk`;

export const {getStoreJson,setStoreJson,getStore,setStore,clearStorage} = {
    getStoreJson: (name:string): any => {
        if(localStorage.getItem(name)) {
            const strResult:string | null | any = localStorage.getItem(name);
            return JSON.parse(strResult);
        }
        return undefined;
    },
    setStoreJson: (name:string,data:any):void => {
        const strJSON = JSON.stringify(data);
        localStorage.setItem(name,strJSON);
    },
    getStore: (name:string): string | null => {
        return localStorage.getItem(name);
    },
    setStore: (name:string,data:string): void => {
        localStorage.setItem(name,data);
    },
    clearStorage: (name:string): void => {
        localStorage.removeItem(name)
    }
}

export const http = axios.create({
    baseURL:DOMAIN,
    timeout:30000
});
export const httpAuth = axios.create({
    baseURL:DOMAIN,
    timeout:30000
})

http.interceptors.request.use((config:any)=>{
    config.baseURL = DOMAIN;
    config.headers={...config.headers};
    config.headers.tokenCybersoft = `TOKEN_CYBERSOFT`;
    return config
},err => {
    return Promise.reject(err);
});

httpAuth.interceptors.request.use((config:any)=>{
    config.headers={...config.headers};
    let token = getStoreJson(USER_LOGIN)?.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.tokenCybersoft = `TOKEN_CYBERSOFT`;
    return config
},err => {
    return Promise.reject(err);
})

http.interceptors.response.use((res)=>{ 
    return res;
},(err)=> {
    console.log(err);
    if(err.response?.status === 401) {
        alert('Đăng nhập để vào trang này !');
        history.push('/login');
    }
    return Promise.reject(err);
});