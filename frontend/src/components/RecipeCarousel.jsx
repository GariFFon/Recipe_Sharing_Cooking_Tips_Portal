import React, { useRef } from 'react';
import RecipeCard from './RecipeCard';
import './RecipeCarousel.css';

const RecipeCarousel = ({ title, recipes }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollTo({
                left: scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="recipe-carousel-container">
            <h3 className="carousel-title">{title}</h3>
            <div className="carousel-wrapper">
                <button className="carousel-nav-btn left" onClick={() => scroll('left')}>
                    &#10094;
                </button>
                <div className="carousel-scroll-container" ref={scrollRef}>
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="carousel-item">
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
                </div>
                <button className="carousel-nav-btn right" onClick={() => scroll('right')}>
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default RecipeCarousel;
