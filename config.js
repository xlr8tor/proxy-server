import Joi from "joi";
import path from "path";
import dotenv from "dotenv";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();

const config = {
  client_id: process.env.CLIENT_ID,
  redirect_uri: process.env.REDIRECT_URI,
  client_secret: process.env.CLIENT_SECRET,
  proxy_url: process.env.PROXY_URL,
};

const schema = Joi.object({
  client_id: Joi.string().required(),
  redirect_uri: Joi.string().required(),
  client_secret: Joi.string().required(),
  proxy_url: Joi.string().required(),
});

const { error } = schema.validate(config);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default config;
