import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <div className="navbar-top">
                    <div className="social-placeholder"></div>
                    <Link to="/" className="logo">
                        The Every Kitchen
                    </Link>
                    <div className="nav-actions">
                        <Link to="/add" className="btn-text">SUBMIT RECIPE</Link>
                    </div>
                </div>
                <div className="navbar-bottom">
                    <Link to="/" className="nav-link">HOME</Link>
                    <Link to="/" className="nav-link">RECIPES</Link>
                    <Link to="/coming-soon" className="nav-link">LIFESTYLE</Link>
                    <Link to="/coming-soon" className="nav-link">SHOP</Link>
                    <Link to="/about" className="nav-link">ABOUT</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
