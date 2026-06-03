import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors"
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(morgan("dev"))

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

export default app;