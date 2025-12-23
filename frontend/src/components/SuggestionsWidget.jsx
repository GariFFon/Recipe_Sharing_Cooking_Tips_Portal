import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SuggestionsWidget.css';
import { API_BASE_URL } from '../config';

const SuggestionsWidget = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (suggestions.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [suggestions.length]);

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/recipes/random`);
            const data = await response.json();

            if (response.ok) {
                // Ensure we have an array and take up to 5 for carousel
                if (Array.isArray(data)) {
                    setSuggestions(data.slice(0, 5));
                }
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return <div className="suggestions-loading">Loading suggestions...</div>;
    }

    if (suggestions.length === 0) {
        return null; // Don't show if no suggestions
    }

    const currentRecipe = suggestions[currentIndex];

    // Safety check just in case
    if (!currentRecipe) return null;

    return (
        <div className="suggestions-widget">
            <h3 className="widget-title">Chef's Recommendations</h3>
            <div className="carousel-container">
                <Link to={`/recipes/${currentRecipe._id}`} className="carousel-item fade-in" key={currentRecipe._id}>
                    <div className="carousel-image">
                        <img src={currentRecipe.image} alt={currentRecipe.title} loading="lazy" />
                    </div>
                    <div className="carousel-info">
                        <h4>{currentRecipe.title}</h4>
                        <span className="carousel-meta">
                            {currentRecipe.cuisine || 'Classic'} • {currentRecipe.dietaryType || 'Diverse'}
                        </span>
                    </div>
                </Link>

                {suggestions.length > 1 && (
                    <div className="carousel-dots">
                        {suggestions.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => handleDotClick(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuggestionsWidget;
