import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", { email, password })
        return response.data
    }
    catch (error) {
        const message = error.response?.data?.message || error.message || "Login failed"
        throw new Error(message, { cause: error })
    }
}


export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", { username, email, password })
        return response.data

    }
    catch (error) {
        console.error("Register failed:", error)
        throw error
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    }
    catch (error) {
        console.error("Get me failed:", error)
        throw error
    }
}