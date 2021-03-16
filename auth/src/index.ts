import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//all will make it available to all http methods
app.all("*", () => {
  throw new NotFoundError();
});

//express will determine if it is error handler by the number of parameters
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!");
});
