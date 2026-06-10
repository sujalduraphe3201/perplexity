
import { useState } from "react"
import { Link, useNavigate, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import useAuth from "../hooks/useAuth"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { user, loading } = useSelector(state => state.auth)
  const { handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRegister({ username, email, password })
    navigate("/")
  }

  if (!loading && user) {
    return <Navigate to={"/"} replace />
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#171615", color: "#E8E4DC" }}
    >
      <div
        className="w-full max-w-md p-8 shadow-2xl"
        style={{
          backgroundColor: "#1F1D1B",
          border: "1px solid #2E2B28",
          borderRadius: "12px",
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <p
            className="text-xs uppercase tracking-[0.35em]"
            style={{ color: "#20B2A8" }}
          >
            Perplexity
          </p>
          <h1 className="mt-3 text-2xl font-semibold" style={{ color: "#E8E4DC" }}>
            Create your account
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#76716A" }}>
            Register with your username, email and password.
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#76716A" }}>
              Username
            </span>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 outline-none transition-all duration-150"
              style={{
                backgroundColor: "#252220",
                color: "#E8E4DC",
                border: "1px solid #2E2B28",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              onFocus={e => (e.target.style.borderColor = "#20B2A8")}
              onBlur={e => (e.target.style.borderColor = "#2E2B28")}
              placeholder="Choose a username"
            />
          </label>

          {/* Email */}
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#76716A" }}>
              Email
            </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 outline-none transition-all duration-150"
              style={{
                backgroundColor: "#252220",
                color: "#E8E4DC",
                border: "1px solid #2E2B28",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              onFocus={e => (e.target.style.borderColor = "#20B2A8")}
              onBlur={e => (e.target.style.borderColor = "#2E2B28")}
              placeholder="you@example.com"
            />
          </label>

          {/* Password */}
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#76716A" }}>
              Password
            </span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 outline-none transition-all duration-150"
              style={{
                backgroundColor: "#252220",
                color: "#E8E4DC",
                border: "1px solid #2E2B28",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              onFocus={e => (e.target.style.borderColor = "#20B2A8")}
              onBlur={e => (e.target.style.borderColor = "#2E2B28")}
              placeholder="Create a password"
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-sm font-semibold transition-all duration-150"
            style={{
              backgroundColor: loading ? "#2E2B28" : "#20B2A8",
              color: loading ? "#5C5650" : "#171615",
              borderRadius: "8px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = "#1ea39a" }}
            onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = "#20B2A8" }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "#76716A" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold"
            style={{ color: "#20B2A8", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register