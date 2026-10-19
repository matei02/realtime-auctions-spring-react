import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/customers";

async function getCustomerById(id, token) {
    return axios.get(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

function updateCustomer(id, token, body) {
    return axios.put(`${baseURL}/${id}`, body, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        // withCredentials: true
    })
}

function getAllCustomers(token)
{
    return axios.get(baseURL, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
}

function deleteCustomer(id, token)
{
    return axios.delete(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function addCustomer(token, body){
    return axios.post(baseURL, body, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

const CustomerService = {
    getCustomerById,
    updateCustomer,
    getAllCustomers,
    deleteCustomer,
    addCustomer
}

export default CustomerService;