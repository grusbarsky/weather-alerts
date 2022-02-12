import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";


class WeatherAlertApi {
  // jwt token for api calls
  static token;

  static async request(endpoint, data = {}, method = "get") {

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${WeatherAlertApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }


  static async login(data) {
    let res = await this.request(`auth/login`, data, "post");
    return res.token;
  }


  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  static async saveSettings(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  static async getAlerts() {
    let res = await this.request("alerts");
    return res;
  }

  static async saveLocation(username, data) {
    let res = await this.request(`users/${username}/save-location`, data, "post");
    return res;
  }
  
  static async deleteLocation(username, id) {
    await this.request(`users/${username}/delete-location/${id}`, {}, "delete");
  }

  static async getLocations(location){
    let res = await this.request("users/locations/search", {location});
    return res;
  }

  static async getAllArticles() {
    let res = await this.request("news");
    return res.articles;
  }

  static async getSearchedArticles(keyword) {
    let res = await this.request("news/search", { keyword });
    return res.articles;
  }

  static async saveArticle(username, data) {
    await this.request(`news/${username}/save-article`, data, "post");
  }
  
  static async deleteArticle(username, id) {
    await this.request(`news/${username}/delete-article/${id}`, {}, "delete");
  }

  static async sendArticle(data){
    await this.request(`news/send-article`, data, "post");
  }

}


export default WeatherAlertApi;
