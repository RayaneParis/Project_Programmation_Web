import React, { useState} from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { registerApi } from '../api/authApi';
import '../styles/Login.css';

const Register = () => {
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [birthDate, setBirthDate] = useState('');
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

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }
        
        try {
            const { token, user } = await registerApi(email, password, name, firstName, birthDate);
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
                    <h1>Join<br /><span>Evenhub</span></h1>
                    <p>Create your account and get started </p>
                </div>
            </div>
            <div className="login-right">
                <div className="login-form-container">
                    <h2>Register</h2>
                    <p className="login-subtitle">Create your account free !</p>
                    {error && <div className="login-error">{error}</div>}
                    <form onSubmit={onSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="name">Surname</label>
                            <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name..."
                            required
                            autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Your First Name..."
                            required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate">Birth Date</label>
                            <input
                            id="birthDate"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email..."
                            required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            required
                            />
                        </div>
                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? <span className="btn-spinner" /> : 'Create my account'}
                        </button>
                    </form>
                    <p className="login-register">Already have an account ? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;