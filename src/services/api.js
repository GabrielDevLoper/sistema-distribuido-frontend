import axios from 'axios';

const api = axios.create({
    baseURL: "https://sistema-distribuidos-backend.herokuapp.com"
});

export default api;

