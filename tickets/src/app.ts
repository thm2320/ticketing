import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@thmtickets/common";

const app = express();
app.set("trust proxy", true); //tell express to trust the proxy from ingress-nginx
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
  })
);

//all will make it available to all http methods
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

//express will determine if it is error handler by the number of parameters
app.use(errorHandler);

export { app };
