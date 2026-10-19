import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/register";

function registerUser(formData) {
  return axios.post(baseURL, formData);
}

const RegisterService = {
    registerUser
}

export default RegisterService;