import { config } from "dotenv";
config();

import app from ".";

const port: Number = Number(process.env.PORT) || 8888;

app.listen(port, () => {
    console.log("Server http://localhost:" + port);
});