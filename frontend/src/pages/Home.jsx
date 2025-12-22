import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import Footer from '../components/Footer';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './Home.css';

const Home = () => {
    const [randomRecipes, setRandomRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRandomRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/recipes/random');
                const data = await response.json();
                setRandomRecipes(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching random recipes:', error);
                setLoading(false);
            }
        };

        fetchRandomRecipes();
    }, []);

    const handleCardClick = (recipeId, slideIndex) => {
        // Don't navigate if user was dragging
        if (isDragging) {
            return;
        }

        // Only navigate if clicking the centered/active slide
        if (slideIndex === activeIndex) {
            navigate(`/recipes/${recipeId}`);
        }
        // Otherwise, Swiper's slideToClickedSlide will center it
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <header className="hero-organic">
                <div className="hero-content">
                    <span className="hero-script">Welcome to our kitchen</span>
                    <h1 className="hero-title">
                        Simple Recipes <br />
                        <em>Made for Real Life</em>
                    </h1>
                    <p className="hero-description">
                        From quick weeknight dinners to slow Sunday simmers, discover food that brings people together.
                    </p>
                    <div className="hero-actions">
                        <Link to="/recipes" className="btn-organic-primary">Browse Recipes</Link>
                        <Link to="/about" className="btn-organic-text">Our Story</Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-blob-bg"></div>
                    <img
                        src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1926&auto=format&fit=crop"
                        alt="Fresh Vegetables"
                        className="hero-img"
                    />
                </div>
            </header>

            {/* NEW: Infinite Marquee Stats - Crazy Motion */}
            <div className="stats-marquee-container">
                <div className="marquee-content">
                    {/* Set 1 */}
                    <div className="stat-item-marquee">1k+ <span className="highlight">Recipes</span></div>
                    <div className="stat-item-marquee">50k <span className="highlight">Cooks</span></div>
                    <div className="stat-item-marquee">4.9 <span className="highlight">Rating</span></div>
                    <div className="stat-item-marquee">100+ <span className="highlight">Tips</span></div>

                    {/* Set 2 */}
                    <div className="stat-item-marquee">1k+ <span className="highlight">Recipes</span></div>
                    <div className="stat-item-marquee">50k <span className="highlight">Cooks</span></div>
                    <div className="stat-item-marquee">4.9 <span className="highlight">Rating</span></div>
                    <div className="stat-item-marquee">100+ <span className="highlight">Tips</span></div>

                    {/* Set 3 */}
                    <div className="stat-item-marquee">1k+ <span className="highlight">Recipes</span></div>
                    <div className="stat-item-marquee">50k <span className="highlight">Cooks</span></div>
                    <div className="stat-item-marquee">4.9 <span className="highlight">Rating</span></div>
                    <div className="stat-item-marquee">100+ <span className="highlight">Tips</span></div>

                    {/* Set 4 */}
                    <div className="stat-item-marquee">1k+ <span className="highlight">Recipes</span></div>
                    <div className="stat-item-marquee">50k <span className="highlight">Cooks</span></div>
                    <div className="stat-item-marquee">4.9 <span className="highlight">Rating</span></div>
                    <div className="stat-item-marquee">100+ <span className="highlight">Tips</span></div>
                </div>
            </div>

            {/* 3D Coverflow Carousel Section (PRESERVED) */}
            <section className="section-full-width">
                <div className="section-header-center">
                    <span className="script-sub">Constant Inspiration</span>
                    <h2 className="section-title">Discover New Flavors</h2>
                </div>

                <div className="carousel-container">
                    {loading ? (
                        <div className="loading-spinner">Loading delicious ideas...</div>
                    ) : (
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            loop={true}
                            slidesPerView={'auto'}
                            slideToClickedSlide={true}
                            allowTouchMove={true}
                            simulateTouch={true}
                            touchRatio={1}
                            breakpoints={{
                                768: {
                                    slidesPerView: 3,
                                }
                            }}
                            coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }}
                            pagination={true}
                            preventClicks={false}
                            preventClicksPropagation={false}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            onTouchStart={() => setIsDragging(false)}
                            onTouchMove={() => setIsDragging(true)}
                            onTouchEnd={() => setTimeout(() => setIsDragging(false), 50)}
                            modules={[EffectCoverflow, Pagination, Autoplay]}
                            className="mySwiper"
                        >
                            {randomRecipes.map((recipe, index) => (
                                <SwiperSlide key={`${recipe._id}-${index}`} className="swiper-slide-custom">
                                    <div
                                        onClick={() => handleCardClick(recipe._id, index)}
                                        className="marquee-card-premium cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="premium-img-wrapper">
                                            <img src={recipe.image} alt={recipe.title} />
                                            <div className="premium-overlay">
                                            </div>
                                        </div>
                                        <div className="premium-card-info">
                                            <div className="premium-card-header">
                                                <span className="premium-difficulty">{recipe.difficulty || 'Easy'}</span>
                                                <span className="premium-time">{recipe.prepTime || '30 min'}</span>
                                            </div>
                                            <h4>{recipe.title}</h4>
                                            <div className="premium-card-footer">
                                                <span className="cook-now-text">Cook Now <span className="arrow">→</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </section>

            {/* NEW: Categories Section */}
            <section className="home-categories">
                <div className="section-header-center">
                    <span className="script-sub">What are you craving?</span>
                    <h2 className="section-title" style={{ color: '#1a1a1a' }}>Curated Collections</h2>
                </div>
                <div className="cat-pills-container">
                    <Link to="/recipes?category=breakfast" className="cat-pill">🥞 Breakfast</Link>
                    <Link to="/recipes?category=vegan" className="cat-pill">🌿 Vegan Power</Link>
                    <Link to="/recipes?category=comfort" className="cat-pill">🧀 Comfort Food</Link>
                    <Link to="/recipes?category=dessert" className="cat-pill">🍫 Guilty Pleasures</Link>
                    <Link to="/recipes?category=quick" className="cat-pill">⚡ 30-Min Meals</Link>
                    <Link to="/lifestyle" className="cat-pill">🧘‍♀️ Healthy Living</Link>
                </div>
            </section>

            {/* Narrative / Values Section (Overlapping) */}
            <section className="section-narrative">
                <div className="narrative-container">
                    <div className="narrative-visual">
                        <img
                            src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=2000&auto=format&fit=crop"
                            alt="Cooking Together"
                            className="narrative-img"
                        />
                    </div>
                    <div className="narrative-content">
                        <span className="script-sub">Why We Cook</span>
                        <h2>More Than Just <br /> <em>Ingredients</em></h2>
                        <p>
                            Food is about connection. It's the pause in a busy day, the laughter shared over a simmering pot, and the comfort of a warm meal. We believe in sustainable sourcing, mindful preparation, and the joy of sharing.
                        </p>
                        <p>
                            We are building a community where every recipe tells a story and every meal brings us closer together.
                        </p>
                        <ul className="narrative-list">
                            <li>🌿 Seasonal & Fresh Ingredients</li>
                            <li>🤝 Community Driven Sharing</li>
                            <li>✨ Simple & Honest Cooking</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA */}
            <section className="section-cta-blobs">
                <div className="cta-content">
                    <h2>Join Our Table</h2>
                    <p>Get weekly inspiration sent straight to your inbox.</p>
                    <div className="cta-form">
                        <input type="email" placeholder="Your email address" />
                        <button className="btn-organic-dark">Subscribe</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
