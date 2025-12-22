import React, { useRef, useEffect } from 'react';
import './FocusReveal.css';

export default function InteractiveFocusText({ text }) {
    const containerRef = useRef(null);
    const requestRef = useRef();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const chars = Array.from(container.querySelectorAll('.focus-char'));
        let mouseX = -1000;
        let mouseY = -1000;
        let isHovering = false;

        const updateChars = () => {
            if (!isHovering) return;

            chars.forEach(char => {
                if (char.classList.contains('space')) return;

                const rect = char.getBoundingClientRect();
                const charCenterX = rect.left + rect.width / 2;
                const charCenterY = rect.top + rect.height / 2;

                const dist = Math.sqrt(
                    Math.pow(mouseX - charCenterX, 2) +
                    Math.pow(mouseY - charCenterY, 2)
                );

                const radius = 250; // Effect radius in px

                if (dist < radius) {
                    const progress = 1 - (dist / radius);
                    // progress 0 to 1 (1 is center/cursor)

                    const blurAmount = (1 - progress) * 8; // 0 at center, 8 at edge
                    const opacityAmount = 0.3 + (progress * 0.7); // 1 at center, 0.3 at edge
                    const scaleAmount = 1 + (progress * 0.1);

                    char.style.filter = `blur(${blurAmount}px)`;
                    char.style.opacity = opacityAmount.toString();
                    char.style.transform = `scale(${scaleAmount})`;
                } else {
                    char.style.filter = 'blur(8px)';
                    char.style.opacity = '0.3';
                    char.style.transform = 'scale(1)';
                }
            });

            requestRef.current = requestAnimationFrame(updateChars);
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isHovering) {
                isHovering = true;
                if (!requestRef.current) requestRef.current = requestAnimationFrame(updateChars);
            }
        };

        const handleMouseEnter = () => {
            isHovering = true;
            if (!requestRef.current) requestRef.current = requestAnimationFrame(updateChars);
        };

        const handleMouseLeave = () => {
            isHovering = false;
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }

            // Reset to "Inactive" state
            chars.forEach(char => {
                if (!char.classList.contains('space')) {
                    char.style.transition = 'all 0.5s ease-out';
                    char.style.filter = 'blur(5px)';
                    char.style.opacity = '0.5';
                    char.style.transform = 'scale(1)';
                }
            });
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        // Initial State
        handleMouseLeave();

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [text]);

    return (
        <div ref={containerRef} className="interactive-focus-container">
            {text.split(' ').map((word, i) => (
                <span key={i} className="focus-word">
                    {word.split('').map((char, j) => (
                        <span key={j} className="focus-char">{char}</span>
                    ))}
                    <span className="focus-char space">&nbsp;</span>
                </span>
            ))}
        </div>
    );
}
