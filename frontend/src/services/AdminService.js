import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/admins";

function getAllAdmins(token)
{
    return axios.get(`${baseURL}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

function getAdminById(id, token){
    return axios.get(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function updateAdmin(id, token, body)
{
    return axios.put(`${baseURL}/${id}`, body, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function deleteAdmin(id, token){
    return axios.delete(`${baseURL}/${id}` , {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function addAdmin(token, body)
{
    return axios.post(baseURL, body, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

const AdminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    addAdmin
}

export default AdminService;