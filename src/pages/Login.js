import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { loginApi } from '../api/authApi';
import '../styles/Login.css';

const Login = () =>  {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { setToken } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { token, user } = await loginApi(email, password);
            setToken(token, user);
            navigate("/dashboard"); 
        } catch (error) {
            setError(error.message || "incorrect email and password !");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-brand">
                    <span className="login-logo">Hi !</span>
                    <span className="login-brand-name">EventHub</span>
                </div>
                <div className="login-tagline">
                    <h1>Manage your events<br /><span>with motivation.</span></h1>
                    <p>Platform for creating, tracking and analyzing events</p>
                </div>
                <div className="login-stats">
                    <div className="login-stat"><strong>4</strong><span>Events</span></div>
                    <div className="login-stat"><strong>1 222</strong><span>Participants</span></div>
                    <div className="login-stat"><strong>2</strong><span>Cities</span></div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-form-container">
                    <h2>Login</h2>
                    <p className="login-subtitle">Access in your Management area</p>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={onSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email ..."
                            required
                            autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="........"
                            required
                            />
                        </div>
                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? <span className="btn-spinner" /> : 'Log in'}
                        </button>
                    </form>
                    <p className="login-register">
                        No account yet ? <Link to={"/register"}>Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;