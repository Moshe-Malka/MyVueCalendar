import axios from "axios"

export default {
  async getEvents() {
    let res = await axios.get("http://localhost:5000");
    // console.log(res)
    return res.data.data;
  }
}