import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/token";

function checkRole(userToken) {
    const body = {
        accessToken: userToken
    }
    return axios.post(`${baseURL}`, body);
}

const TokenService = {
    checkRole
}

export default TokenService;