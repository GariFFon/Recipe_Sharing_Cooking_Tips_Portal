import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <header className="hero-simple">
                <div className="container">
                    <p className="hero-sub">WELCOME TO THE EVERY KITCHEN</p>
                    <h1 className="hero-title">Simple Recipes Made <br /> <em>for</em> Real Life</h1>
                    <p className="hero-description">
                        Discover delicious recipes, share your culinary creations, and connect with food lovers around the world.
                    </p>
                    <div className="hero-cta">
                        <Link to="/recipes" className="btn-primary">Browse Recipes</Link>
                        <Link to="/add" className="btn-secondary">Share Your Recipe</Link>
                    </div>
                </div>
            </header>

            <section className="features-section container">
                <div className="section-header">
                    <h2 className="section-title">What We Offer</h2>
                    <div className="section-divider"></div>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🍳</div>
                        <h3>Easy Recipes</h3>
                        <p>Step-by-step instructions for delicious home-cooked meals</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👨‍🍳</div>
                        <h3>Community Driven</h3>
                        <p>Share your recipes and discover favorites from other food enthusiasts</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🥗</div>
                        <h3>Dietary Options</h3>
                        <p>Filter recipes by vegetarian, non-vegetarian, and more</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
