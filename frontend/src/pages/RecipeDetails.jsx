
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';
import './RecipeDetails.css';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    // Portion Calculator State
    const [baseServings, setBaseServings] = useState(4); // Default, updated on fetch
    const [currentServings, setCurrentServings] = useState(4);

    // Auth & Like Logic
    const { user, updateUser } = useAuth();
    const [liked, setLiked] = useState(false);

    // Sync Like State
    useEffect(() => {
        if (user && user.favorites && recipe) {
            const isFav = user.favorites.some(fav =>
                (typeof fav === 'string' ? fav : fav._id) === recipe._id
            );
            setLiked(isFav);
        } else {
            setLiked(false);
        }
    }, [user, recipe]);

    const toggleLike = async () => {
        if (!user) {
            alert('Please login to save favorites');
            return;
        }

        const previousState = liked;
        const newState = !liked;
        setLiked(newState);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/auth/favorites/${recipe._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to update favorite');

            const data = await response.json();
            if (data.favorites) {
                updateUser({ ...user, favorites: data.favorites });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setLiked(previousState);
        }
    };

    // --- COOKING TIMER LOGIC ---
    const [timeLeft, setTimeLeft] = useState(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Parse time string to seconds (e.g., "1 hr 30 mins" -> 5400)
    const parseDuration = (str) => {
        if (!str) return 0;
        let totalSeconds = 0;
        const hours = str.match(/(\d+)\s*(h|hr|hour)/i);
        const mins = str.match(/(\d+)\s*(m|min|minute)/i);
        if (hours) totalSeconds += parseInt(hours[1]) * 3600;
        if (mins) totalSeconds += parseInt(mins[1]) * 60;
        return totalSeconds > 0 ? totalSeconds : 0; // Default 0 if parse fails
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (timeLeft === null) {
            // Start for the first time
            const total = parseDuration(recipe.prepTime || '0 mins');
            if (total === 0) {
                alert("No prep time specified for this recipe!");
                return;
            }
            setTimeLeft(total);
            setIsTimerRunning(true);
        } else {
            // Toggle Pause/Resume
            setIsTimerRunning(!isTimerRunning);
        }
    };

    const resetTimer = (e) => {
        e.stopPropagation();
        setIsTimerRunning(false);
        setTimeLeft(null);
    };

    const adjustTime = (amount) => {
        const current = timeLeft !== null ? timeLeft : parseDuration(recipe.prepTime || '0 mins');
        setTimeLeft(Math.max(0, current + amount));
    };

    useEffect(() => {
        let interval;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsTimerRunning(false);
                        // Audio alert could go here
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/recipes/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setRecipe(data);
                if (data && data.servings) {
                    const parsedServings = parseInt(data.servings) || 4;
                    setBaseServings(parsedServings);
                    setCurrentServings(parsedServings);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setRecipe(null); // Ensure null on error so "Recipe not found" renders
                setLoading(false);
            });
    }, [id]);

    // Adjust Servings
    const updateServings = (change) => {
        const newServings = currentServings + change;
        if (newServings >= 1) {
            setCurrentServings(newServings);
        }
    };

    // Ingredient Scaler Utility
    const scaleIngredient = (ingredientLine) => {
        if (currentServings === baseServings) return ingredientLine;

        const ratio = currentServings / baseServings;

        // Regex to find numbers (integers, decimals, fractions like 1/2)
        // This is a simplified regex.
        return ingredientLine.replace(/(\d+[\/\.]\d+)|\d+/g, (match) => {
            let value;
            // Handle fraction
            if (match.includes('/')) {
                const [num, den] = match.split('/');
                value = parseFloat(num) / parseFloat(den);
            } else {
                value = parseFloat(match);
            }

            let scaled = value * ratio;

            // Format prettily
            // If close to integer, make integer
            if (Math.abs(scaled - Math.round(scaled)) < 0.1) {
                return Math.round(scaled);
            }
            // Limit decimals
            return parseFloat(scaled.toFixed(2));
        });
    };

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (!recipe) return <div className="loading">Recipe not found.</div>;

    return (
        <div className="container recipe-details-page">
            <Link to="/recipes" className="back-link">← Back to Recipes</Link>

            <div className="details-header">
                <h1 className="details-title">{recipe.title}</h1>
                <div className="meta-grid">
                    <div className="meta-item">
                        <span className="meta-label">Total Time</span>
                        <span className="meta-value">{recipe.cookTime || '45 mins'}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Prep Time</span>
                        <span className="meta-value">{recipe.prepTime || '15 mins'}</span>
                    </div>
                    <div className="meta-item control-item">
                        <span className="meta-label">Servings</span>
                        <div className="servings-control">
                            <button onClick={() => updateServings(-1)}>−</button>
                            <span className="meta-value">{currentServings}</span>
                            <button onClick={() => updateServings(1)}>+</button>
                        </div>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Difficulty</span>
                        <span className="meta-value">{recipe.difficulty || 'Medium'}</span>
                    </div>
                </div>
                <div className="funky-timer-section">
                    <div className="timer-display-wrapper">
                        <div className="timer-row">
                            <button className="timer-adjust-btn" onClick={() => adjustTime(-60)} aria-label="Subtract 1 minute">
                                −
                            </button>
                            <div className={`timer-digit-box ${isTimerRunning ? 'pulse' : ''}`}>
                                {timeLeft !== null
                                    ? formatTime(timeLeft)
                                    : formatTime(parseDuration(recipe.prepTime || '15 mins'))}
                            </div>
                            <button className="timer-adjust-btn" onClick={() => adjustTime(60)} aria-label="Add 1 minute">
                                +
                            </button>
                        </div>
                        <div className="timer-controls">
                            {!isTimerRunning && timeLeft === null && (
                                <button className="btn-timer-start" onClick={toggleTimer}>Start Timer</button>
                            )}
                            {(isTimerRunning || timeLeft !== null) && (
                                <>
                                    <button className={`btn-timer-toggle ${isTimerRunning ? 'paused' : ''}`} onClick={toggleTimer}>
                                        {isTimerRunning ? 'Pause' : 'Resume'}
                                    </button>
                                    <button className="btn-timer-reset" onClick={resetTimer}>Reset</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="details-image-container">
                    <img src={recipe.image} alt={recipe.title} className="details-image" />
                    <button
                        className={`details-like-btn ${liked ? 'active' : ''}`}
                        onClick={toggleLike}
                        aria-label="Toggle Favorite"
                    >
                        <svg viewBox="0 0 24 24" width="28" height="28" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="details-content">
                {/* Description removed as it duplicates instructions */}

                <div className="recipe-grid">
                    <div className="ingredients-section sticky-section">
                        <div className="ingredients-header">
                            <h3>Ingredients</h3>
                            <div className="scaling-switch">
                                <button
                                    className={Math.abs(currentServings - baseServings * 0.5) < 0.001 ? 'active' : ''}
                                    onClick={() => setCurrentServings(baseServings * 0.5)}
                                >
                                    0.5x
                                </button>
                                <button
                                    className={Math.abs(currentServings - baseServings) < 0.001 ? 'active' : ''}
                                    onClick={() => setCurrentServings(baseServings)}
                                >
                                    1x
                                </button>
                                <button
                                    className={Math.abs(currentServings - baseServings * 2) < 0.001 ? 'active' : ''}
                                    onClick={() => setCurrentServings(baseServings * 2)}
                                >
                                    2x
                                </button>
                            </div>
                        </div>
                        <p className="scale-note">Adjusted for {currentServings} servings</p>
                        <ul>
                            {recipe.ingredients.map((ing, index) => (
                                <li key={index}>
                                    <input type="checkbox" id={`ing-${index}`} />
                                    <label htmlFor={`ing-${index}`}>{scaleIngredient(ing)}</label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="instructions-section">
                        <h3>Instructions</h3>
                        <div className="instructions-list">
                            {recipe.instructions
                                .filter(inst => !/^step\s+\d+$/i.test(inst.trim())) // Remove standalone "step 1", "step 2" entries
                                .map((inst, index) => (
                                    <div key={index} className="step">
                                        <span className="step-num">{index + 1}</span>
                                        <div className="step-content">
                                            <p>{inst.replace(/^(step\s+\d+[:.]\s*|\d+\.\s*|Step\s+\d+[:.]\s*)/i, '').trim()}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {recipe.tips && (
                    <div className="tips-section">
                        <h3>👨‍🍳 Chef's Tips</h3>
                        <p>{recipe.tips}</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default RecipeDetails;

