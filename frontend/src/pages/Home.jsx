import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import './Home.css';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:5001/api/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
                setFilteredRecipes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch recipes", err);
                setLoading(false);
            });
    }, []);

    // Handle search
    useEffect(() => {
        const results = recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredRecipes(results);
    }, [searchTerm, recipes]);

    return (
        <div className="home-page">
            <header className="hero-simple">
                <div className="container">
                    <p className="hero-sub">WELCOME TO THE EVERY KITCHEN</p>
                    <h1 className="hero-title">Simple Recipes Made <br /> <em>for</em> Real Life</h1>

                    <div className="hero-search">
                        <input
                            type="text"
                            placeholder="Search for recipes (e.g. 'chicken', 'pasta')..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </div>
                </div>
            </header>

            <section className="recipes-section container">
                <div className="section-header">
                    <h2 className="section-title">Latest From The Kitchen</h2>
                    <div className="section-divider"></div>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="grid-recipes">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe._id} recipe={recipe} />
                        ))}
                    </div>
                )}

                {!loading && filteredRecipes.length === 0 && (
                    <div className="empty-state">
                        <p>No recipes found matching "{searchTerm}".</p>
                        <button className="btn-text" onClick={() => setSearchTerm('')} style={{ marginTop: '1rem', background: '#ccc' }}>Clear Search</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
