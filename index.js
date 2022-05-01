import express from "express";
import cors from "cors";
import { FormData } from "formdata-node";
import fetch from "node-fetch";
import config from "./config.js";
import helmet from "helmet";
import xss from "xss-clean";

const { client_id, redirect_uri, client_secret } = config;
const app = express();

app.set("trust proxy", 1);
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(xss());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Proxy server");
});

app.post("/authenticate", (req, res) => {
  const { code } = req.body;

  const data = new FormData();
  data.set("client_id", client_id);
  data.set("client_secret", client_secret);
  data.set("code", code);
  data.set("redirect_uri", redirect_uri);
  console.log(code, "code");
  let access_token;
  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      console.log(params, "params");
      access_token = params.get("access_token");
      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      let newResponse = { ...response, access_token };
      return res.status(200).json(newResponse);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on Port ${PORT}`);
});
