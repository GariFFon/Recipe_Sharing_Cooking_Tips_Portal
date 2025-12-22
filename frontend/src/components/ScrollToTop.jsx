import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // Immediate reset
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });

        // Fallback for some browsers/situations where layout shifts happen after render
        const rafId = requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant',
            });
        });

        return () => cancelAnimationFrame(rafId);
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
