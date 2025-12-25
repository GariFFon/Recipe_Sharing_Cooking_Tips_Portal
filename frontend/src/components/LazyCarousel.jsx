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
    const [isVisible, setIsVisible] = useState(eager);
    const ref = useRef();

    useEffect(() => {
        if (eager) return; // Skip observer for eagerly loaded carousels

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
    }, [eager]);

    return (
        <div ref={ref} id={id} style={{ minHeight: isVisible ? 'auto' : '500px' }}>
            {isVisible ? (
                <RecipeCarousel title={title} recipes={recipes} />
            ) : (
                <CarouselSkeleton title={title} />
            )}
        </div>
    );
};

export default LazyCarousel;
