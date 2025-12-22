import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
    { name: "Breakfast", icon: "🥞", slug: "breakfast", color: "#fdcb6e", rotate: -3 },
    { name: "Vegan Power", icon: "🌿", slug: "vegan", color: "#55efc4", rotate: 2 },
    { name: "Comfort Food", icon: "🧀", slug: "comfort", color: "#ff7675", rotate: -2 },
    { name: "Guilty Pleasures", icon: "🍫", slug: "dessert", color: "#a29bfe", rotate: 4 },
    { name: "30-Min Meals", icon: "⚡", slug: "quick", color: "#74b9ff", rotate: -4 },
    { name: "Healthy Living", icon: "🧘‍♀️", slug: "lifestyle", path: "/lifestyle", color: "#ffeaa7", rotate: 3 }
];

const SupremeCategory = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            padding: '2rem 0'
        }}>
            {categories.map((cat, index) => (
                <Link
                    key={cat.slug}
                    to={cat.path || `/recipes?category=${cat.slug}`}
                    style={{ textDecoration: 'none' }}
                >
                    <motion.div
                        className="supreme-cat-btn"
                        initial={{ opacity: 0, scale: 0.8, rotate: cat.rotate * 3 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: cat.rotate }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        whileHover={{
                            scale: 1.15,
                            rotate: 0,
                            zIndex: 10,
                            boxShadow: `8px 8px 0px #1a1a1a`
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: cat.color,
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
                        <span style={{ fontSize: '1.5rem', fontStyle: 'normal' }}>{cat.icon}</span>
                        {cat.name}
                    </motion.div>
                </Link>
            ))}
        </div>
    );
};

export default SupremeCategory;
