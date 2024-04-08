import axios from "axios";
import httpClient from "../httpClient";
import CookieFactory from "../../utils/cookieFactory";
const baseUrl = "http://localhost:3000/";

const factory = new CookieFactory();

export default class AxiosAdapter implements httpClient {
    private async getHeaders() {
      const response = await factory.getCookie("user");

      if (response && response.token) {
        return {
          "Content-Type": "application/json",
          authorization: response.token ? `Bearer ${response.token}` : null,
        };
      }
      else {
        return {
          "Content-Type": "application/json",
        };
      }
    }
    async get(url: string){
    return await axios.get(`${baseUrl}${url}`, {
          headers: await this.getHeaders(),
      })
      .then(response => ({ data: response.data, status: response.status }))
      .catch(response => ({ data: response.response.data, status: response.response.status }));
    }

    async post(url: string, request: object) {
        return await axios.post(`${baseUrl}${url}`, request, {
          headers: await this.getHeaders(),
        })
        .then(response => ({ data: response.data, status: response.status }))
        .catch(response => ({ data: response.response.data, status: response.response.status }));
      }
      

    async patch(url: string, request: object){
      return await axios.patch(`${baseUrl}${url}`, request, {
        headers: await this.getHeaders(),

      })
      .then(response => ({ data: response.data, status: response.status }))
      .catch(response => ({ data: response.response.data, status: response.response.status }));
    }

    async delete(url: string){
      const { data } = await axios.delete(`${baseUrl}${url}`, {
        headers: await this.getHeaders(),
      });
      return data;
    }
}
