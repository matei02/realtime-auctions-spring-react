import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/auctions";

function createAuction(body, token)
{
    return axios.post(baseURL, body, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
}

function getAuctionByPaintingId(id, token)
{
    return axios.get(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function endAuction(id, token)
{
    return axios.put(`${baseURL}/end/${id}`, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function uploadBid(id, body, token)
{
    return axios.put(`${baseURL}/${id}`, body, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

function deleteAuction(id, token)
{
    return axios.delete(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

const AuctionService = {
    createAuction,
    getAuctionByPaintingId,
    endAuction,
    uploadBid,
    deleteAuction
}

export default AuctionService;