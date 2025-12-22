import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SupremeNewsletter.css';

const SupremeNewsletter = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [focused, setFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
        }
    };

    // Charm configurations
    const charms = [
        { type: 'circle', color: '#fdcb6e', top: '-20px', left: '10%', size: 40, delay: 0 },
        { type: 'star', color: '#ff7675', bottom: '-30px', right: '15%', size: 50, delay: 0.5 },
        { type: 'squiggle', color: '#74b9ff', top: '10%', right: '-25px', size: 45, delay: 1.0 },
        { type: 'pill', color: '#55efc4', bottom: '20%', left: '-20px', size: 35, delay: 1.5 }
    ];

    return (
        <section className="supreme-newsletter-section">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="supreme-card"
            >
                {/* Floating Charms with inline overrides for absolute positioning */}
                {charms.map((charm, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 4,
                            ease: "easeInOut",
                            repeat: Infinity,
                            delay: charm.delay
                        }}
                        className={`charm charm-${charm.type}`}
                        style={{
                            top: charm.top,
                            bottom: charm.bottom,
                            left: charm.left,
                            right: charm.right,
                            width: charm.size,
                            height: charm.size,
                            background: charm.color,
                        }}
                    >
                        {charm.type === 'star' && (
                            <div style={{
                                width: '100%', height: '100%',
                                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                                background: 'inherit'
                            }} />
                        )}
                        {charm.type === 'squiggle' && (
                            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none', stroke: '#1a1a1a', strokeWidth: '15', strokeLinecap: 'round' }}>
                                <path d="M10,50 Q25,25 50,50 T90,50" />
                            </svg>
                        )}
                    </motion.div>
                ))}

                <AnimatePresence mode="wait">
                    {!isSubscribed ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{ width: '100%' }}
                        >
                            <h2 className="supreme-title">
                                Stay in the Loop
                            </h2>
                            <p className="supreme-desc">
                                Delicious updates, straight to your inbox.
                            </p>

                            <form onSubmit={handleSubmit} className="supreme-form">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="supreme-input"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="supreme-btn"
                                >
                                    Sign Up
                                </motion.button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="supreme-success"
                        >
                            <div className="success-emoji">🎉</div>
                            <h3 className="success-title">
                                You're In!
                            </h3>
                            <p className="success-subtitle">Prepare for deliciousness.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

export default SupremeNewsletter;
