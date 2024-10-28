import axios from "axios";

const backRequest = axios.create({
  baseURL: "http://localhost:8080/api/",
  withCredentials: true,
});

export default backRequest;