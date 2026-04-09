import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../store/AuthContext';
import RoleGuard from "./RoleGuard";
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">Hi!</span>
                <span className="navbar-title">EventHub</span>
            </div>

            <div className="navbar-links">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Dashboard </NavLink>
                <NavLink to="/events" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Events </NavLink>
                <RoleGuard allowedRoles={['admin']}>
                    <NavLink to="/participants" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Participants </NavLink>
                </RoleGuard>
            </div>

            <div className="navbar-user">
                <span className="navbar-username">{user?.first_name || user?.email || 'User'} </span>
                <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;