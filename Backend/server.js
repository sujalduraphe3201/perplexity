import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
import http from "http"



const PORT = process.env.PORT || 3000;
connectDB();

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
