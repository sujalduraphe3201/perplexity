import { useDispatch } from "react-redux"
import { login, register, getMe } from "../service/auth.api"
import { setUser, setError, setLoading } from "../auth.slice"

function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ username, email, password })
            dispatch(setUser(data.user))
        }
        catch (err) {
            dispatch(setError(err.message || "Registration failed"))
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        }
        catch (err) {
            dispatch(setError(err.message || "Login failed"))
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        }
        catch (err) {
            dispatch(setError(err.message || "Failed to fetch user data"))
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin, handleGetMe }
}

export default useAuth