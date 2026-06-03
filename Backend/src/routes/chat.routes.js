import { Router } from "express"
import { deleteChat, getChats, getMessages, sendMessage } from "../controllers/chat.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const chatRouter = Router()

chatRouter.post("/message", authMiddleware, sendMessage)
chatRouter.get("/", authMiddleware, getChats)
chatRouter.get("/:chatId/messages", authMiddleware, getMessages)
chatRouter.delete("/delete/:chatId", authMiddleware, deleteChat)


export default chatRouter