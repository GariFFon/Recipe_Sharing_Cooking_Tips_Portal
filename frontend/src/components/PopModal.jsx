import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PopModal.css';

const PopModal = ({ isOpen, onClose, content }) => {
    if (!content) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="pop-modal-overlay" style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
                    {/* Backdrop with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="pop-modal-backdrop"
                    />

                    {/* Funky Card */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotate: 10, y: 100 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            rotate: -2,
                            y: 0,
                            transition: { type: "spring", bounce: 0.5, duration: 0.8 }
                        }}
                        exit={{
                            scale: 0.8,
                            opacity: 0,
                            rotate: -10,
                            y: 50,
                            transition: { duration: 0.3 }
                        }}
                        className="pop-modal-card"
                    >
                        {/* Close Button */}
                        <motion.button
                            onClick={onClose}
                            whileHover={{ rotate: 180, scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="pop-modal-close"
                        >
                            X
                        </motion.button>

                        {/* Content */}
                        <div className="pop-modal-content">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                                className="pop-modal-subtitle"
                            >
                                {content.subtitle}
                            </motion.span>

                            <motion.h2
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1, transition: { delay: 0.3, type: "spring" } }}
                                className="pop-modal-title"
                            >
                                {content.title}
                            </motion.h2>

                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%', transition: { delay: 0.4, duration: 0.8 } }}
                                className="pop-modal-divider"
                            />

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                                className="pop-modal-text"
                                style={{ whiteSpace: 'pre-line' }}
                            >
                                {content.fullText || content.text}
                            </motion.p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1, transition: { delay: 0.6 } }}
                            >
                                <img
                                    src={content.modalImage || content.image}
                                    alt={content.title}
                                    className="pop-modal-image"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PopModal;
