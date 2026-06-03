
import axios from "axios";

export const BASE_URL = "https://careerlink-1-3bbo.onrender.com";
export const clientserver = axios.create({
    baseURL: BASE_URL,
});

export const mediaUrl = (path) => {
    if (!path) return "";
    try {
        if (typeof path === "string" && path.startsWith("http")) return path;
    } catch (e) {
        return "";
    }
    return `${BASE_URL}/${path}`;
};

