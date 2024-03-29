import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    //we are on the server
    //requests should be made to http://{ingress-service}.{namespace}.xxxx
    return axios.create({
      baseURL: process.env.K8S_BASE_URL,
      headers: req.headers
    });
  } else {
    //we are on the browser
    //requests should be made with a base url of ''
    return axios.create({
      baseURL: "/"
    });
  }
};

export default buildClient;
