import axios from 'axios'

export const getNoteApi = () => {
    return axios.get(`http://localhost:8888/api/notelist`)
}

export const addNoteApi = (data) => {
    return axios.post(`http://localhost:8888/api/notelist`, data)
}

export const deleteNoteApi = (id) => {
    return axios.delete(`http://localhost:8888/api/notelist/${id}`)
}

export const editNoteApi = (id, data) => {
    return axios.put(`http://localhost:8888/api/notelist/${id}`, data)
}