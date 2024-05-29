import axios from 'axios';

export const nextClient = axios.create({
   baseURL: '/api',
});

export const backendClient = axios.create({
    baseURL: process.env.BASE_URL
});