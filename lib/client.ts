import { Client } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.APP_WRITE_PROJECT_ENDPOINTS as string)
  .setProject(process.env.APP_WRITE_PROJECT_ID as string)

export default client;