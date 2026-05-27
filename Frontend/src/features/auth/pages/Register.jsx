
import { useState } from "react"
import { Link } from "react-router-dom"

const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("Register form submitted", { username, email, password })
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: "var(--bg)", color: "var(--primary)" }}>
            <div className="w-full max-w-md rounded-4xl p-8 shadow-2xl backdrop-blur-xl" style={{ backgroundColor: "var(--surface)", border: `1px solid var(--border)`, color: "var(--primary)" }}>
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-[0.35em]" style={{ color: 'var(--muted)' }}>Perplexity</p>
                    <h1 className="mt-4 text-3xl font-semibold">Create your account</h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Register with your username, email, and password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="block">
                        <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Username</span>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-2 w-full rounded-2xl px-4 py-3 outline-none transition"
                            style={{ backgroundColor: 'transparent', color: 'var(--primary)', border: `1px solid var(--border)` }}
                            placeholder="Choose a username"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Email</span>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
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
                            placeholder="Create a password"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition"
                        style={{ backgroundColor: 'var(--btn)', color: '#fff' }}
                    >
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register