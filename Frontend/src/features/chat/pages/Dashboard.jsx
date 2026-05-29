import { useSelector } from 'react-redux'

const Dashboard = () => {
    const { user } = useSelector(state => state.auth)
    console.log(user)

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
            {user ? (
                <p>Welcome back, {user.username || user.email}!</p>
            ) : (
                <p>Please sign in to access your dashboard.</p>
            )}
        </div>
    )
}

export default Dashboard