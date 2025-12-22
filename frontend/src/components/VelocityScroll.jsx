import {
    motion,
    useScroll,
    useVelocity,
    useTransform,
    useSpring,
    useAnimationFrame,
    useMotionValue,
} from "framer-motion";
import React, { useRef } from "react";
import "./VelocityScroll.css";

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export const VelocityScroll = ({
    content = "1k+ Recipes 50k Cooks 4.9 Rating 100+ Tips",
    variant = "default",
    tilt = 0
}) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * 2 * (delta / 1000); // reduced base speed

        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    /**
     * Skew effect based on velocity
     */
    const skewX = useTransform(smoothVelocity, [-1000, 1000], [-30, 30]); // Adjusted range for dramatic effect
    const smoothSkew = useSpring(skewX, { mass: 3, stiffness: 400, damping: 50 });

    // Parse content to identify highlighted words
    const renderContent = () => {
        const parts = content.split(' ');
        return parts.map((part, idx) => {
            // Highlight words that are capitalized or contain numbers
            const shouldHighlight = /[A-Z]/.test(part) || /\d/.test(part);
            return shouldHighlight ? (
                <span key={idx} className="velocity-highlight">{part} </span>
            ) : (
                <span key={idx}>{part} </span>
            );
        });
    };

    return (
        <section className={`velocity-scroll-section variant-${variant}`} style={{ transform: `rotate(${tilt}deg)` }}>
            <div className="velocity-scroll-wrapper">
                <motion.div className="velocity-text" style={{ x, skewX: smoothSkew }}>
                    {/* Render content multiple times to ensure seamless infinite scroll */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i}>
                            {renderContent()}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default VelocityScroll;
