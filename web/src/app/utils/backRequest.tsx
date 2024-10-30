import axios from "axios";

const backRequest = axios.create({
  baseURL: "http://localhost:8090/api/",
  withCredentials: true,
});

export default backRequest;