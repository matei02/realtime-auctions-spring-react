import axios from "axios";
import baseUrl from "../services/BaseUrl"

const baseURL = baseUrl + "/paintings";

function fetchPaintings() {
  return axios.get(baseURL);
}

function getPaintingById(id, token) {
  return axios.get(`${baseURL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

function deletePainting(id, token) {
  return axios.delete(`${baseURL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

function addPainting(token, body) {
  return axios.post(baseURL, body, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

function updatePainting(id, token, body) {
  return axios.put(`${baseURL}/${id}`, body, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

const ArtService = {
  fetchPaintings,
  getPaintingById,
  deletePainting,
  addPainting,
  updatePainting
};

export default ArtService;
