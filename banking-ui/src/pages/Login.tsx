import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const SESSION_DURATION_MS = 5 * 60 * 1000;      // 5 minutes

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const createSession = (role) => {
        const expiryTime = new Date().getTime() + SESSION_DURATION_MS;
        const sessionData = {
            role: role,
            expiry: expiryTime,
        };
        localStorage.setItem('bankingUserSession', JSON.stringify(sessionData));
        return role;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        let targetRoute = null;

        if (username === "cust1" && password === "pass") {
            const role = createSession("CUSTOMER");
            targetRoute = `/${role.toLowerCase()}`;
        } else if (username === "admin" && password === "admin") {
            const role = createSession("ADMIN");
            targetRoute = `/${role.toLowerCase()}`;
        }

        if (targetRoute) {
            navigate(targetRoute);
        } else {
            alert("Invalid Credentials! Try cust1/pass or admin/admin.");
        }
    };

    return (
        <div className="auth-container">
            <form className="login-form-card" onSubmit={handleLogin}>
                <h2 className="form-title">Secure Banking Access</h2>
                <p className="form-subtitle">Enter your credentials to continue</p>

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="form-input"
                        placeholder="e.g., cust1 or admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Sign In
                </button>

                <div className="info-tip">
                    <span>POC Credentials:</span> cust1/pass | admin/admin
                </div>
            </form>
        </div>
    );
}