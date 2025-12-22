import React, { useEffect, useRef } from 'react';

const GravityDots = ({ children, className = '' }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let dots = [];
        let animationFrameId;

        // Configuration
        const spacing = 35;
        const pointerEffectRadius = 250;
        const dotBaseRadius = 1.2;
        const returnSpeed = 0.08;
        const mouseForce = 1.2;

        let mouse = { x: -1000, y: -1000 };

        class Dot {
            constructor(x, y) {
                this.originX = x;
                this.originY = y;
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
            }

            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < pointerEffectRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (pointerEffectRadius - dist) / pointerEffectRadius;
                    const push = force * mouseForce;

                    this.vx -= Math.cos(angle) * push;
                    this.vy -= Math.sin(angle) * push;
                }

                this.vx += (this.originX - this.x) * returnSpeed;
                this.vy += (this.originY - this.y) * returnSpeed;
                this.vx *= 0.9;
                this.vy *= 0.9;

                this.x += this.vx;
                this.y += this.vy;
            }

            draw(color) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, dotBaseRadius, 0, Math.PI * 2);

                const distFromCenter = Math.sqrt(Math.pow(this.x - width / 2, 2) + Math.pow(this.y - height / 2, 2));
                const maxDist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                const alpha = Math.max(0.15, 0.5 - (distFromCenter / maxDist) * 0.4);

                // Handling color string (rgb vs hex) with alpha injection
                if (color && color.startsWith('rgb')) {
                    // Inject alpha into existing rgb/rgba string
                    if (color.startsWith('rgba')) {
                        // Replace last part if needed, but simpler to just use it
                        // Actually, replacing alpha in rgba string is tricky.
                        // Let's assume rgb for simplicity or just use globalAlpha
                        ctx.fillStyle = color;
                        ctx.globalAlpha = alpha;
                    } else {
                        ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
                    }
                } else {
                    // Hex or other formats
                    ctx.fillStyle = color;
                    ctx.globalAlpha = alpha;
                }

                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        const init = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            dots = [];

            const cols = Math.ceil(width / spacing);
            const rows = Math.ceil(height / spacing);
            const offsetX = (width - ((cols - 1) * spacing)) / 2;
            const offsetY = (height - ((rows - 1) * spacing)) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    dots.push(new Dot(offsetX + i * spacing, offsetY + j * spacing));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // ROBUST COLOR READING STRATEGY:
            // 1. Try to read the CSS Variable '--life-dots-color' from the container (Lifestyle.css defines this)
            // 2. Fallback to computed 'color' property (inheritance)
            // 3. Last resort fallback to gray

            let color = 'rgb(26, 26, 26)'; // Default Black

            if (containerRef.current) {
                const computed = window.getComputedStyle(containerRef.current);

                // Try reading the variable directly
                const variableColor = computed.getPropertyValue('--life-dots-color').trim();
                if (variableColor) {
                    color = variableColor;
                } else {
                    // Fallback to inherited text color
                    color = computed.color;
                }
            }

            dots.forEach(dot => {
                dot.update();
                dot.draw(color);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => init();
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        init();
        animate();

        window.addEventListener('resize', handleResize);
        if (containerRef.current) {
            containerRef.current.addEventListener('mousemove', handleMouseMove);
            containerRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeEventListener('mousemove', handleMouseMove);
                containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className={`gravity-dots-container ${className}`} style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            // Ensure this container sees the variable from parent .life-hero-fullscreen
            color: 'var(--life-dots-color, #1a1a1a)'
        }}>
            <canvas ref={canvasRef} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }} />
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {children}
            </div>
        </div>
    );
};

export default GravityDots;
