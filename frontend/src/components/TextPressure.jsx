// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
    const val = maxVal - Math.abs((maxVal * distance) / maxDist);
    return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const TextPressure = ({
    text = 'Compressa',
    fontFamily = 'Compressa VF',
    fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',

    width = true,
    weight = true,
    italic = true,
    alpha = false,

    flex = true,
    stroke = false,
    scale = false,

    textColor = '#FFFFFF',
    strokeColor = '#FF0000',
    className = '',

    minFontSize = 24
}) => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const spansRef = useRef([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [fontSize, setFontSize] = useState(minFontSize);
    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);

    const chars = text.split('');

    useEffect(() => {
        const handleMouseMove = e => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;
        };
        const handleTouchMove = e => {
            const t = e.touches[0];
            cursorRef.current.x = t.clientX;
            cursorRef.current.y = t.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        if (containerRef.current) {
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            mouseRef.current.x = left + width / 2;
            mouseRef.current.y = top + height / 2;
            cursorRef.current.x = mouseRef.current.x;
            cursorRef.current.y = mouseRef.current.y;
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const setSize = useCallback(() => {
        if (!containerRef.current || !titleRef.current) return;

        const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

        let newFontSize = containerW / (chars.length / 2);
        newFontSize = Math.max(newFontSize, minFontSize);

        setFontSize(newFontSize);
        setScaleY(1);
        setLineHeight(1);

        requestAnimationFrame(() => {
            if (!titleRef.current) return;
            const textRect = titleRef.current.getBoundingClientRect();

            if (scale && textRect.height > 0) {
                const yRatio = containerH / textRect.height;
                setScaleY(yRatio);
                setLineHeight(yRatio);
            }
        });
    }, [chars.length, minFontSize, scale]);

    useEffect(() => {
        const debouncedSetSize = debounce(setSize, 100);
        debouncedSetSize();
        window.addEventListener('resize', debouncedSetSize);
        return () => window.removeEventListener('resize', debouncedSetSize);
    }, [setSize]);

    useEffect(() => {
        let rafId;
        const animate = () => {
            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = titleRect.width / 2;

                spansRef.current.forEach(span => {
                    if (!span) return;

                    const rect = span.getBoundingClientRect();
                    const charCenter = {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2
                    };

                    const d = dist(mouseRef.current, charCenter);

                    const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
                    const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
                    const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
                    const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

                    const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

                    if (span.style.fontVariationSettings !== newFontVariationSettings) {
                        span.style.fontVariationSettings = newFontVariationSettings;
                    }
                    if (alpha && span.style.opacity !== alphaVal) {
                        span.style.opacity = alphaVal;
                    }
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [width, weight, italic, alpha]);

    const styleElement = useMemo(() => {
        return (
            <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }

        .flex {
          display: flex;
          justify-content: space-between;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }

        .text-pressure-line {
          display: block;
          width: 100%;
        }
      `}</style>
        );
    }, [fontFamily, fontUrl, flex, stroke, textColor, strokeColor]);

    const dynamicClassName = [className, flex ? 'flex' : '', stroke ? 'stroke' : ''].filter(Boolean).join(' ');

    // Split text into lines if it contains a pipe character
    const lines = text.split('|');
    const isMultiLine = lines.length > 1;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: 'transparent'
            }}
        >
            {styleElement}
            <h1
                ref={titleRef}
                className={`text-pressure-title ${dynamicClassName}`}
                style={{
                    fontFamily,
                    textTransform: 'uppercase',
                    fontSize: fontSize,
                    lineHeight: isMultiLine ? 0.9 : lineHeight,
                    transform: `scale(1, ${scaleY})`,
                    transformOrigin: 'center top',
                    margin: 0,
                    textAlign: 'center',
                    userSelect: 'none',
                    whiteSpace: isMultiLine ? 'normal' : 'nowrap',
                    fontWeight: 100,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {isMultiLine ? (
                    lines.map((line, lineIndex) => {
                        const lineChars = line.split('');
                        const charOffset = lines.slice(0, lineIndex).join('').length;
                        return (
                            <span
                                key={lineIndex}
                                className="text-pressure-line"
                                style={{
                                    fontSize: lineIndex === 0 ? '1em' : '0.85em',
                                    fontWeight: lineIndex === 0 ? 900 : 400,
                                    fontStyle: lineIndex === 0 ? 'normal' : 'italic',
                                    marginTop: lineIndex === 1 ? '-0.15em' : 0,
                                    transform: lineIndex === 1 ? 'rotate(-2deg)' : 'none',
                                    position: 'relative',
                                    zIndex: lineIndex === 1 ? 2 : 1,
                                    textShadow: lineIndex === 0 ? '3px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
                                }}
                            >
                                {lineChars.map((char, i) => {
                                    const globalIndex = charOffset + i;
                                    return (
                                        <span
                                            key={globalIndex}
                                            ref={el => (spansRef.current[globalIndex] = el)}
                                            data-char={char}
                                            style={{
                                                display: 'inline-block',
                                                color: lineIndex === 0 ? textColor : '#d4a373'
                                            }}
                                        >
                                            {char}
                                        </span>
                                    );
                                })}
                            </span>
                        );
                    })
                ) : (
                    chars.map((char, i) => (
                        <span
                            key={i}
                            ref={el => (spansRef.current[i] = el)}
                            data-char={char}
                            style={{
                                display: 'inline-block',
                                color: stroke ? undefined : textColor
                            }}
                        >
                            {char}
                        </span>
                    ))
                )}
            </h1>
        </div>
    );
};

export default TextPressure;
