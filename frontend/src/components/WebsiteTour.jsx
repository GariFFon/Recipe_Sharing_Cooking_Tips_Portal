import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './WebsiteTour.css';
import { useNavigate, useLocation } from 'react-router-dom';

const WebsiteTour = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        // Driver configuration base
        const driverConfig = {
            showProgress: true,
            animate: true,
            allowClose: true,
            doneBtnText: 'START',
            nextBtnText: 'NEXT',
            prevBtnText: 'BACK',
            popoverClass: 'driverjs-theme',
        };

        // --- PHASE 1: HOME PAGE TOUR ---
        if (location.pathname === '/') {
            // Check if seen home tour
            const hasSeenHomeTour = localStorage.getItem('hasSeenWebsiteTour');
            if (hasSeenHomeTour) return;

            const homeSteps = isMobile ? [
                // Mobile Home Steps
                { element: '#tour-logo', popover: { title: 'Welcome! 🍳', description: 'Your culinary home.', side: 'bottom' } },
                { element: '.mobile-toggle-btn', popover: { title: 'Menu ☰', description: 'Tap here to see the full menu.', side: 'bottom' } },
                { element: '#tour-theme-toggle', popover: { title: 'Theme 🌗', description: 'Switch Light/Dark mode.', side: 'bottom' } },
                {
                    element: '#tour-browse-recipes', popover: {
                        title: 'Start 🥘', description: 'Tap here to explore recipes.', side: 'top',
                        onNextClick: () => {
                            localStorage.setItem('hasSeenWebsiteTour', 'true');
                            localStorage.setItem('tour_phase', 'recipes');
                            homeDriver.destroy();
                            navigate('/recipes');
                        }
                    }
                }
            ] : [
                // Desktop Home Steps
                {
                    element: '#tour-logo',
                    popover: {
                        title: 'Welcome to The Every Kitchen! 🍳',
                        description: 'Your new culinary home. Click here anytime to return to the homepage.',
                        side: 'bottom',
                        align: 'start'
                    }
                },
                {
                    element: '#tour-menu',
                    popover: {
                        title: 'Navigation Hub 🧭',
                        description: 'Browse Recipes, Lifestyle tips, and learn more About us from here.',
                        side: 'bottom'
                    }
                },
                {
                    element: '#tour-theme-toggle',
                    popover: {
                        title: 'Set Your Vibe 🌗',
                        description: 'Switch between Light and Dark mode to match your kitchen lighting.',
                        side: 'bottom'
                    }
                },
                {
                    element: '#tour-auth-profile',
                    popover: {
                        title: 'Join the Table 👨‍🍳',
                        description: 'Login or Sign Up to save favorites, add recipes, and manage your profile.',
                        side: 'bottom',
                        align: 'end'
                    }
                },
                {
                    element: '#tour-browse-recipes',
                    popover: {
                        title: 'Get Cooking! 🥘',
                        description: 'Dive straight into our collection of delicious recipes.',
                        side: 'top',
                        onNextClick: () => {
                            // Transition to Recipes Page
                            localStorage.setItem('hasSeenWebsiteTour', 'true'); // Create break point
                            localStorage.setItem('tour_phase', 'recipes');
                            homeDriver.destroy();
                            navigate('/recipes');
                        }
                    }
                }
            ];

            const homeDriver = driver({
                ...driverConfig,
                steps: homeSteps,
                // Handle cancellation properly
                // Handle cancellation properly - Use onDestroyed for v1 correctness
                onDestroyed: () => {
                    // Mark as seen immediately when tour ends or is closed
                    // This prevents repeat on refresh if user cancels
                    if (!localStorage.getItem('tour_phase')) {
                        localStorage.setItem('hasSeenWebsiteTour', 'true');
                    }
                }
            });

            // Start after delay
            const timer = setTimeout(() => homeDriver.drive(), 1500);
            return () => {
                clearTimeout(timer);
                homeDriver.destroy();
            };
        }

        // --- PHASE 2: RECIPES PAGE TOUR ---
        if (location.pathname === '/recipes') {
            const phase = localStorage.getItem('tour_phase');
            if (phase === 'recipes') {
                const recipeSteps = isMobile ? [
                    // Mobile Recipe Steps
                    { element: '.hero-search', popover: { title: 'Search 🔍', description: 'Find a specific dish.', side: 'bottom' } },
                    {
                        element: '.filter-panel',
                        popover: {
                            title: 'Filter 🥗',
                            description: 'Veg or Non-Veg? You decide.',
                            side: 'bottom',
                            onNextClick: () => {
                                // Direct Navigation on Next Click
                                const attemptClick = (attempts = 0) => {
                                    const firstRecipeLink = document.querySelector('.recipe-card');
                                    if (firstRecipeLink) {
                                        localStorage.setItem('tour_phase', 'details');
                                        recipeDriver.destroy();
                                        firstRecipeLink.click();
                                    } else {
                                        if (attempts < 5) setTimeout(() => attemptClick(attempts + 1), 500);
                                        else { recipeDriver.destroy(); alert("Loading recipes..."); }
                                    }
                                };
                                attemptClick();
                            }
                        }
                    }
                ] : [
                    // Desktop Recipe Steps
                    {
                        element: '.hero-search',
                        popover: {
                            title: 'Find Your Craving 🔍',
                            description: 'Search by keyword, ingredient, or chef name instantly.',
                            side: 'bottom'
                        }
                    },
                    {
                        element: '.filter-panel',
                        popover: {
                            title: 'Filter It Down 🥗',
                            description: 'Toggle between All, Vegetarian, and Non-Veg options easily.',
                            side: 'bottom'
                        }
                    },
                    {
                        element: '.recipes-hero .hero-title',
                        popover: {
                            title: 'Explore the Menu 📜',
                            description: 'Scroll down to choose a recipe. We are going to pick one for you now!',
                            side: 'bottom',
                            onNextClick: () => {
                                // AUTOMATICALLY CLICK THE FIRST RECIPE CARD (With Retry)
                                const attemptClick = (attempts = 0) => {
                                    const firstRecipeLink = document.querySelector('.recipe-card');
                                    if (firstRecipeLink) {
                                        localStorage.setItem('tour_phase', 'details');
                                        recipeDriver.destroy();
                                        firstRecipeLink.click();
                                    } else {
                                        if (attempts < 5) {
                                            // Retry every 500ms (max 2.5s)
                                            setTimeout(() => attemptClick(attempts + 1), 500);
                                        } else {
                                            recipeDriver.destroy();
                                            alert("Still loading recipes... please try again in a moment! 🍲");
                                        }
                                    }
                                };

                                attemptClick();
                            }
                        }
                    }
                ];

                const recipeDriver = driver({
                    ...driverConfig,
                    steps: recipeSteps
                });

                const timer = setTimeout(() => recipeDriver.drive(), 1000);
                return () => {
                    clearTimeout(timer);
                    recipeDriver.destroy();
                };
            }
        }

        // --- PHASE 3: RECIPE DETAILS TOUR ---
        if (location.pathname.startsWith('/recipes/')) {
            const phase = localStorage.getItem('tour_phase');
            if (phase === 'details') {
                const detailsSteps = isMobile ? [
                    // Mobile Details (Simplified)
                    { element: '#tour-servings', popover: { title: 'Servings 👥', description: 'Tap + or - to scale.', side: 'top' } },
                    { element: '#tour-ingredients', popover: { title: 'Ingredients 📝', description: 'Check them off!', side: 'top', onHighlightStarted: (element) => { setTimeout(() => { const y = element.getBoundingClientRect().top + window.pageYOffset - 250; window.scrollTo({ top: y, behavior: 'smooth' }); }, 200); } } },
                    { element: '#tour-instructions', popover: { title: 'Steps 🍳', description: 'Follow along.', side: 'top', onHighlightStarted: (element) => { setTimeout(() => { const y = element.getBoundingClientRect().top + window.pageYOffset - 250; window.scrollTo({ top: y, behavior: 'smooth' }); }, 200); } } },
                    {
                        element: '.floating-timer-widget',
                        popover: {
                            title: 'Timer ⏱️',
                            description: 'Tap to Minimze/Maximize.',
                            side: 'top',
                            onNextClick: () => {
                                localStorage.setItem('tour_phase', 'profile');
                                detailsDriver.destroy();
                                navigate('/profile');
                            }
                        }
                    }
                ] : [
                    // Desktop Details (Full)
                    {
                        element: '#tour-servings',
                        popover: {
                            title: 'Adjust Servings 👥',
                            description: 'Cooking for more? Toggle this to automatically scale your ingredients.',
                            side: 'bottom'
                        }
                    },
                    {
                        element: '#tour-ingredients',
                        popover: {
                            title: 'Ingredients Checklist 📝',
                            description: 'Check off items as you prep. You can also use the scaling buttons here.',
                            side: 'right'
                        }
                    },
                    {
                        element: '#tour-instructions',
                        popover: {
                            title: 'Follow the Steps 🍳',
                            description: 'Clear, step-by-step instructions to guide you to perfection.',
                            side: 'left'
                        }
                    },
                    {
                        element: '.floating-timer-widget',
                        popover: {
                            title: 'Your Cook Timer ⏱️',
                            description: 'Required for every chef! Use this widget to track your cooking time.',
                            side: 'left'
                        }
                    },
                    {
                        element: '.minimize-btn',
                        popover: {
                            title: 'Keep it Tidy 🧹',
                            description: 'Click this icon to **Minimize** the timer into a small bubble.',
                            side: 'left'
                        }
                    },
                    {
                        element: '.floating-timer-widget',
                        popover: {
                            title: 'Maximize It 🔄',
                            description: 'Double-click (or Tap) the minimized bubble to bring the full timer back!',
                            side: 'top',
                            onNextClick: () => {
                                localStorage.setItem('tour_phase', 'profile');
                                detailsDriver.destroy();
                                navigate('/profile');
                            }
                        }
                    }
                ];

                const detailsDriver = driver({
                    ...driverConfig,
                    steps: detailsSteps
                });

                // Wait for the widget to appear (it has an animation delay)
                const timer = setTimeout(() => detailsDriver.drive(), 2000);
                return () => {
                    clearTimeout(timer);
                    detailsDriver.destroy();
                };
            }
        }

        // --- PHASE 4: PROFILE TOUR ---
        if (location.pathname === '/profile') {
            const phase = localStorage.getItem('tour_phase');
            if (phase === 'profile') {
                const profileSteps = isMobile ? [
                    // Mobile Profile (Vertical flow)
                    { element: '#tour-profile-section', popover: { title: 'Profile 👤', description: 'Your stats.', side: 'bottom' } },
                    { element: '#tour-password-btn', popover: { title: 'Password 🔐', description: 'Secure account.', side: 'top' } },
                    { element: '#tour-profile-avatar', popover: { title: 'Avatar 📸', description: 'Update photo.', side: 'bottom' } },
                    { element: '#tour-profile-banner', popover: { title: 'Banner 🎨', description: 'Update banner.', side: 'bottom' } },
                    { element: '#tour-tab-favorites', popover: { title: 'Favorites ❤️', description: 'Your saved dishes.', side: 'bottom', onHighlightStarted: () => { const btn = document.getElementById('tour-tab-favorites'); if (btn) btn.click(); } } },
                    { element: '#tour-add-recipe-card', popover: { title: 'Add Recipe 🍲', description: 'Share your own!', side: 'top', onHighlightStarted: () => { const btn = document.getElementById('tour-tab-recipes'); if (btn) btn.click(); } } }
                ] : [
                    // Desktop Profile (Granular)
                    {
                        element: '#tour-profile-section',
                        popover: {
                            title: 'Your Profile 👤',
                            description: 'View your stats and membership details here.',
                            side: 'left'
                        }
                    },
                    {
                        element: '#tour-password-btn',
                        popover: {
                            title: 'Secure Your Account 🔐',
                            description: 'Update your password quickly and securely here.',
                            side: 'bottom'
                        }
                    },
                    {
                        element: '#tour-profile-avatar',
                        popover: {
                            title: 'Show Your Face 📸',
                            description: 'Click the edit icon to upload a new profile picture.',
                            side: 'right'
                        }
                    },
                    {
                        element: '#tour-profile-banner',
                        popover: {
                            title: 'Set the Mood 🎨',
                            description: 'Customize your profile with a unique banner image.',
                            side: 'bottom'
                        }
                    },
                    {
                        element: '#tour-tab-favorites',
                        popover: {
                            title: 'Your Favorites ❤️',
                            description: 'All the recipes you love, saved in one place.',
                            side: 'top',
                            align: 'center'
                        },
                        onHighlightStarted: () => {
                            // Auto-switch to Favorites tab
                            const btn = document.getElementById('tour-tab-favorites');
                            if (btn) btn.click();
                        }
                    },
                    {
                        element: '#tour-tab-recipes',
                        popover: {
                            title: 'Your Recipes 📖',
                            description: 'Manage the recipes you have shared with the community.',
                            side: 'top',
                            align: 'center'
                        },
                        onHighlightStarted: () => {
                            // Auto-switch back to Recipes tab
                            const btn = document.getElementById('tour-tab-recipes');
                            if (btn) btn.click();
                        }
                    },
                    {
                        element: '#tour-add-recipe-card',
                        popover: {
                            title: 'Add a New Recipe 🍲',
                            description: 'Ready to share? Click here to add your own masterpiece!',
                            side: 'left'
                        }
                    }
                ];

                const profileDriver = driver({
                    ...driverConfig,
                    steps: profileSteps,
                    onDestroyed: () => {
                        localStorage.removeItem('tour_phase');
                        localStorage.setItem('hasSeenWebsiteTour', 'true');
                    }
                });

                const timer = setTimeout(() => profileDriver.drive(), 1000);
                return () => {
                    clearTimeout(timer);
                    profileDriver.destroy();
                };
            }
        }

    }, [location.pathname, navigate]);

    return null;
};

export default WebsiteTour;
