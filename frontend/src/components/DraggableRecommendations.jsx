import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, AnimatePresence, useDragControls } from 'framer-motion';
import { FiChevronUp, FiChevronDown, FiMove, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './DraggableRecommendations.css';

const DraggableRecommendations = ({ recommendations = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const constraintsRef = useRef(null);
    const y = useMotionValue(0);
    const dragControls = useDragControls();
    const intervalRef = useRef(null);

    const [fetchedRecommendations, setFetchedRecommendations] = useState([]);

    // Fetch random recipes if no recommendations provided
    useEffect(() => {
        if (recommendations.length === 0 && fetchedRecommendations.length === 0) {
            const fetchRandomRecipes = async () => {
                try {
                    const response = await fetch('http://localhost:5001/api/recipes/random');
                    if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data) && data.length > 0) {
                            setFetchedRecommendations(data.slice(0, 5));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching recommendations:', error);
                }
            };
            fetchRandomRecipes();
        }
    }, []); // Only run once on mount

    // Memoize final recommendations to prevent unnecessary re-renders
    const displayRecommendations = useMemo(() => {
        if (recommendations.length > 0) return recommendations;
        if (fetchedRecommendations.length > 0) return fetchedRecommendations;

        // Fallback data
        return [
            {
                _id: '1',
                title: 'Spicy Thai Basil Chicken',
                image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
                cookTime: 25,
                difficulty: 'Medium'
            },
            {
                _id: '2',
                title: 'Creamy Mushroom Risotto',
                image: 'https://images.unsplash.com/photo-1476124369491-c4f2c7c53a7a?w=400',
                cookTime: 35,
                difficulty: 'Hard'
            },
            {
                _id: '3',
                title: 'Classic Margherita Pizza',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
                cookTime: 20,
                difficulty: 'Easy'
            },
            {
                _id: '4',
                title: 'Honey Garlic Salmon',
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
                cookTime: 30,
                difficulty: 'Medium'
            },
            {
                _id: '5',
                title: 'Chocolate Lava Cake',
                image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
                cookTime: 25,
                difficulty: 'Medium'
            }
        ];
    }, [recommendations, fetchedRecommendations]);

    // Auto-rotate carousel every 4 seconds
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Only run if expanded and we have more than 1 item to rotate
        if (!isExpanded || displayRecommendations.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayRecommendations.length);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isExpanded, displayRecommendations.length]);

    // Auto-collapse when dragged down significantly
    const handleDragEndRecommendations = (event, info) => {
        if (isExpanded && info.offset.y > 100) {
            setIsExpanded(false);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {/* Drag constraints container */}
            <div ref={constraintsRef} className="drag-constraints" />

            <motion.div
                className={`draggable-recommendations ${isExpanded ? 'expanded' : 'collapsed'}`}
                drag
                dragListener={false}
                dragControls={dragControls}
                dragMomentum={false}
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                onDragEnd={handleDragEndRecommendations}
                animate={{
                    height: isExpanded ? 480 : 66,
                    width: isExpanded ? 380 : 250
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }}
                style={{ y }}
            >
                {/* Drag Handle / Tab */}
                <div
                    className="drag-handle"
                    onPointerDown={(e) => dragControls.start(e)}
                    onClick={(e) => {
                        // Only toggle if it wasn't a drag operation (simple check)
                        if (!isExpanded) toggleExpand();
                    }}
                    style={{ touchAction: "none" }}
                >
                    <span className="drag-text">CHEF'S PICKS</span>
                    {isExpanded && (
                        <button className="collapse-btn-inline" onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                        }}>
                            <FiChevronDown />
                        </button>
                    )}
                </div>

                {/* Expanded Content with Carousel */}
                {isExpanded && (
                    <motion.div
                        className="recommendations-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >

                        {/* Carousel Container */}
                        <div className="carousel-container">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    className="carousel-slide"
                                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Link
                                        to={`/recipes/${displayRecommendations[currentIndex]._id}`}
                                        className="carousel-card"
                                    >
                                        <div className="carousel-image">
                                            <img
                                                src={displayRecommendations[currentIndex].image}
                                                alt={displayRecommendations[currentIndex].title}
                                            />
                                            <div className="carousel-badge">
                                                {displayRecommendations[currentIndex].difficulty}
                                            </div>
                                        </div>
                                        <div className="carousel-info">
                                            <h4>{displayRecommendations[currentIndex].title}</h4>
                                            <div className="carousel-meta">
                                                <span className="time-badge">
                                                    ⏱ {displayRecommendations[currentIndex].cookTime} min
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="carousel-indicators">
                            {displayRecommendations.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>

                        <div className="drag-hint">
                            <FiChevronDown />
                            <span>Drag down to collapse</span>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default DraggableRecommendations;
