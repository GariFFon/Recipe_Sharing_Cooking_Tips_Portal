import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

// Country/Cuisine emoji mapping
const cuisineEmojis = {
    'Italian': '🇮🇹',
    'Chinese': '🇨🇳',
    'Indian': '🇮🇳',
    'Mexican': '🇲🇽',
    'Japanese': '🇯🇵',
    'French': '🇫🇷',
    'Thai': '🇹🇭',
    'Greek': '🇬🇷',
    'Spanish': '🇪🇸',
    'Korean': '🇰🇷',
    'Vietnamese': '🇻🇳',
    'Turkish': '🇹🇷',
    'Lebanese': '🇱🇧',
    'Moroccan': '🇲🇦',
    'Brazilian': '🇧🇷',
    'American': '🇺🇸',
    'British': '🇬🇧',
    'German': '🇩🇪',
    'Algerian': '🇩🇿',
    'Egyptian': '🇪🇬',
    'Ethiopian': '🇪🇹',
    'Tunisian': '🇹🇳',
    'Peruvian': '🇵🇪',
    'Argentinian': '🇦🇷',
};

// Color palette for cards
const colors = [
    '#fdcb6e', '#55efc4', '#ff7675', '#a29bfe',
    '#74b9ff', '#ffeaa7', '#fd79a8', '#6c5ce7'
];

const CountryNavigation = () => {
    const [cuisines, setCuisines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCuisines = async () => {
            try {
                // Fetch all countries (use large limit to get everything)
                const response = await fetch(`${API_BASE_URL}/recipes/grouped?limit=100`);
                const result = await response.json();

                // Handle new paginated response format
                const groupedData = result.data || result;

                // Extract unique cuisines from grouped data
                const uniqueCuisines = groupedData.map(group => group.category).filter(Boolean);
                setCuisines(uniqueCuisines);
            } catch (error) {
                console.error('Error fetching cuisines:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCuisines();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading cuisines...</div>;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            padding: '2rem 0'
        }}>
            {cuisines.map((cuisine, index) => {
                const emoji = cuisineEmojis[cuisine] || '🍽️';
                const color = colors[index % colors.length];
                const rotate = (index % 2 === 0 ? -1 : 1) * (2 + (index % 3));

                return (
                    <Link
                        key={cuisine}
                        to={`/recipes?cuisine=${encodeURIComponent(cuisine)}#scroll`}
                        style={{ textDecoration: 'none' }}
                    >
                        <motion.div
                            className="supreme-cat-btn"
                            initial={{ opacity: 0, scale: 0.8, rotate: rotate * 3 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: rotate }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, type: "spring" }}
                            whileHover={{
                                scale: 1.15,
                                rotate: 0,
                                zIndex: 10,
                                boxShadow: `8px 8px 0px #1a1a1a`
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: color,
                                color: '#1a1a1a',
                                padding: '1rem 2rem',
                                border: '3px solid #1a1a1a',
                                fontWeight: '900',
                                fontSize: '1.2rem',
                                textTransform: 'uppercase',
                                fontFamily: '"Playfair Display", serif',
                                fontStyle: 'italic',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '4px 4px 0px #1a1a1a',
                                cursor: 'pointer'
                            }}
                        >
                            {cuisine}
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
};

export default CountryNavigation;
