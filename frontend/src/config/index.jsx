
import axios from "axios";

export const BASE_URL="https://careerlink-1-3bbo.onrender.com";
export const clientserver=axios.create({
    baseURL:BASE_URL 
})

