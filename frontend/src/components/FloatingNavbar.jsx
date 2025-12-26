import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiMenu, FiX } from "react-icons/fi";
import "@theme-toggles/react/css/Within.css";
import { Within } from "@theme-toggles/react";
import "./FloatingNavbar.css";

export const FloatingNavbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="floating-nav-container">
                <Link to="/" className="nav-logo" id="tour-logo">
                    <span className="logo-text">The</span>
                    <span className="logo-accent">Every</span>
                    <span className="logo-text">Kitchen</span>
                </Link>

                {/* Desktop Tabs - Centered */}
                <div className="desktop-menu" id="tour-menu">
                    <SlideTabs />
                </div>

                {/* Right Side Actions Group */}
                <div className="nav-right-group">
                    <NavActions />
                    {/* Mobile Toggle */}
                    <button
                        className={`mobile-toggle-btn ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="hamburger-box">
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

const SlideTabs = () => {
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });
    const { user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();

    // Store refs to tab elements
    const tabsRef = useRef({});

    // Function to update position to a specific tab
    const updatePositionToTab = (path) => {
        const el = tabsRef.current[path];
        if (el) {
            const { width } = el.getBoundingClientRect();
            const offsetLeft = el.offsetLeft;
            setPosition({
                left: offsetLeft,
                width,
                opacity: 1,
            });
        }
    };

    // Update position when location changes
    useEffect(() => {
        // Map current path to tab key
        let currentPath = location.pathname;
        updatePositionToTab(currentPath);
    }, [location.pathname, user]);

    return (
        <>
            <ul
                onMouseLeave={() => {
                    // Revert to active tab on mouse leave
                    let currentPath = location.pathname;

                    const el = tabsRef.current[currentPath];
                    if (el) {
                        updatePositionToTab(currentPath);
                    } else {
                        setPosition((pv) => ({ ...pv, opacity: 0 }));
                    }
                }}
                className="slide-tabs"
            >
                <Tab setPosition={setPosition} to="/" tabsRef={tabsRef}>Home</Tab>
                <Tab setPosition={setPosition} to="/recipes" tabsRef={tabsRef}>Recipes</Tab>
                <Tab setPosition={setPosition} to="/lifestyle" tabsRef={tabsRef}>Lifestyle</Tab>
                <Tab setPosition={setPosition} to="/about" tabsRef={tabsRef}>About</Tab>
                {/* <Tab setPosition={setPosition} to="/team" tabsRef={tabsRef}>Team</Tab> */}

                <Cursor position={position} />
            </ul>
        </>
    );
};

const NavActions = () => {
    const { user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="nav-actions">
            {/* Theme Toggle */}
            <div className="theme-toggle-wrapper" id="tour-theme-toggle">
                <Within
                    duration={750}
                    toggled={isDarkMode}
                    toggle={toggleTheme}
                    className="theme-toggle"
                />
            </div>

            {/* Auth Buttons (Hidden on Mobile) */}
            <div className="nav-auth-buttons" id="tour-auth-profile">
                {user ? (
                    <Link to="/profile" className="nav-profile-btn">
                        {user.name ? user.name.split(' ')[0] : 'Profile'}
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="nav-login-btn">Login</Link>
                        <Link to="/signup" className="nav-signup-btn">Sign Up</Link>
                    </>
                )}
            </div>
        </div>
    );
};

const Tab = ({ children, setPosition, to, tabsRef }) => {
    const ref = useRef(null);

    // Register ref
    useEffect(() => {
        if (tabsRef && ref.current) {
            tabsRef.current[to] = ref.current;
        }
    }, [to, tabsRef]);

    return (
        <li
            ref={ref}
            onMouseEnter={() => {
                if (!ref?.current) return;

                const { width } = ref.current.getBoundingClientRect();
                const offsetLeft = ref.current.offsetLeft;

                setPosition({
                    left: offsetLeft,
                    width,
                    opacity: 1,
                });
            }}
            style={{ listStyle: 'none' }}
        >
            <Link to={to} className="tab-item">
                {children}
            </Link>
        </li>
    );
};

const Cursor = ({ position }) => {
    return (
        <motion.li
            animate={{
                left: position.left,
                width: position.width,
                opacity: position.opacity,
            }}
            className="tab-cursor"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ listStyle: 'none' }}
        />
    );
};

const MobileMenu = ({ onClose }) => {
    const { user } = useAuth();

    // "Circular Reveal" - Expands from the button position
    const menuVariants = {
        closed: {
            clipPath: "circle(0px at calc(100% - 5%) 2.35rem)", // Precise button center
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            clipPath: "circle(140% at calc(100% - 5%) 2.35rem)", // Stops just behind button
            transition: {
                type: "spring",
                stiffness: 20,
                damping: 10
            }
        }
    };

    // Staggered Text Animations - Ultra Smooth
    const containerVariants = {
        open: {
            transition: {
                staggerChildren: 0.07, // Tighter stagger for flow
                delayChildren: 0.15 // Start sooner after circle opens
            }
        },
        closed: {
            transition: {
                staggerChildren: 0.03,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        closed: {
            y: 30,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        open: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100, // Softer spring
                damping: 15, // Less damping = more bounce
                mass: 0.8 // Lighter feel
            }
        }
    };

    const links = [
        { path: "/", label: "Home" },
        { path: "/recipes", label: "Recipes" },
        { path: "/lifestyle", label: "Lifestyle" },
        { path: "/about", label: "About" },
        { path: user ? "/profile" : "/login", label: user ? "Profile" : "Login" }
    ];

    return (
        <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="mobile-menu-overlay"
        >
            {/* --- Split Axis Background --- */}
            <div className="mm-split-axis"></div>

            {/* --- Main Navigation --- */}
            <div className="mm-nav-wrapper">
                <motion.nav
                    className="mm-nav-container"
                    variants={containerVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                >
                    {links.map((link, index) => (
                        <div key={link.path} className="mm-link-row">
                            {/* Left Side: Number */}
                            <motion.div variants={itemVariants} className="mm-number-col">
                                <span className="mm-number">0{index + 1}</span>
                            </motion.div>

                            {/* Right Side: Link */}
                            <motion.div variants={itemVariants} className="mm-text-col">
                                <Link
                                    to={link.path}
                                    onClick={onClose}
                                    className="mm-link-item"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        </div>
                    ))}
                </motion.nav>
            </div>

            {/* --- Footer --- */}
            <motion.div
                className="mm-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="mm-socials">
                    <a href="#" className="mm-social-link">Instagram</a>
                    <a href="#" className="mm-social-link">Twitter</a>
                    <a href="#" className="mm-social-link">Pinterest</a>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FloatingNavbar;