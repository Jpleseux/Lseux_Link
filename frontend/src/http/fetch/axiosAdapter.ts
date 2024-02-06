import axios from "axios";
import httpClient from "../httpClient";
const baseUrl = "http://localhost:3000/";
export default class AxiosAdapter implements httpClient {
    async get(url: string){
      const { data } = await axios.get(`${baseUrl}${url}`, {
          headers: {
              "Content-Type": "application/json"
          }
      });
      return data;
    }

    async post(url: string, request: object) {
        return axios.post(`${baseUrl}${url}`, request, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => ({ data: response.data, status: response.status }))
        .catch(response => ({ data: response.response.data, status: response.response.status }));
      }
      

    async patch(url: string, request: object){
      const { data } = await axios.patch(`${baseUrl}${url}`, request, {
          headers: {
              "Content-Type": "application/json"
          }
      });
      return data;
    }

    async delete(url: string){
      const { data } = await axios.delete(`${baseUrl}${url}`, {
          headers: {
              "Content-Type": "application/json"
          }
      });
      return data;
    }
}
