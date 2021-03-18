import axios from "axios";

const LandingPage = ({ currentUser }) => {
  /* useEffect(() => {
    axios.get("/api/users/currentuser");
  }, []); */
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  console.log(req.headers);
  if (typeof window === "undefined") {
    //we are on the server
    //requests should be made to http://{ingress-service}.{namespace}.xxxx
    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: req.headers
      }
    );
    return data;
  } else {
    //we are on the browser
    //requests should be made with a base url of ''
    const { data } = await axios.get("/api/users/currentuser");
    return data;
  }

  return {};
};

export default LandingPage;
