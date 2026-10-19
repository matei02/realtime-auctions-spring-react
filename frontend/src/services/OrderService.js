import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/orders";

function createOrder(body, token)
{
    return axios.post(baseURL, body, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function deleteOrder(id, token)
{
    return axios.delete(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function getAllOrders(token)
{
    return axios.get(baseURL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

function getOrderById(id, token)
{
    return axios.get(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function changeOrderStatus(id, body, token)
{
    return axios.put(`${baseURL}/${id}`, body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
}

function getTopSpenders(token)
{
    return axios.get(`${baseURL}/gettopspenders`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
}

const OrderService = {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
    changeOrderStatus,
    getTopSpenders
}

export default OrderService;