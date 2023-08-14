// import * as dotenv from "dotenv";
// import { IEnv } from "../types";

// const ROOT = process.cwd();
// let path: string;

// type NodeEnvType = "development" | "testing" | "staging" | "production";

// const processEnvironment = process.env.NODE_ENV as NodeEnvType;

// switch (processEnvironment) {
//   case "production":
//     path = `${ROOT}.env/production.env`;
//     break;
//   case "staging":
//     path = `${ROOT}.env/staging.env`;
//     break;
//   case "testing":
//     path = `${ROOT}.env/testing.env`;
//     break;
//   default:
//     path = `${ROOT}.env/development.env`;
// }

// // Load content from .env file at the path to process.env
// dotenv.config({ path });

// // constructing an object with all the environment variables
// export const env: IEnv = {
//   root: ROOT,
//   env: {
//     name: process.env.NODE_ENV || "development",
//     isDevelopment: processEnvironment === "development",
//     isTesting: processEnvironment === "testing",
//     isStaging: processEnvironment === "staging",
//     isProduction: processEnvironment === "production",
//   },
//   app: {
//     name: process.env.APP_NAME,
//     host: process.env.APP_HOST,
//     url: process.env.APP_URL,
//     port: Number(process.env.PORT),
//     prefix: process.env.APP_PREFIX,
//   },
//   api: {
//     name: process.env.API_NAME,
//     host: process.env.API_HOST,
//     url: process.env.API_URL,
//     port: Number(process.env.API_PORT),
//     prefix: process.env.API_PREFIX,
//   },
//   ws: {
//     url: process.env.WS_URL,
//   },
// };

// export default env;

export default {};
