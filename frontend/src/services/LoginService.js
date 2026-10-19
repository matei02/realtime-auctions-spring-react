import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/login";

function Login(body)
{
    return axios.post(`${baseURL}`, body);
}

const LoginService = {
    Login
}

export default LoginService;