import axios from "axios";
//import.meta.env.BASE_URL;
import { loadEnv } from "vite";
const url = import.meta.env.BASEURL;

const api = axios.create({
    baseURL: url,
    withCredentials: true,
});

export const EquipamentService = {
 async getEquiment(){}
};