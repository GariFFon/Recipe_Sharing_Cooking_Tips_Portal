import React, { useState, useEffect, useRef } from 'react';
import RecipeCarousel from './RecipeCarousel';
import './LazyCarousel.css';

const CarouselSkeleton = ({ title }) => {
    return (
        <div className="carousel-skeleton">
            <div className="skeleton-header">
                <div className="skeleton-badge">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-title">{title}</div>
                </div>
                <div className="skeleton-count"></div>
            </div>
            <div className="skeleton-wrapper">
                <div className="skeleton-cards">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-card"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const LazyCarousel = ({ title, recipes, eager = false, id }) => {
    // Check if this carousel is the scroll target
    const params = new URLSearchParams(window.location.search);
    const targetCuisine = params.get('cuisine');
    const isScrollTarget = targetCuisine && id === `cuisine-${targetCuisine.toLowerCase().replace(/\s+/g, '-')}`;

    // Load immediately if eager OR if this is the scroll target
    const [isVisible, setIsVisible] = useState(eager || isScrollTarget);
    const ref = useRef();

    useEffect(() => {
        if (eager || isScrollTarget) return; // Skip observer for eagerly loaded or target carousels

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once loaded
                }
            },
            {
                rootMargin: '300px', // Load 300px before entering viewport
                threshold: 0.01
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (observer) observer.disconnect();
        };
    }, [eager, isScrollTarget]);

    return (
        <div ref={ref} id={id} className="lazy-carousel-wrapper" style={{ minHeight: isVisible ? 'auto' : '500px' }}>
            {isVisible ? (
                <RecipeCarousel title={title} recipes={recipes} />
            ) : (
                <CarouselSkeleton title={title} />
            )}
        </div>
    );
};

export default LazyCarousel;
