import axios from "axios";

const backRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});

export default backRequest;