import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [recipes, setRecipes] = useState([]);
    const [isPaused, setIsPaused] = useState(false);

    // Featured recipes from seed data
    const featuredRecipes = [
        {
            title: "Rustic Roasted Tomato Basil Soup",
            image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
            description: "A comforting, velvety soup made with vine-ripened roasted tomatoes, fresh basil, and a touch of cream.",
            cuisine: "Italian",
            difficulty: "Easy",
            prepTime: "15 mins",
            cookTime: "55 mins"
        },
        {
            title: "Creamy Butter Chicken (Murgh Makhani)",
            image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
            description: "Tender chicken pieces in a rich, creamy tomato gravy with aromatic spices.",
            cuisine: "Indian",
            difficulty: "Medium",
            prepTime: "30 mins",
            cookTime: "40 mins"
        },
        {
            title: "Street-Style Tacos Al Pastor",
            image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
            description: "Pork marinated in dried chilies and pineapple, served on corn tortillas.",
            cuisine: "Mexican",
            difficulty: "Medium",
            prepTime: "20 mins",
            cookTime: "30 mins"
        },
        {
            title: "Thai Green Curry",
            image: "https://munchingwithmariyah.com/wp-content/uploads/2025/03/IMG_4915-1200x1200.jpg",
            description: "A fragrant coconut curry with green chilies, lemongrass, and thai basil.",
            cuisine: "Asian",
            difficulty: "Medium",
            prepTime: "15 mins",
            cookTime: "20 mins"
        },
        {
            title: "Classic Chocolate Chip Cookies",
            image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
            description: "Chewy centers, crispy edges, and loaded with chocolate chunks.",
            cuisine: "American",
            difficulty: "Easy",
            prepTime: "15 mins",
            cookTime: "10 mins"
        }
    ];

    useEffect(() => {
        if (!isPaused) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
            }, 4000); // Auto-advance every 4 seconds

            return () => clearInterval(timer);
        }
    }, [featuredRecipes.length, isPaused, currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + featuredRecipes.length) % featuredRecipes.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

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

            {/* Featured Recipes Carousel */}
            <section className="carousel-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Recipes</h2>
                        <div className="section-divider"></div>
                    </div>

                    <div className="carousel-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
                            ‹
                        </button>

                        <div className="carousel-track">
                            {featuredRecipes.map((recipe, index) => (
                                <div
                                    key={index}
                                    className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                                    style={{
                                        transform: `translateX(${(index - currentSlide) * 100}%)`
                                    }}
                                >
                                    <div className="carousel-content">
                                        <div className="carousel-image">
                                            <img src={recipe.image} alt={recipe.title} />
                                            <div className="carousel-badges">
                                                <span className="badge">{recipe.cuisine}</span>
                                                <span className="badge">{recipe.difficulty}</span>
                                            </div>
                                        </div>
                                        <div className="carousel-info">
                                            <h3>{recipe.title}</h3>
                                            <p className="carousel-description">{recipe.description}</p>
                                            <div className="carousel-meta">
                                                <div className="meta-item">
                                                    <span className="meta-icon">⏱️</span>
                                                    <span>Prep: {recipe.prepTime}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon">🍳</span>
                                                    <span>Cook: {recipe.cookTime}</span>
                                                </div>
                                            </div>
                                            <Link to="/recipes" className="carousel-link">
                                                View All Recipes →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
                            ›
                        </button>

                        <div className="carousel-dots">
                            {featuredRecipes.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

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
