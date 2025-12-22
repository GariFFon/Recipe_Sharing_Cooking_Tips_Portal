import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const OurStoryLink = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block', zIndex: 40 }}>
            <Link to="/about" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <motion.div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Rotating Text Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 10,
                            ease: "linear",
                            repeat: Infinity
                        }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 10
                        }}
                    >
                        <svg viewBox="0 0 100 100" width="100%" height="100%">
                            <defs>
                                <path id="circlePath" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
                            </defs>
                            <text fontSize="10.5" fontWeight="bold" letterSpacing="3" fill="#1a1a1a" className="story-coin-text">
                                <textPath href="#circlePath" startOffset="0%">
                                    OUR STORY • EST 2024 • THE JOURNEY •
                                </textPath>
                            </text>
                        </svg>
                    </motion.div>

                    {/* Central Coin / Portal */}
                    <motion.div
                        className="story-coin-center"
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            rotate: isHovered ? 180 : 0
                        }}
                        transition={{ duration: 0.6, type: "spring" }}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#1a1a1a', // Fallback
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            zIndex: 20
                        }}
                    >
                        {/* Front Face (Icon) */}
                        <motion.div
                            animate={{ opacity: isHovered ? 0 : 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <svg className="story-coin-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </motion.div>

                        {/* Back Face (Image Portal) - Revealed on Hover/Flip */}
                        <motion.div
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                rotate: -180 // Counter-rotate content so it's upright when coin flips
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0
                            }}
                        >
                            <img
                                src="https://placehold.co/200x200/1a1a1a/d4af37?text=The+Story"
                                alt="Story"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Link>
        </div>
    );
};

export default OurStoryLink;
