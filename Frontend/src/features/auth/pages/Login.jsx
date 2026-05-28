
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      email,
      password
    }
    await handleLogin(payload)
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: "var(--bg)", color: "var(--primary)" }}>
      <div className="w-full max-w-md rounded-4xl p-8 shadow-2xl backdrop-blur-xl" style={{ backgroundColor: "var(--surface)", border: `1px solid var(--border)`, color: "var(--primary)" }}>
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em]" style={{ color: 'var(--muted)' }}>Perplexity</p>
          <h1 className="mt-4 text-3xl font-semibold">Sign in to your account</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Enter your email and password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl px-4 py-3 outline-none transition"
              style={{ backgroundColor: 'transparent', color: 'var(--primary)', border: `1px solid var(--border)` }}
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl px-4 py-3 outline-none transition"
              style={{ backgroundColor: 'transparent', color: 'var(--primary)', border: `1px solid var(--border)` }}
              placeholder="Enter your password"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition"
            style={{ backgroundColor: 'var(--btn)', color: '#fff' }}
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
          New to Perplexity?{' '}
          <Link to="/register" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login