import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeCarousel from '../components/RecipeCarousel';
import SearchModal from '../components/SearchModal';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';
import './Recipes.css';

const Recipes = () => {
    const [groupedRecipes, setGroupedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All'); // All, Veg, Non-Veg
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const fetchGroupedRecipes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/recipes/grouped?type=${filterType}`);
            const data = await response.json();
            setGroupedRecipes(data);

            // Calculate total recipes across all groups
            const total = data.reduce((acc, group) => acc + group.recipes.length, 0);
            setTotalRecipes(total);
        } catch (err) {
            console.error("Failed to fetch recipes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupedRecipes();
    }, [filterType]);


    return (
        <div className="recipes-page">
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />

            <header className="recipes-hero">
                <div className="container">
                    <p className="hero-sub">EXPLORE OUR COLLECTION</p>
                    <h1 className="hero-title">
                        {filterType === 'All' ? 'All Recipes' : filterType === 'Veg' ? 'Vegetarian' : 'Non-Veg'}
                    </h1>


                    <div className="hero-search" onClick={() => setIsSearchModalOpen(true)}>
                        <input
                            type="text"
                            placeholder="Click to search recipes..."
                            value=""
                            readOnly
                        />
                        <button className="search-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Filter Panel */}
                    <div className="filter-panel">
                        <button
                            className={`filter-btn ${filterType === 'All' ? 'active' : ''}`}
                            onClick={() => setFilterType('All')}
                        >
                            All Recipes
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'Veg' ? 'active' : ''}`}
                            onClick={() => setFilterType('Veg')}
                        >
                            Vegetarian
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'Non-Veg' ? 'active' : ''}`}
                            onClick={() => setFilterType('Non-Veg')}
                        >
                            Non-Veg
                        </button>
                    </div>
                </div>
            </header>

            <section className="recipes-section container">
                <div className="section-header">
                    <h2 className="section-title">Latest From The Kitchen</h2>
                    <div className="section-divider"></div>
                    {!loading && (
                        <p className="results-count">
                            {`${totalRecipes} ${totalRecipes === 1 ? 'RECIPE' : 'RECIPES'} FOUND`}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="carousels-container">
                        {groupedRecipes.length > 0 ? (
                            groupedRecipes.map((group) => (
                                <RecipeCarousel
                                    key={group.category}
                                    title={group.category}
                                    recipes={group.recipes}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No recipes found.</p>
                            </div>
                        )}
                    </div>
                )}

            </section>

            <Footer />
        </div>
    );
};

export default Recipes;
